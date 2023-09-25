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
        data = pd.read_csv(data_path, sep='\\s+', comment='#', header=None, usecols=[0], names=["Filter"])
        available_filters = data["Filter"].unique().tolist()
        return jsonify(available_filters)
    except Exception as e:
        abort(500, description="Internal Server Error")

@app.route('/plot', methods=['POST'])
def plot():
    try:
        data = request.get_json()
        selected_supernovae = data.get('selectedSupernovae', {})
        highlighted_supernovae = data.get('highlightedSupernovae', [])
        x_axis_type = data.get('xAxisType', 'MJD')

        fig = go.Figure()
        for supernova, filters in selected_supernovae.items():
            data_path = get_data_path(supernova)
            data = pd.read_csv(data_path, sep='\\s+', comment='#', header=None)
            data.columns = ['Filter', 'Date', 'Magnitude', 'MagnitudeError'] + ['Extra_' + str(i) for i in range(data.shape[1] - 4)]
            if x_axis_type == 'DaysSince':
                min_date = data['Date'].min()
                data['Date'] = data['Date'] - min_date
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
        return fig.to_html(full_html=False)
    except Exception as e:
        abort(500, description="Internal Server Error")

if __name__ == '__main__':
    app.run(debug=True)
