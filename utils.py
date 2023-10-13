import os
import pandas as pd

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

TOLERANCE = 1.0

def closest_date(base_date, date_series, tolerance=TOLERANCE):
    """Find the closest date in date_series to base_date, within the given tolerance."""
    time_diffs = abs(date_series - base_date)
    min_diff = time_diffs.min()
    if min_diff <= tolerance:
        return date_series[time_diffs == min_diff].iloc[0]
    else:
        return None
