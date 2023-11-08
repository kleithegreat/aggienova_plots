from flask import Blueprint, request, make_response, abort, jsonify
from utils import read_supernova_data, distance_df, closest_date
import pandas as pd
import plotly.graph_objects as go

post_routes = Blueprint('post_routes', __name__)


@post_routes.route('/plot', methods=['POST'])
def plot():
    """Plots the light curves for the selected supernovae and filters.

    Returns:
        str: HTML string of the plotly figure
    """
    try:
        request_data = request.get_json()
        selected_supernovae = request_data["selectedSupernovae"]
        highlighted_supernovae = request_data["highlightedSupernovae"]
        x_axis_type = request_data["xAxisType"]
        y_axis_type = request_data["yAxisType"]

        missing_modulus_sns = []

        fig = go.Figure()

        # iterate over each supernova and its list of filters in selected_supernovae
        for supernova, filters in selected_supernovae.items():
            supernova = supernova.upper()
            sn_data = read_supernova_data(supernova)
            sn_data = sn_data[["Filter", "MJD[days]", "Mag", "MagErr"]]
            sn_data.columns = ["filter", "date", "magnitude", "magnitude_error"]

            # adjust dates if necessary
            if x_axis_type == "DaysSince":
                min_date = sn_data['date'].min()
                sn_data['date'] = sn_data['date'] - min_date
            
            # adjust magnitude if necessary
            if y_axis_type == 'Absolute':
                modulus = distance_df[distance_df['SNname'].str.lower() == supernova.lower()]['Distance_best'].values
                if modulus.size > 0 and not pd.isna(modulus[0]):
                    sn_data['magnitude'] = sn_data['magnitude'] - modulus[0]
                else:
                    missing_modulus_sns.append(supernova)
            
            # plot each filter for the supernova
            for filter_type in filters:
                filter_data = sn_data[sn_data["filter"] == filter_type]
                line_width = 3 if supernova in highlighted_supernovae else 1

                fig.add_trace(go.Scatter(
                    x=filter_data["date"],
                    y=filter_data["magnitude"],
                    mode='lines+markers',
                    name=f"{supernova} - {filter_type}",
                    line=dict(width=line_width),
                    error_y=dict(
                        type='data',
                        array=filter_data["magnitude_error"],
                        visible=True
                    )
                ))

        fig.update_yaxes(autorange="reversed")

        x_title = "Days Since First Observation" if x_axis_type == "DaysSince" else "Modified Julian Date"
        y_title = "Absolute Magnitude" if y_axis_type == "Absolute" else "Apparent Magnitude"
        fig.update_xaxes(title_text=x_title)
        fig.update_yaxes(title_text=y_title)

        fig.update_layout(title="Supernovae Light Curves", margin={"r": 0, "t": 40, "l": 0, "b": 0})
        
        # return error if distance modulus is missing for any supernova
        if missing_modulus_sns:
            error_msg = "No distance modulus data for: " + ", ".join(missing_modulus_sns)
            return make_response(error_msg, 400)
        
        # return fig.to_html(full_html=False)

        # Instead of converting the figure to HTML, build a JSON representation
        # of the data and layout for the front end to consume
        figure_json = fig.to_json()

        # Return that JSON
        return jsonify(figure_json)
    
    except Exception as e:
        abort(500, description="/plot endpoint failed with error: " + str(e))


@post_routes.route('/plot_colors', methods=['POST'])
def plot_colors():
    """Plots the color curves for the selected supernovae and filters.

    Returns:
        str: HTML string of the plotly figure
    """
    try:
        request_data = request.get_json()

        selected_supernovae = request_data["selectedSupernovae"]
        band1 = request_data["band1"]
        band2 = request_data["band2"]

        missing_modulus_sns = []

        fig = go.Figure()

        for supernova in selected_supernovae:
            sn_data = read_supernova_data(supernova)
            sn_data = sn_data[["Filter", "MJD[days]", "Mag", "MagErr"]]
            sn_data.columns = ["filter", "date", "magnitude", "magnitude_error"]
            
            # adjust for days since first observation
            min_date = sn_data["date"].min()
            sn_data["date"] = sn_data["date"] - min_date
            
            # adjust magnitude for absolute magnitude
            modulus = distance_df[distance_df['SNname'].str.lower() == supernova.lower()]['Distance_best'].values  # TODO MAKE SURE THIS WORKS
            if modulus.size > 0 and not pd.isna(modulus[0]):
                sn_data['magnitude'] = sn_data['magnitude'] - modulus[0]
            else:
                missing_modulus_sns.append(supernova)

            band1_data = sn_data[sn_data['filter'] == band1].copy()
            band2_data = sn_data[sn_data['filter'] == band2]
            
            # Compute color using a tolerance-based approach
            colors = []
            dates = []
            for date in band1_data['date']:
                try:
                    closest_band2_date = closest_date(date, band2_data['date'])
                    color = band1_data[band1_data['date'] == date]['magnitude'].iloc[0] - band2_data[band2_data['date'] == closest_band2_date]['magnitude'].iloc[0]
                    colors.append(color)
                    dates.append(date)
                except ValueError:
                    continue
            
            fig.add_trace(go.Scatter(
                x=dates,
                y=colors,
                mode='lines+markers',
                name=f"{supernova} ({band1} - {band2})"
            ))

        fig.update_xaxes(title_text="Days Since First Observation")
        fig.update_yaxes(title_text="Magnitude")
        fig.update_layout(title="Supernovae Color Curves", margin={"r": 0, "t": 40, "l": 0, "b": 0}, showlegend=True)

        # Return error if distance modulus is missing for any supernova
        if missing_modulus_sns:
            error_msg = "No distance modulus data for: " + ", ".join(missing_modulus_sns)
            return make_response(error_msg, 400)
        
        return fig.to_html(full_html=False)
        figure_json = fig.to_json()
        return jsonify(figure_json)

    except Exception as e:
        abort(500, description="/plot_colors endpoint failed with error: " + str(e))
