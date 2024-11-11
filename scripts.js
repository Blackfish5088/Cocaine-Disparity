document.addEventListener('DOMContentLoaded', function() {
  // Load the CSV data for the pie chart
  Papa.parse('data/DF.csv', {
    download: true,
    header: true,
    complete: function(results) {
      console.log("Data parsing complete"); // Check if data parsing runs
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

      console.log("Race Labels:", raceLabels); // Log the processed labels
      console.log("Arrest Rates:", arrestRates); // Log the processed data

      const ctx = document.getElementById('crackCocaineChart');
      if (ctx && arrestRates.length) {
        new Chart(ctx.getContext('2d'), {
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

// Define predictLikelihood as a standalone function so it's globally accessible
window.predictLikelihood = function() {
  console.log("predictLikelihood function triggered");

  const drugType = document.getElementById('drugType').value;
  const race = document.getElementById('race').value;

  // Encode inputs based on the model's structure
  const featureArray = [
    drugType === 'Powder Cocaine' ? 1 : 0,
    race === 'Black' ? 1 : 0,
    race === 'Hispanic' ? 1 : 0
  ];

  // Dummy intercept and coefficients for example
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
  document.getElementById('likelihoodOutput').textContent = likelihoodPercentage;
};
