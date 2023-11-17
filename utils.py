import os
import glob
import pandas as pd

current_directory = os.path.dirname(os.path.abspath(__file__))
data_directory = os.path.join(current_directory, 'data')
distance_csv_path = os.path.join(current_directory, 'NewSwiftSNweblist.csv')

distance_df = pd.read_csv(distance_csv_path)

TOLERANCE = 1.0  # for plotting colors


def read_supernova_data(supernova: str) -> pd.DataFrame:
    """Read the data for the given supernova from the data directory.

    Args:
        supernova (str): Name of the supernova.

    Raises:
        ValueError: If no file is found or if the header line is not found in the .dat file.

    Returns:
        pd.DataFrame: Data for the given supernova.
    """
    # Search for files matching the supernova name and ending with .dat
    file_pattern = os.path.join(data_directory, f"{supernova}*.dat")
    matching_files = glob.glob(file_pattern)

    if not matching_files:
        raise ValueError(f"No data file found for supernova {supernova}")

    file_path = matching_files[0]  # Assuming the supernova name is unique, so only one file matches

    # Find start of actual data
    with open(file_path, 'r') as file:
        lines = file.readlines()
        for idx, line in enumerate(lines):
            if line.startswith('# Filter'):
                header_line = idx
                break
        else:
            raise ValueError("Header line not found in .dat file.")

    data = pd.read_csv(file_path, skiprows=header_line + 1, sep=r'\s+', comment='#', engine='python', header=None)
    data.columns = lines[header_line].replace("# ", "").split()

    return data


def closest_date(base_date: pd.Timestamp, date_series: pd.Series, tolerance=TOLERANCE) -> pd.Timestamp:
    """Return the closest date in the given series to the given base date.

    Args:
        base_date (pd.Timestamp): Base date to compare to.
        date_series (pd.Series): Series of dates to compare to.
        tolerance (_type_, optional): Maximum difference between dates to be considered "close". Defaults to TOLERANCE.

    Raises:
        ValueError: If no date within tolerance is found.

    Returns:
        pd.Timestamp: Closest date in the given series to the given base date.
    """
    time_diffs = abs(date_series - base_date)
    min_diff = time_diffs.min()
    if min_diff <= tolerance:
        return date_series[time_diffs == min_diff].iloc[0]
    else:
        raise ValueError("No date within tolerance found.")
