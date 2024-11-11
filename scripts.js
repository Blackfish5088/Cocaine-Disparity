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
      // Precompute likelihoods
      precomputeLikelihoods(window.globalData);
      // Populate year selector
      populateYearSelector(window.globalData);
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

// Global variable to hold the precomputed likelihoods
let likelihoods = {};

// Function to precompute likelihoods
function precomputeLikelihoods(data) {
  // Filter out any invalid data
  const cleanedData = data.filter(row =>
    row.Year && row.Drug_Type && row.Race && typeof row.Average_Sentence_Length_Months === 'number'
  );

  // Group data by year
  const dataByYear = {};
  cleanedData.forEach(row => {
    if (!dataByYear[row.Year]) {
      dataByYear[row.Year] = [];
    }
    dataByYear[row.Year].push(row);
  });

  // Calculate likelihoods for each year
  Object.keys(dataByYear).forEach(year => {
    const yearData = dataByYear[year];

    // Calculate the average sentence length for the year
    const avgSentenceLength = yearData.reduce((sum, row) => sum + row.Average_Sentence_Length_Months, 0) / yearData.length;

    // Determine if each case is above the average
    yearData.forEach(row => {
      const key = `${year}_${row.Drug_Type}_${row.Race}`;
      if (!likelihoods[key]) {
        likelihoods[key] = { aboveAvgCount: 0, totalCount: 0 };
      }
      if (row.Average_Sentence_Length_Months > avgSentenceLength) {
        likelihoods[key].aboveAvgCount += 1;
      }
      likelihoods[key].totalCount += 1;
    });
  });

  // Calculate likelihood percentages
  Object.keys(likelihoods).forEach(key => {
    const { aboveAvgCount, totalCount } = likelihoods[key];
    likelihoods[key].likelihood = ((aboveAvgCount / totalCount) * 100).toFixed(2);
  });

  console.log("Precomputed likelihoods:", likelihoods);
}

// Function to populate the year selector
function populateYearSelector(data) {
  const yearSelector = document.getElementById('year');
  if (!yearSelector) {
    console.error('Year selector not found');
    return;
  }

  // Get unique years and sort them
  const years = [...new Set(data.map(row => row.Year))].sort();
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelector.appendChild(option);
  });
}

// Function to predict likelihood based on user input
function predictLikelihood() {
  console.log("predictLikelihood function triggered");

  const yearElement = document.getElementById('year');
  const drugTypeElement = document.getElementById('drugType');
  const raceElement = document.getElementById('race');
  const likelihoodOutput = document.getElementById('likelihoodOutput');

  if (!yearElement || !drugTypeElement || !raceElement || !likelihoodOutput) {
    console.error("One or more elements not found");
    return;
  }

  const year = yearElement.value;
  const drugType = drugTypeElement.value;
  const race = raceElement.value;

  console.log("Selected Year:", year);
  console.log("Selected Drug Type:", drugType);
  console.log("Selected Race:", race);

  const key = `${year}_${drugType}_${race}`;
  const likelihoodData = likelihoods[key];

  if (likelihoodData && likelihoodData.totalCount > 0) {
    const likelihood = likelihoodData.likelihood;
    likelihoodOutput.textContent = `${likelihood}% chance of receiving an above-average sentence length.`;
    console.log("Likelihood Output:", likelihoodOutput.textContent);
  } else {
    likelihoodOutput.textContent = 'No data available for the selected criteria.';
  }
}
