// Ensure scripts run after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load the CSV data using PapaParse
  Papa.parse('DF.csv', {
    download: true,
    header: true,
    dynamicTyping: true, // Converts numeric strings to numbers
    complete: function(results) {
      window.globalData = results.data;
      // Create visualizations after data is loaded
      createVisualizations(window.globalData);
    }
  });
});

// Function to create visualizations using Plotly.js
function createVisualizations(data) {
  // Aggregate data by race
  const raceCounts = {};

  data.forEach(row => {
    const race = row['Race'];
    if (race) {
      raceCounts[race] = (raceCounts[race] || 0) + 1;
    }
  });

  const races = Object.keys(raceCounts);
  const counts = Object.values(raceCounts);

  const trace = {
    x: races,
    y: counts,
    type: 'bar',
    marker: { color: 'rgb(142,124,195)' }
  };

  const layout = {
    title: 'Number of Sentences by Race',
    xaxis: { title: 'Race' },
    yaxis: { title: 'Number of Sentences' }
  };

  Plotly.newPlot('race-sentences-chart', [trace], layout);
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

  const data = window.globalData;

  if (!data) {
    likelihoodOutput.textContent = 'Data not loaded yet. Please try again in a moment.';
    return;
  }

  // Filter data based on selected drug type and race
  const filteredData = data.filter(row => {
    return row['DrugType'] === drugType && row['Race'] === race;
  });

  const totalCases = filteredData.length;

  if (totalCases === 0) {
    likelihoodOutput.textContent = 'No data available for the selected criteria.';
    return;
  }

  // Calculate the number of sentences over 36 months
  const longSentences = filteredData.filter(row => {
    return parseFloat(row['SentenceLength']) > 36;
  }).length;

  // Calculate the likelihood percentage
  const likelihood = ((longSentences / totalCases) * 100).toFixed(2);

  likelihoodOutput.textContent = `${likelihood}%`;

  console.log("Likelihood Output:", likelihoodOutput.textContent);
}
