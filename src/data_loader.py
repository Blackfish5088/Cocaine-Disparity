# src/data_loader.py
import pandas as pd

def load_data():
    try:
        data = pd.read_csv('data/DF.csv')
        data.dropna(inplace=True)  # Drop rows with missing values
        return data
    except FileNotFoundError:
        print("Data file not found.")
        return pd.DataFrame()
