const chartRegistry = new Map();

function destroyChart(canvasId) {
  if (chartRegistry.has(canvasId)) {
    chartRegistry.get(canvasId).destroy();
  }
}

function buildChart(canvasId, config) {
  const element = document.getElementById(canvasId);
  if (!element || typeof Chart === "undefined") {
    return null;
  }

  destroyChart(canvasId);
  const chart = new Chart(element, config);
  chartRegistry.set(canvasId, chart);
  return chart;
}

export function renderLineChart(canvasId, labels, values, label) {
  return buildChart(canvasId, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          borderColor: "#1f7a72",
          backgroundColor: "rgba(31, 122, 114, 0.16)",
          pointBackgroundColor: "#f46036",
          pointRadius: 4,
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (value) => `${value}%` }
        }
      }
    }
  });
}

export function renderBarChart(canvasId, labels, values, label) {
  return buildChart(canvasId, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: ["#1f7a72", "#f0a202", "#f46036", "#3b6064", "#d95d39"]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (value) => `${value}%` }
        }
      }
    }
  });
}

export function renderDoughnutChart(canvasId, labels, values) {
  return buildChart(canvasId, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#1f7a72", "#f0a202", "#f46036", "#3b6064"]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
