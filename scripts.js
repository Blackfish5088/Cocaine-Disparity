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


// scripts.js

// Load the CSV data using PapaParse and create the chart
Papa.parse('data/DF.csv', {
  download: true,
  header: true,
  complete: function(results) {
    // Process the CSV data
    const data = results.data;

    // Initialize variables to store race names and crack cocaine counts
    const raceLabels = [];
    const crackCounts = [];

    // Loop through the data and extract values
    data.forEach(row => {
      // Assuming columns are named 'Race', 'Offense_Type', and 'Incarcerated'
      if (row.Offense_Type === 'Crack Cocaine') {
        raceLabels.push(row.Race);
        crackCounts.push(parseInt(row.Incarcerated, 10)); // Convert to integer
      }
    });

    // Create the pie chart with the extracted data
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

    // Configurations for the pie chart
    const config = {
      type: 'pie',
      data: crackData,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true, // Enable tooltips for interactivity
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

    // Render the pie chart
    const ctx = document.getElementById('crackCocaineChart').getContext('2d');
    new Chart(ctx, config);
  }
});
