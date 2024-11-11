# src/data_loader.py
import pandas as pd

def load_data():
    try:
        data = pd.read_csv('data/DF.csv')
        # Basic cleaning
        data.dropna(inplace=True)  # Drop missing values for now
        return data
    except FileNotFoundError:
        print("Data file not found.")
        return pd.DataFrame()
