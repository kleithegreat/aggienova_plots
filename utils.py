import os
import pandas as pd


current_directory = os.path.dirname(os.path.abspath(__file__))
data_directory = os.path.join(current_directory, 'data')
distance_csv_path = os.path.join(current_directory, 'NewSwiftSNweblist.csv')

distance_df = pd.read_csv(distance_csv_path)

TOLERANCE = 1.0  # for plotting colors


def read_supernova_data(supernova: str) -> pd.DataFrame:
    """Return a DataFrame from the .dat file for the given supernova."""
    data_directory = "./data"

    # Get the path to the .dat file
    file_path = os.path.join(data_directory, f"{supernova}_uvotB15.1.dat")

    # Read the .dat file
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



def closest_date(base_date: pd.Timestamp, date_series: pd.Series, tolerance=TOLERANCE) -> pd.Timestamp:
    """Find the closest date in date_series to base_date, within the given tolerance."""
    time_diffs = abs(date_series - base_date)
    min_diff = time_diffs.min()
    if min_diff <= tolerance:
        return date_series[time_diffs == min_diff].iloc[0]
    else:
        return None
