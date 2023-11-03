from flask import Blueprint, jsonify, abort
from utils import data_directory, distance_df, read_supernova_data
import os

get_routes = Blueprint('get_routes', __name__)


@get_routes.route('/all_supernovae', methods=['GET'])
def all_supernovae():
    try:
        supernovae = [file.split('_')[0] for file in os.listdir(data_directory) if file.endswith('.dat')]
        return jsonify(supernovae)
    except Exception as e:
        abort(500, description="Internal Server Error")


@get_routes.route('/get_filters/<supernova>', methods=['GET'])
def get_filters(supernova):
    try:
        data = read_supernova_data(supernova)
        available_filters = data["Filter"].unique().tolist()
        return jsonify(available_filters)
    except Exception as e:
        print(e)  # Logging the error for better debugging
        abort(500, description="Internal Server Error")


@get_routes.route('/all_types', methods=['GET'])
def all_types():
    try:
        unique_types = distance_df['type'].dropna().unique().tolist()
        return jsonify(unique_types)
    except Exception as e:
        print(e)  # Logging the error for better debugging
        abort(500, description="Internal Server Error")


@get_routes.route('/get_supernovae_by_type/<type>', methods=['GET'])
def get_supernovae_by_type(type):
    try:
        supernovae_of_type = distance_df[distance_df['type'] == type]['SNname'].tolist()
        available_files = [file.split('_')[0] for file in os.listdir(data_directory) if file.endswith('.dat')]
        supernovae_with_data = [sn for sn in supernovae_of_type if sn in available_files]
        return jsonify(supernovae_with_data)
    except Exception as e:
        print(e)  # Logging the error for better debugging
        abort(500, description="Internal Server Error")

