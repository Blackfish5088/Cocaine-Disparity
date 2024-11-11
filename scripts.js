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
        populateYearOptions(window.globalData);
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

// Function to populate the Year select options based on data
function populateYearOptions(data) {
  const yearElement = document.getElementById('year');
  if (!yearElement) {
    console.error("Year select element not found");
    return;
  }

  // Get unique years from the data
  const years = [...new Set(data.map(row => row['Year']))].sort();

  // Create option elements for each year
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearElement.appendChild(option);
  });
}

// Function to predict likelihood based on user input
function predictLikelihood() {
  console.log("predictLikelihood function triggered");

  const drugTypeElement = document.getElementById('drugType');
  const raceElement = document.getElementById('race');
  const yearElement = document.getElementById('year');
  const likelihoodOutput = document.getElementById('likelihoodOutput');

  if (!drugTypeElement || !raceElement || !yearElement || !likelihoodOutput) {
    console.error("One or more elements not found");
    return;
  }

  const drugType = drugTypeElement.value;
  const race = raceElement.value;
  const year = parseInt(yearElement.value);

  console.log("Selected Drug Type:", drugType);
  console.log("Selected Race:", race);
  console.log("Selected Year:", year);

  const data = window.globalData;

  if (!data) {
    likelihoodOutput.textContent = 'Data not loaded yet. Please try again in a moment.';
    return;
  }

  // Filter data based on selected drug type, race, and year
  const filteredData = data.filter(row => {
    return row['Drug_Type'] === drugType && row['Race'] === race && row['Year'] === year;
  });

  const totalCases = filteredData.length;

  if (totalCases === 0) {
    likelihoodOutput.textContent = 'No data available for the selected criteria.';
    return;
  }

  // Calculate the number of sentences less than 36 months
  const shortSentences = filteredData.filter(row => {
    return parseFloat(row['Average_Sentence_Length_Months']) < 36;
  }).length;

  // Calculate the likelihood percentage
  const likelihood = ((shortSentences / totalCases) * 100).toFixed(2);

  likelihoodOutput.textContent = `${likelihood}%`;

  console.log("Likelihood Output:", likelihoodOutput.textContent);
}
