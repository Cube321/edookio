// script.js
document.addEventListener("DOMContentLoaded", (event) => {
  const ctx1 = document
    .getElementById("registrationsPerDayChart")
    .getContext("2d");
  const ctx2 = document
    .getElementById("premiumActivationsPerDayChart")
    .getContext("2d");
  const ctx3 = document
    .getElementById("premiumDeactivationsPerDayChart")
    .getContext("2d");
  const ctx4 = document
    .getElementById("premiumProlongationsPerDayChart")
    .getContext("2d");
  const ctx6 = document
    .getElementById("registrationsPerDayBySourceChart")
    .getContext("2d");
  const dataJSON = document.getElementById("dataRow").getAttribute("fullData");

  const colors = [
    "rgba(232,15,136,1)",
    "rgba(0,123,255,1)",
    "rgba(40,167,69,1)",
    "rgba(255,193,7,1)",
    "rgba(23,162,184,1)",
    "rgba(108,117,125,1)",
    "rgba(220,53,69,1)",
  ];

  const backgroundColors = colors.map((color) => color.replace("1)", "0.2)"));

  const data = JSON.parse(dataJSON);

  //CTX1 - Registrations per day
  // Extract dates and values, and sort them by date
  const extractedData1 = data.registrationsPerDay
    .map((item) => {
      const date = Object.keys(item)[0];
      const value = item[date];
      return { date, value };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Create labels and data points from the sorted data
  const labels1 = extractedData1.map((item) => item.date);
  const dataPoints1 = extractedData1.map((item) => item.value);

  // Calculate the maximum value from the data points
  const maxValue1 = Math.max(...dataPoints1);

  // Add some padding to the maximum value for better visualization
  const maxYValue1 = maxValue1 + 0.1 * maxValue1;

  const chart1 = new Chart(ctx1, {
    type: "line", // You can change this to 'bar', 'pie', etc.
    data: {
      labels: labels1,
      datasets: [
        {
          label: "Počet registrací za den",
          data: dataPoints1,
          borderColor: "rgba(232,15,136,1)",
          backgroundColor: "rgba(232,15,136,0.2)",
          borderWidth: 1,
          tension: 0.5,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: maxYValue1,
        },
      },
    },
  });

  //CTX2 - Premium activations per day
  // Extract dates and values, and sort them by date
  const extractedData2 = data.premiumActivationsPerDay
    .map((item) => {
      const date = Object.keys(item)[0];
      const value = item[date];
      return { date, value };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Create labels and data points from the sorted data
  const labels2 = extractedData2.map((item) => item.date);
  const dataPoints2 = extractedData2.map((item) => item.value);

  // Calculate the maximum value from the data points
  const maxValue2 = Math.max(...dataPoints2);

  // Add some padding to the maximum value for better visualization
  const maxYValue2 = maxValue2 + 0.1 * maxValue2;

  const chart2 = new Chart(ctx2, {
    type: "line", // You can change this to 'bar', 'pie', etc.
    data: {
      labels: labels2,
      datasets: [
        {
          label: "Počet aktivací Premium za den",
          data: dataPoints2,
          borderColor: "rgba(232,15,136,1)",
          backgroundColor: "rgba(232,15,136,0.2)",
          borderWidth: 1,
          tension: 0.5,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: maxYValue2,
        },
      },
    },
  });

  //CTX3 - Premium deactivations per day
  // Extract dates and values, and sort them by date
  const extractedData3 = data.premiumDeactivationsPerDay
    .map((item) => {
      const date = Object.keys(item)[0];
      const value = item[date];
      return { date, value };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Create labels and data points from the sorted data
  const labels3 = extractedData3.map((item) => item.date);
  const dataPoints3 = extractedData3.map((item) => item.value);

  // Calculate the maximum value from the data points
  const maxValue3 = Math.max(...dataPoints3);

  // Add some padding to the maximum value for better visualization
  const maxYValue3 = maxValue3 + 0.1 * maxValue3;

  const chart3 = new Chart(ctx3, {
    type: "line", // You can change this to 'bar', 'pie', etc.
    data: {
      labels: labels3,
      datasets: [
        {
          label: "Počet deaktivací Premium za den",
          data: dataPoints3,
          borderColor: "rgba(232,15,136,1)",
          backgroundColor: "rgba(232,15,136,0.2)",
          borderWidth: 1,
          tension: 0.5,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: maxYValue3,
        },
      },
    },
  });

  //CTX4 - Premium prolongations per day
  // Extract dates and values, and sort them by date
  const extractedData4 = data.premiumProlongationsPerDay
    .map((item) => {
      const date = Object.keys(item)[0];
      const value = item[date];
      return { date, value };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Create labels and data points from the sorted data
  const labels4 = extractedData4.map((item) => item.date);
  const dataPoints4 = extractedData4.map((item) => item.value);

  // Calculate the maximum value from the data points
  const maxValue4 = Math.max(...dataPoints4);

  // Add some padding to the maximum value for better visualization
  const maxYValue4 = maxValue4 + 0.1 * maxValue4;

  const chart4 = new Chart(ctx4, {
    type: "line", // You can change this to 'bar', 'pie', etc.
    data: {
      labels: labels4,
      datasets: [
        {
          label:
            "Počet prodloužení Premium za den (datum posledního prodloužení)",
          data: dataPoints4,
          borderColor: "rgba(232,15,136,1)",
          backgroundColor: "rgba(232,15,136,0.2)",
          borderWidth: 1,
          tension: 0.5,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: maxYValue4,
        },
      },
    },
  });

  // CTX6 - Registrations per day by source
  // Extract dates and values, and sort them by date
  const extractedData6 = data.registrationsPerDayBySource
    .map((item) => {
      const date = Object.keys(item)[0];
      const sources = item[date];
      return { date, sources };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Create labels from the sorted data
  const labels6 = extractedData6.map((item) => item.date);

  // Extract source names and initialize datasets
  const sourceNames = [
    ...new Set(
      data.registrationsPerDayBySource.flatMap((item) =>
        Object.values(item)[0] ? Object.keys(Object.values(item)[0]) : []
      )
    ),
  ];
  const datasets6 = sourceNames.map((source, i) => ({
    label: source,
    data: extractedData6.map((item) => item.sources[source] || 0), // Default to 0 if no data for that date
    borderColor: colors[i],
    backgroundColor: backgroundColors[i],
    borderWidth: 1,
    tension: 0.5,
  }));

  // Calculate the maximum value across all datasets
  const allDataPoints6 = datasets6.flatMap((dataset) => dataset.data);
  const maxValue6 = Math.max(...allDataPoints6);

  // Optional: Add some padding to the maximum value for better visualization
  const maxYValue6 = maxValue6 + 0.1 * maxValue6;

  const chart6 = new Chart(ctx6, {
    type: "line", // You can change this to 'bar', 'pie', etc.
    data: {
      labels: labels6,
      datasets: datasets6,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: maxYValue6,
        },
      },
    },
  });
});
