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

// Function to create the average sentence length chart
function createAverageSentenceChart(data) {
  const races = ['Black', 'White', 'Hispanic'];
  const drugTypes = ['Crack', 'Powder Cocaine'];
  const years = [...new Set(data.map(row => row.Year))].sort();

  const traces = [];

  races.forEach(race => {
    drugTypes.forEach(drug => {
      const filteredData = data.filter(row => row.Race === race && row.Drug_Type === drug);
      const avgSentenceByYear = years.map(year => {
        const yearData = filteredData.filter(row => row.Year === year);
        if (yearData.length > 0) {
          const avgSentence = yearData.reduce((sum, row) => sum + row.Average_Sentence_Length_Months, 0) / yearData.length;
          return avgSentence;
        } else {
          return null;
        }
      });

      traces.push({
        x: years,
        y: avgSentenceByYear,
        mode: 'lines+markers',
        name: `${race} - ${drug}`,
        connectgaps: true
      });
    });
  });

  const layout = {
    title: 'Average Sentence Length Over Years',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Average Sentence Length (Months)' }
  };

  Plotly.newPlot('average-sentence-chart', traces, layout);
}

// Function to create the arrest rate chart
function createArrestRateChart(data) {
  const races = ['Black', 'White', 'Hispanic'];
  const drugTypes = ['Crack', 'Powder Cocaine'];
  const years = [...new Set(data.map(row => row.Year))].sort();

  const traces = [];

  races.forEach(race => {
    drugTypes.forEach(drug => {
      const filteredData = data.filter(row => row.Race === race && row.Drug_Type === drug);
      const arrestRateByYear = years.map(year => {
        const yearData = filteredData.filter(row => row.Year === year);
        if (yearData.length > 0) {
          const avgArrestRate = yearData.reduce((sum, row) => sum + row.Arrest_Rate_per_100000, 0) / yearData.length;
          return avgArrestRate;
        } else {
          return null;
        }
      });

      traces.push({
        x: years,
        y: arrestRateByYear,
        mode: 'lines+markers',
        name: `${race} - ${drug}`,
        connectgaps: true
      });
    });
  });

  const layout = {
    title: 'Arrest Rate Over Years',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Arrest Rate per 100,000' }
  };

  Plotly.newPlot('arrest-rate-chart', traces, layout);
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
    return row['Drug_Type'] === drugType && row['Race'] === race;
  });

  const totalCases = filteredData.length;

  if (totalCases === 0) {
    likelihoodOutput.textContent = 'No data available for the selected criteria.';
    return;
  }

  // Calculate the overall average sentence length for all data
  const overallAvgSentence = data.reduce((sum, row) => sum + row.Average_Sentence_Length_Months, 0) / data.length;

  // Calculate the number of cases where the sentence length is above the overall average
  const aboveAvgCases = filteredData.filter(row => {
    return row.Average_Sentence_Length_Months > overallAvgSentence;
  }).length;

  // Calculate the likelihood percentage
  const likelihood = ((aboveAvgCases / totalCases) * 100).toFixed(2);

  likelihoodOutput.textContent = `${likelihood}%`;

  console.log("Likelihood Output:", likelihoodOutput.textContent);
}
