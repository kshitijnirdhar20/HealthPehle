document.addEventListener('DOMContentLoaded', function() {
    // Load saved BMI data from localStorage or use default
    const savedBmi = localStorage.getItem('lastBmi');
    const savedWeight = localStorage.getItem('lastWeight');
    const savedCategory = localStorage.getItem('lastBmiCategory');
    
    if (savedBmi) {
        document.getElementById('dashboardBmi').textContent = savedBmi;
        document.getElementById('dashboardBmiCategory').textContent = savedCategory;
        
        // Update health history with saved data
        const historyTable = document.getElementById('healthHistory');
        if (historyTable) {
            const newRow = document.createElement('tr');
            newRow.className = 'border-b border-gray-700';
            newRow.innerHTML = `
                <td class="py-3">Today</td>
                <td>${savedBmi}</td>
                <td>${savedWeight}</td>
                <td><span class="px-2 py-1 bg-green-900/50 text-green-400 rounded">${savedCategory}</span></td>
            `;
            historyTable.insertBefore(newRow, historyTable.firstChild);
        }
    }
    
    // Initialize charts
    initBmiChart();
    initActivityChart();
    
    // Simulate health data updates
    simulateHealthData();
});

function initBmiChart() {
    const ctx = document.getElementById('bmiTrendCanvas').getContext('2d');
    const bmiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'BMI',
                data: [24.1, 23.8, 23.5, 23.3, 23.4, 23.2, 23.5],
                borderColor: '#15B8A6',
                backgroundColor: 'rgba(21, 184, 166, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 22,
                    max: 25,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9CA3AF'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9CA3AF'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#F3F4F6'
                    }
                }
            }
        }
    });
}

function initActivityChart() {
    const ctx = document.getElementById('activityCanvas').getContext('2d');
    const activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Steps',
                data: [8500, 10200, 7800, 9500, 11000, 6500, 7200],
                backgroundColor: 'rgba(21, 184, 166, 0.7)',
                borderColor: '#15B8A6',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9CA3AF'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9CA3AF'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#F3F4F6'
                    }
                }
            }
        }
    });
}

function simulateHealthData() {
    // Simulate heart rate between 60-90
    const heartRate = Math.floor(Math.random() * 30) + 60;
    document.getElementById('heartRate').textContent = heartRate;
    
    // Update heart rate status
    const heartRateStatus = document.querySelector('#heartRate + div');
    if (heartRate < 60) {
        heartRateStatus.textContent = 'Low';
        heartRateStatus.className = 'text-blue-400';
    } else if (heartRate > 100) {
        heartRateStatus.textContent = 'High';
        heartRateStatus.className = 'text-red-400';
    } else {
        heartRateStatus.textContent = 'Normal';
        heartRateStatus.className = 'text-green-500';
    }
    
    // Simulate blood pressure
    const systolic = Math.floor(Math.random() * 20) + 110;
    const diastolic = Math.floor(Math.random() * 10) + 70;
    document.getElementById('bloodPressure').textContent = `${systolic}/${diastolic}`;
    
    // Update blood pressure status
    const bpStatus = document.querySelector('#bloodPressure + div');
    if (systolic >= 140 || diastolic >= 90) {
        bpStatus.textContent = 'High';
        bpStatus.className = 'text-red-400';
    } else if (systolic >= 120 || diastolic >= 80) {
        bpStatus.textContent = 'Elevated';
        bpStatus.className = 'text-yellow-400';
    } else {
        bpStatus.textContent = 'Normal';
        bpStatus.className = 'text-green-500';
    }
    
    // Simulate sleep hours between 6-9
    const sleepHours = (Math.random() * 3 + 6).toFixed(1);
    document.getElementById('sleepHours').textContent = sleepHours;
    
    // Update sleep status
    const sleepStatus = document.querySelector('#sleepHours + div');
    if (sleepHours < 7) {
        sleepStatus.textContent = 'Insufficient';
        sleepStatus.className = 'text-red-400';
    } else if (sleepHours > 9) {
        sleepStatus.textContent = 'Excessive';
        sleepStatus.className = 'text-yellow-400';
    } else {
        sleepStatus.textContent = 'Good';
        sleepStatus.className = 'text-green-500';
    }
    
    // Update every 5 seconds for demo purposes
    setTimeout(simulateHealthData, 5000);
}