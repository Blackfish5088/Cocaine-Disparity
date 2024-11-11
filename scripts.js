// Ensure scripts run after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load the CSV data using PapaParse
  Papa.parse('DF.csv', {
    download: true,
    header: true,
    dynamicTyping: true, // Converts numeric strings to numbers
    complete: function(results) {
      console.log("Data loaded:", results.data);
      window.globalData = results.data;
      // Create visualizations after data is loaded
      createVisualizations(window.globalData);
      // Train the machine learning model
      trainModel(window.globalData);
    },
    error: function(err) {
      console.error("Error loading CSV data:", err);
    }
  });
});

// Function to create visualizations using Plotly.js
function createVisualizations(data) {
  // Filter out any empty or invalid rows
  data = data.filter(row => row.Year && row.Drug_Type && row.Race);

  // Convert Year to string if necessary
  data.forEach(row => {
    row.Year = row.Year.toString();
  });

  // Create an average sentence length chart
  createAverageSentenceChart(data);

  // Create an arrest rate chart
  createArrestRateChart(data);
}

// Existing visualization functions remain unchanged
// ... [createAverageSentenceChart and createArrestRateChart functions] ...

// Global variable to hold the trained model
let trainedModel;

// Function to train the machine learning model
function trainModel(data) {
  // Prepare the data
  const cleanedData = data.filter(row => 
    row.Drug_Type && row.Race && typeof row.Average_Sentence_Length_Months === 'number'
  );

  // Convert categorical data to numerical using one-hot encoding
  const drugTypes = [...new Set(cleanedData.map(row => row.Drug_Type))];
  const races = [...new Set(cleanedData.map(row => row.Race))];

  // Create mappings
  const drugTypeMap = {};
  drugTypes.forEach((type, index) => {
    drugTypeMap[type] = index;
  });

  const raceMap = {};
  races.forEach((race, index) => {
    raceMap[race] = index;
  });

  // Prepare training data
  const xs = cleanedData.map(row => [
    drugTypeMap[row.Drug_Type],
    raceMap[row.Race]
  ]);

  // Calculate overall average sentence length
  const overallAvgSentence = cleanedData.reduce((sum, row) => sum + row.Average_Sentence_Length_Months, 0) / cleanedData.length;

  // Prepare labels: 1 if above average, 0 otherwise
  const ys = cleanedData.map(row => row.Average_Sentence_Length_Months > overallAvgSentence ? 1 : 0);

  // Convert to tensors
  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor1d(ys, 'int32');

  // Define the model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [2], activation: 'sigmoid' }));

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.logLoss,
    metrics: ['accuracy']
  });

  // Train the model
  model.fit(xsTensor, ysTensor, {
    epochs: 100,
    verbose: 0
  }).then(() => {
    console.log('Model training complete');
    trainedModel = model;
    // Clean up tensors
    xsTensor.dispose();
    ysTensor.dispose();
  }).catch(err => {
    console.error('Error during model training:', err);
  });
}

// Function to predict likelihood based on user input
function predictLikelihood() {
  console.log("predictLikelihood function triggered");

  const drugTypeElement = document.getElementById('drugType');
  const raceElement = document.getElementById('race');
  const likelihoodOutput = document.getElementById('likelihoodOutput');

  if (!drugTypeElement || !raceElement || !likelihoodOutput) {
    console.error("One or more elements not found");
    return;
  }

  const drugType = drugTypeElement.value;
  const race = raceElement.value;

  console.log("Selected Drug Type:", drugType);
  console.log("Selected Race:", race);

  if (!trainedModel) {
    likelihoodOutput.textContent = 'Model not trained yet. Please try again in a moment.';
    return;
  }

  // Use the same mappings as during training
  const drugTypes = [...new Set(window.globalData.map(row => row.Drug_Type))];
  const races = [...new Set(window.globalData.map(row => row.Race))];

  const drugTypeMap = {};
  drugTypes.forEach((type, index) => {
    drugTypeMap[type] = index;
  });

  const raceMap = {};
  races.forEach((race, index) => {
    raceMap[race] = index;
  });

  // Prepare the input
  const input = tf.tensor2d([[drugTypeMap[drugType], raceMap[race]]]);

  // Make the prediction
  const prediction = trainedModel.predict(input);
  prediction.array().then(values => {
    const likelihood = (values[0][0] * 100).toFixed(2);
    likelihoodOutput.textContent = `${likelihood}% chance of receiving an above-average sentence length.`;
    console.log("Likelihood Output:", likelihoodOutput.textContent);
    // Clean up tensors
    input.dispose();
    prediction.dispose();
  }).catch(err => {
    console.error('Error during prediction:', err);
    likelihoodOutput.textContent = 'Error during prediction.';
  });
}
