# app.py
from flask import Flask, render_template, request, jsonify
from src.prediction import train_model
import pandas as pd

app = Flask(__name__)
model = train_model()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not available'})
    
    data = request.json
    df = pd.DataFrame([data])
    
    # Encode data to match the model's format
    df = pd.get_dummies(df, drop_first=True).reindex(columns=model.feature_names_in_, fill_value=0)
    
    prediction = model.predict(df)[0]
    return jsonify({'prediction': int(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
