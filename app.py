# app.py
from flask import Flask, render_template, request, jsonify
from src.prediction import train_model

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
    # Assume data has keys: 'race', 'drug_type', 'year'
    df = pd.DataFrame([data])
    prediction = model.predict(df)[0]
    return jsonify({'prediction': int(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
