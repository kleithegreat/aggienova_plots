from flask import Blueprint, request, make_response, abort
import pandas as pd
from utils import get_data_path, read_dat_file, data_directory, distance_df
import plotly.graph_objects as go

post_routes = Blueprint('post_routes', __name__)


@post_routes.route('/plot', methods=['POST'])
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


@post_routes.route('/plot', methods=['POST'])
def plot_colors():
    try:
        data = request.get_json()
        selected_supernovae = data.get('selectedSupernovae', {})
        band1 = data.get('band1')
        band2 = data.get('band2')

        missing_modulus_sns = []

        fig = go.Figure()
        for supernova in selected_supernovae:
            data_path = get_data_path(supernova)
            data = read_dat_file(data_path)
            data.columns = ['Filter', 'Date', 'Magnitude', 'MagnitudeError'] + ['Extra_' + str(i) for i in range(data.shape[1] - 4)]
            
            # Adjust for days since observation
            min_date = data['Date'].min()
            data['Date'] = data['Date'] - min_date
            
            # Adjusting magnitude for absolute magnitude
            modulus = distance_df[distance_df['SNname'].str.lower() == supernova.lower()]['Distance_best'].values
            if modulus.size > 0 and not pd.isna(modulus[0]):
                data['Magnitude'] = data['Magnitude'] - modulus[0]
            else:
                missing_modulus_sns.append(supernova)

            band1_data = data[data['Filter'] == band1]
            band2_data = data[data['Filter'] == band2]

            # Compute color by subtracting magnitudes of the bands
            merged_data = pd.merge(band1_data, band2_data, on='Date', suffixes=('_band1', '_band2'))
            merged_data['Color'] = merged_data['Magnitude_band1'] - merged_data['Magnitude_band2']

            fig.add_trace(go.Scatter(
                x=merged_data['Date'],
                y=merged_data['Color'],
                mode='lines+markers',
                name=f"{supernova} ({band1} - {band2})"
            ))

        fig.update_xaxes(title_text="Days Since First Observation")
        fig.update_layout(title="Supernovae Color Curves", margin={"r": 0, "t": 40, "l": 0, "b": 0})

        # Return error if distance modulus is missing for any supernova
        if missing_modulus_sns:
            error_msg = "No distance modulus data for: " + ", ".join(missing_modulus_sns)
            return make_response(error_msg, 400)
        
        return fig.to_html(full_html=False)

    except Exception as e:
        print(e)  # Logging the error for better debugging
        abort(500, description="Internal Server Error")

