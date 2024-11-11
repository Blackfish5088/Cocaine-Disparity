document.addEventListener('DOMContentLoaded', function() {
  // Load the CSV data for the bar chart
  Papa.parse('data/DF.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;

      const races = [];
      const crackSentences = [];
      const powderSentences = [];

      // Process data for bar chart
      data.forEach(row => {
        if (!races.includes(row.Race)) {
          races.push(row.Race);
        }
        if (row.Drug_Type === 'Crack') {
          const sentence = parseFloat(row.Average_Sentence_Length_Months);
          if (!isNaN(sentence)) crackSentences.push(sentence);
        } else if (row.Drug_Type === 'Powder Cocaine') {
          const sentence = parseFloat(row.Average_Sentence_Length_Months);
          if (!isNaN(sentence)) powderSentences.push(sentence);
        }
      });

      const ctx1 = document.getElementById('incarcerationChart');
      if (ctx1 && crackSentences.length && powderSentences.length) {
        new Chart(ctx1.getContext('2d'), {
          type: 'bar',
          data: {
            labels: races,
            datasets: [
              {
                label: 'Crack Cocaine',
                data: crackSentences,
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
              },
              {
                label: 'Powder Cocaine',
                data: powderSentences,
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Average Sentence Length (Months)' } }
            }
          }
        });
      } else {
        console.error("Canvas element with id 'incarcerationChart' not found or data is missing.");
      }
    }
  });

  // Load the CSV data for the pie chart
  Papa.parse('data/DF.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;

      const raceLabels = [];
      const arrestRates = [];

      // Process data for pie chart (Crack offenses only)
      data.forEach(row => {
        if (row.Drug_Type === 'Crack' && !raceLabels.includes(row.Race)) {
          raceLabels.push(row.Race);
          const arrestRate = parseFloat(row.Arrest_Rate_per_100000);
          if (!isNaN(arrestRate)) arrestRates.push(arrestRate);
        }
      });

      const ctx2 = document.getElementById('crackCocaineChart');
      if (ctx2 && arrestRates.length) {
        new Chart(ctx2.getContext('2d'), {
          type: 'pie',
          data: {
            labels: raceLabels,
            datasets: [
              {
                data: arrestRates,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              tooltip: {
                enabled: true,
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value} per 100,000`;
                  }
                }
              },
              legend: {
                display: true,
                position: 'right'
              }
            }
          }
        });
      } else {
        console.error("Canvas element with id 'crackCocaineChart' not found or data is missing.");
      }
    }
  });
});

// Likelihood Prediction Model Code
const intercept = -1.23;  // Replace with your model's intercept
const coefficients = [0.56, -0.34, 0.78];  // Replace with your model's coefficients

function predictLikelihood() {
  const drugType = document.getElementById('drugType').value;
  const race = document.getElementById('race').value;

  // Encode inputs based on the model's structure
  const featureArray = [
    drugType === 'Powder Cocaine' ? 1 : 0,
    race === 'Black' ? 1 : 0,
    race === 'Hispanic' ? 1 : 0
  ];

  // Calculate the linear combination of inputs and coefficients
  let linearCombination = intercept;
  for (let i = 0; i < featureArray.length; i++) {
    linearCombination += coefficients[i] * featureArray[i];
  }

  // Apply the logistic function to get a probability
  const probability = 1 / (1 + Math.exp(-linearCombination));

  // Convert to percentage and display the result
  const likelihoodPercentage = (probability * 100).toFixed(2);
  document.getElementById('likelihoodOutput').textContent = likelihoodPercentage;
}
