// scripts.js
// Load the CSV data and create the chart
Papa.parse('data/DF.csv', {
  download: true,
  header: true,
  complete: function(results) {
    // Process the CSV data
    const data = results.data;

    // Example data structure for chart (you'll need to adjust based on your CSV structure)
    const races = [];
    const crackCounts = [];
    const powderCounts = [];

    data.forEach(row => {
      races.push(row.Race);
      crackCounts.push(parseInt(row.Crack_Cocaine_Incarcerated, 10));
      powderCounts.push(parseInt(row.Powder_Cocaine_Incarcerated, 10));
    });

    // Create the Chart.js bar chart
    const ctx = document.getElementById('incarcerationChart').getContext('2d');
    new Chart(ctx, {
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
  }
});
