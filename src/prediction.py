# src/prediction.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from src.data_loader import load_data

def train_model():
    data = load_data()
    if data.empty:
        return None
    
    # Preprocessing
    X = data[['race', 'drug_type', 'year']]  # Select relevant features
    y = (data['sentence_length'] < 36).astype(int)  # Binary target
    
    # Encoding categorical data if needed (e.g., one-hot encoding)
    X = pd.get_dummies(X, drop_first=True)

    # Model training
    model = LogisticRegression()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    
    return model
