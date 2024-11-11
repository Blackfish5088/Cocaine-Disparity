// Define the predictLikelihood function to be accessible globally
window.predictLikelihood = function() {
  console.log("predictLikelihood function triggered");

  // Get selected values for Drug Type and Race
  const drugType = document.getElementById('drugType').value;
  const race = document.getElementById('race').value;

  // Encode inputs based on the model's structure
  const featureArray = [
    drugType === 'Powder Cocaine' ? 1 : 0,
    race === 'Black' ? 1 : 0,
    race === 'Hispanic' ? 1 : 0
  ];

  // Dummy intercept and coefficients for the example
  const intercept = -1.23;
  const coefficients = [0.56, -0.34, 0.78];

  // Calculate the linear combination of inputs and coefficients
  let linearCombination = intercept;
  for (let i = 0; i < featureArray.length; i++) {
    linearCombination += coefficients[i] * featureArray[i];
  }

  // Apply the logistic function to get a probability
  const probability = 1 / (1 + Math.exp(-linearCombination));
  console.log("Probability:", probability);

  // Convert to percentage and display the result
  const likelihoodPercentage = (probability * 100).toFixed(2);
  document.getElementById('likelihoodOutput').textContent = likelihoodPercentage + '%';
};
