from flask import Flask, render_template, request, jsonify, abort, make_response
import pandas as pd
import plotly.graph_objects as go
import os

# Initialize Flask app
app = Flask(__name__)

# Directory where the data files are located
data_directory = "./data"

# Load the CSV with distance modulus data
current_directory = os.path.dirname(os.path.abspath(__file__))
distance_csv_path = os.path.join(current_directory, 'NewSwiftSNweblist.csv')
distance_df = pd.read_csv(distance_csv_path)


def get_data_path(supernova):
    return os.path.join(data_directory, f"{supernova}_uvotB15.1.dat")


def read_dat_file(file_path):
    # Skip the comment lines at the beginning to find the header
    with open(file_path, 'r') as file:
        lines = file.readlines()
        for idx, line in enumerate(lines):
            if line.startswith('# Filter'):
                header_line = idx
                break
        else:
            raise ValueError("Header line not found in .dat file.")

    # Read the actual data using the identified header line
    data = pd.read_csv(file_path, skiprows=header_line + 1, sep=r'\s+', comment='#', engine='python', header=None)
    data.columns = lines[header_line].replace("# ", "").split()

    return data


@app.route('/all_supernovae', methods=['GET'])
def all_supernovae():
    try:
        supernovae = [file.split('_')[0] for file in os.listdir(data_directory) if file.endswith('.dat')]
        return jsonify(supernovae)
    except Exception as e:
        abort(500, description="Internal Server Error")


@app.route('/')
def index():
    supernovae = [file.split('_')[0] for file in os.listdir(data_directory) if file.endswith('.dat')]
    return render_template('index.html', supernovae=supernovae)


@app.route('/get_filters/<supernova>', methods=['GET'])
def get_filters(supernova):
    try:
        data_path = get_data_path(supernova)
        data = read_dat_file(data_path)
        available_filters = data["Filter"].unique().tolist()
        return jsonify(available_filters)
    except Exception as e:
        print(e)  # Logging the error for better debugging
        abort(500, description="Internal Server Error")


@app.route('/plot', methods=['POST'])
def plot():
    try:
        data = request.get_json()
        selected_supernovae = data.get('selectedSupernovae', {})
        highlighted_supernovae = data.get('highlightedSupernovae', [])
        x_axis_type = data.get('xAxisType', 'MJD')
        y_axis_type = data.get('yAxisType', 'Apparent')

        missing_modulus_sns = []

        fig = go.Figure()
        for supernova, filters in selected_supernovae.items():
            data_path = get_data_path(supernova)
            data = read_dat_file(data_path)
            data.columns = ['Filter', 'Date', 'Magnitude', 'MagnitudeError'] + ['Extra_' + str(i) for i in range(data.shape[1] - 4)]
            if x_axis_type == 'DaysSince':
                min_date = data['Date'].min()
                data['Date'] = data['Date'] - min_date
            
            # Adjusting magnitude for absolute magnitude if requested
            if y_axis_type == 'Absolute':
                modulus = distance_df[distance_df['SNname'].str.lower() == supernova.lower()]['Distance_best'].values
                if modulus.size > 0 and not pd.isna(modulus[0]):
                    data['Magnitude'] = data['Magnitude'] - modulus[0]
                else:
                    missing_modulus_sns.append(supernova)
            
            for filter_type in filters:
                filter_data = data[data['Filter'] == filter_type]
                line_width = 3 if supernova in highlighted_supernovae else 1
                fig.add_trace(go.Scatter(
                    x=filter_data['Date'],
                    y=filter_data['Magnitude'],
                    mode='lines+markers',
                    name=f"{supernova} - {filter_type}",
                    line=dict(width=line_width),
                    error_y=dict(
                        type='data',
                        array=filter_data['MagnitudeError'],
                        visible=True
                    )
                ))

        fig.update_yaxes(autorange="reversed")
        fig.update_xaxes(title_text=x_axis_type)
        fig.update_layout(title="Supernovae Light Curves", margin={"r": 0, "t": 40, "l": 0, "b": 0})
        
        # Return error if distance modulus is missing for any supernova
        if missing_modulus_sns:
            error_msg = "No distance modulus data for: " + ", ".join(missing_modulus_sns)
            return make_response(error_msg, 400)
        
        return fig.to_html(full_html=False)
    except Exception as e:
        print(e)  # Logging the error for better debugging
        abort(500, description="Internal Server Error")


if __name__ == "__main__":
    app.run(debug=True)
