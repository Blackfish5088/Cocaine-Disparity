// Chart 1: Bar Chart Example
const ctx1 = document.getElementById('chart1').getContext('2d');
const chart1 = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['Region A', 'Region B', 'Region C', 'Region D'],
        datasets: [{
            label: 'Cocaine Usage (%)',
            data: [15, 22, 8, 12],
            backgroundColor: [
                '#1abc9c',
                '#2ecc71',
                '#3498db',
                '#9b59b6'
            ],
            borderColor: [
                '#16a085',
                '#27ae60',
                '#2980b9',
                '#8e44ad'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Chart 2: Line Chart Example
const ctx2 = document.getElementById('chart2').getContext('2d');
const chart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['2000', '2005', '2010', '2015', '2020'],
        datasets: [{
            label: 'Arrest Rates per 100,000 People',
            data: [500, 450, 400, 350, 300],
            fill: false,
            borderColor: '#e74c3c',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});
