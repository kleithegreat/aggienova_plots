# Aggienova Plots

This is a project done for Dr. Peter Brown's Aggienova project at Texas A&M University. This repository contains a Flask web application for plotting supernova data.

**Features**

- Select supernovae to plot by search or dropdown
- Select which light filters to plot for each supernova
- Plot all supernovae of a certain type
- Toggle the x-axis between modified Julian date and days since first observation
- Toggle the y-axis between apparent and absolute magnitude

The repository is structured as follows:

- app.py: Contains the backend logic
- script.js: Contains the frontend logic
- index.html: The website skeleton
- /data/: A directory containing .dat files which are essentially CSV files that contain all the light curve data for a given supernova
- NewSwiftSNweblist.csv: A CSV containing more information about the supernovae such as their type

**Data Files**

The data files in the /data/ directory contain light curve data for different supernovae. Each file is named after the supernova it represents and contains data such as the magnitude of the supernova in different light filters at different times.
