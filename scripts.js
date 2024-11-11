document.addEventListener('DOMContentLoaded', function() {
  // Load the CSV data for the bar chart
  Papa.parse('data/DF.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;

      const races = [];
      const crackCounts = [];
      const powderCounts = [];

      data.forEach(row => {
        races.push(row.Race);
        crackCounts.push(parseInt(row.Crack_Cocaine_Incarcerated, 10));
        powderCounts.push(parseInt(row.Powder_Cocaine_Incarcerated, 10));
      });

      // Check if the bar chart canvas exists
      const ctx1 = document.getElementById('incarcerationChart');
      if (ctx1) {
        new Chart(ctx1.getContext('2d'), {
          type: 'bar',
          data: {
            labels: races,
            datasets: [
              {
                label: 'Crack Cocaine',
                data: crackCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
              },
              {
                label: 'Powder Cocaine',
                data: powderCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true }
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
      const crackCounts = [];

      data.forEach(row => {
        if (row.Offense_Type === 'Crack Cocaine') {
          raceLabels.push(row.Race);
          crackCounts.push(parseInt(row.Incarcerated, 10));
        }
      });

      const crackData = {
        labels: raceLabels,
        datasets: [
          {
            data: crackCounts,
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
      };

      const config = {
        type: 'pie',
        data: crackData,
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value} incarcerations`;
                }
              }
            },
            legend: {
              display: true,
              position: 'right'
            }
          }
        }
      };

      // Check if the pie chart canvas exists
      const ctx2 = document.getElementById('crackCocaineChart');
      if (ctx2) {
        new Chart(ctx2.getContext('2d'), config);
      } else {
        console.error("Canvas element with id 'crackCocaineChart' not found.");
      }
    }
  });
});
