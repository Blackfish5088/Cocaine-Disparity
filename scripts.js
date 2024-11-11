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
