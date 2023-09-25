from flask import Flask, render_template, request, jsonify, abort
import pandas as pd
import plotly.graph_objects as go
import os

# Initialize Flask app
app = Flask(__name__)

# Directory where the data files are located
data_directory = "./data"

def get_data_path(supernova):
    return os.path.join(data_directory, f"{supernova}_uvotB15.1.dat")

# Endpoint to get all supernovae names
@app.route('/all_supernovae', methods=['GET'])
def all_supernovae():
    try:
        supernovae = [file.split('_')[0] for file in os.listdir(data_directory) if file.endswith('.dat')]
        return jsonify(supernovae)
    except Exception as e:
        abort(500, description="Internal Server Error")

# Main homepage
@app.route('/')
def index():
    supernovae = [file.split('_')[0] for file in os.listdir(data_directory) if file.endswith('.dat')]
    # Display the HTML template and pass the supernovae list to it
    return render_template('index.html', supernovae=supernovae)

# Endpoint to get filter names for a given supernova
@app.route('/get_filters/<supernova>', methods=['GET'])
def get_filters(supernova):
    try:
        data_path = get_data_path(supernova)
        data = pd.read_csv(data_path, sep='\\s+', comment='#', header=None, usecols=[0], names=["Filter"])
        available_filters = data["Filter"].unique().tolist()
        return jsonify(available_filters)
    except Exception as e:
        abort(500, description="Internal Server Error")

# Endpoint to plot the selected data
@app.route('/plot', methods=['POST'])
def plot():
    try:
        data = request.get_json()
        selected_supernovae = data.get('selectedSupernovae', {})
        x_axis_type = data.get('xAxisType', 'MJD')  # MJD or DaysSince

        fig = go.Figure()
        for supernova, filters in selected_supernovae.items():
            data_path = get_data_path(supernova)
            data = pd.read_csv(data_path, sep='\\s+', comment='#', header=None)
            data.columns = ['Filter', 'Date', 'Magnitude', 'MagnitudeError'] + ['Extra_' + str(i) for i in range(data.shape[1] - 4)]
            
            if x_axis_type == 'DaysSince':
                min_date = data['Date'].min()
                data['Date'] = data['Date'] - min_date  # Calculate days since first observation

            for filter_type in filters:
                filter_data = data[data['Filter'] == filter_type]
                fig.add_trace(go.Scatter(
                    x=filter_data['Date'],
                    y=filter_data['Magnitude'],
                    mode='lines+markers',
                    name=f"{supernova} - {filter_type}",
                    error_y=dict(
                        type='data',
                        array=filter_data['MagnitudeError'],
                        visible=True
                    )
                ))
        fig.update_layout(title="Light Curves", xaxis_title="Date", yaxis_title="Magnitude", height=600, width=800)
        fig.update_yaxes(autorange="reversed")
        plot = fig.to_html(full_html=False)
        return plot
    except Exception as e:
        abort(500, description="Internal Server Error")


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
