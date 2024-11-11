// Define the predictLikelihood function globally
window.predictLikelihood = function() {
  console.log("predictLikelihood function triggered");

  // Get selected values for Drug Type and Race
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

  // Dummy intercept and coefficients for example
  const intercept = -1.23;
  const coefficients = [0.56, -0.34, 0.78];

  // Encode inputs based on model structure
  const featureArray = [
    drugType === 'Powder Cocaine' ? 1 : 0,
    race === 'Black' ? 1 : 0,
    race === 'Hispanic' ? 1 : 0
  ];

  let linearCombination = intercept;
  for (let i = 0; i < featureArray.length; i++) {
    linearCombination += coefficients[i] * featureArray[i];
  }

  const probability = 1 / (1 + Math.exp(-linearCombination));
  const likelihoodPercentage = (probability * 100).toFixed(2);
  likelihoodOutput.textContent = `${likelihoodPercentage}%`;

  console.log("Likelihood Output:", likelihoodOutput.textContent);
};
