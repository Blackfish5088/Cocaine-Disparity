// Ensure scripts run after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load the CSV data using PapaParse
  Papa.parse('DF.csv', { // Update the path if DF.csv is in a different folder
    download: true,
    header: true,
    dynamicTyping: true, // Converts numeric strings to numbers
    complete: function(results) {
      if (results && results.data) {
        window.globalData = results.data;
        console.log("Data successfully loaded");
        // No need to call createVisualizations since we're not using graphs
      } else {
        console.error("Data loading failed. Please check the CSV file path and content.");
      }
    },
    error: function(err) {
      console.error("PapaParse error:", err);
    }
  });
});

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

  const data = window.globalData;

  if (!data) {
    likelihoodOutput.textContent = 'Data not loaded yet. Please try again in a moment.';
    return;
  }

  // Filter data based on selected drug type and race
  const filteredData = data.filter(row => {
    return row['Drug_Type'] === drugType && row['Race'] === race;
  });

  const totalCases = filteredData.length;

  if (totalCases === 0) {
    likelihoodOutput.textContent = 'No data available for the selected criteria.';
    return;
  }

  // Calculate the number of sentences over 36 months
  const longSentences = filteredData.filter(row => {
    return parseFloat(row['Average_Sentence_Length_Months']) > 36;
  }).length;

  // Calculate the likelihood percentage
  const likelihood = ((longSentences / totalCases) * 100).toFixed(2);

  likelihoodOutput.textContent = `${likelihood}%`;

  console.log("Likelihood Output:", likelihoodOutput.textContent);
}
