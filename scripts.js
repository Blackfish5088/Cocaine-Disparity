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
          crackSentences.push(parseFloat(row.Average_Sentence_Length_Months));
        } else if (row.Drug_Type === 'Powder Cocaine') {
          powderSentences.push(parseFloat(row.Average_Sentence_Length_Months));
        }
      });

      const ctx1 = document.getElementById('incarcerationChart');
      if (ctx1) {
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
        console.error("Canvas element with id 'incarcerationChart' not found.");
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
          arrestRates.push(parseFloat(row.Arrest_Rate_per_100000));
        }
      });

      const ctx2 = document.getElementById('crackCocaineChart');
      if (ctx2) {
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
        console.error("Canvas element with id 'crackCocaineChart' not found.");
      }
    }
  });
});
