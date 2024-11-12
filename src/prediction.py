# src/prediction.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from src.data_loader import load_data

def train_model():
    data = load_data()
    if data.empty:
        return None
    
    # Features and target based on DF.csv columns
    X = data[['Race', 'Drug_Type', 'Year']]
    y = (data['Average_Sentence_Length_Months'] < 36).astype(int)  # Target: sentence length below 36 months
    
    # One-hot encoding for categorical data
    X = pd.get_dummies(X, drop_first=True)

    # Train logistic regression model
    model = LogisticRegression()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    
    return model
