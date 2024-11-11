document.addEventListener('DOMContentLoaded', function() {
  // Load data from DF.csv for the pie chart
  Papa.parse('data/DF.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;

      const raceLabels = [];
      const arrestRates = [];

      // Filter data to include only Crack offenses, then group by Race
      data.forEach(row => {
        if (row.Drug_Type === 'Crack') {
          const race = row.Race;
          const arrestRate = parseFloat(row.Arrest_Rate_per_100000);

          if (!isNaN(arrestRate)) {
            // Add race if not already present
            if (!raceLabels.includes(race)) {
              raceLabels.push(race);
              arrestRates.push(arrestRate);
            }
          }
        }
      });

      // Use Plotly to create the pie chart
      const plotData = [{
        type: 'pie',
        labels: raceLabels,
        values: arrestRates,
        textinfo: 'label+percent',
        hoverinfo: 'label+value',
        marker: {
          colors: ['#FF6384', '#36A2EB', '#FFCE56', '#AA65B2', '#FF9F40']
        }
      }];

      const layout = {
        title: 'Percentage of Crack Cocaine Incarcerations by Race',
        height: 400,
        width: 500
      };

      Plotly.newPlot('crackCocaineChart', plotData, layout);
    }
  });
});
