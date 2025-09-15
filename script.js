let matches = [];
let playerName = "";
let chart;

// Handle form submit
document.getElementById("matchForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Get inputs
  playerName = document.getElementById("nameInput").value;
  const runs = parseInt(document.getElementById("runsInput").value);
  const balls = parseInt(document.getElementById("ballsInput").value);
  const dismissal = document.getElementById("dismissalInput").value;

  const sr = ((runs / balls) * 100).toFixed(1);

  // Add to matches
  matches.push({ match: `Match ${matches.length + 1}`, runs, balls, sr, dismissal });

  // Update UI
  updateDashboard();
  updateTable();
  updateInsights();
  updateChart();

  // Reset form
  document.getElementById("matchForm").reset();
});

// Update Dashboard
function updateDashboard() {
  document.getElementById("playerName").innerText = playerName;
  document.getElementById("matches").innerText = matches.length;

  const totalRuns = matches.reduce((sum, m) => sum + m.runs, 0);
  const totalBalls = matches.reduce((sum, m) => sum + m.balls, 0);
  const avg = (totalRuns / matches.length).toFixed(1);
  const sr = ((totalRuns / totalBalls) * 100).toFixed(1);

  document.getElementById("runs").innerText = totalRuns;
  document.getElementById("average").innerText = isNaN(avg) ? 0 : avg;
  document.getElementById("strikeRate").innerText = isNaN(sr) ? 0 : sr;
}

// Update Match Table
function updateTable() {
  const tableBody = document.getElementById("matchHistory");
  tableBody.innerHTML = "";
  matches.forEach(m => {
    const row = `<tr>
      <td>${m.match}</td>
      <td>${m.runs}</td>
      <td>${m.balls}</td>
      <td>${m.sr}</td>
      <td>${m.dismissal}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

// Update Strengths & Weaknesses
function updateInsights() {
  const strengths = [];
  const weaknesses = [];

  const avgSR = matches.length ? matches.reduce((s, m) => s + parseFloat(m.sr), 0) / matches.length : 0;
  const dismissals = matches.map(m => m.dismissal);

  if (avgSR > 130) strengths.push("Strong aggressive batting (High SR)");
  if (avgSR >= 100 && avgSR <= 130) strengths.push("Good strike rotation");
  if (dismissals.includes("Not Out")) strengths.push("Good at finishing innings");

  if (dismissals.filter(d => d === "Bouncer").length > 1) weaknesses.push("Weak against short balls");
  if (avgSR < 100) weaknesses.push("Needs to improve scoring rate");
  if (matches.length && matches[matches.length-1].runs < 20) weaknesses.push("Struggles in recent matches");

  document.getElementById("strengthList").innerHTML = strengths.map(s => `<li>${s}</li>`).join("");
  document.getElementById("weaknessList").innerHTML = weaknesses.map(w => `<li>${w}</li>`).join("");
}

// Update Weekly Progress Chart
function updateChart() {
  const ctx = document.getElementById("progressChart").getContext("2d");
  const labels = matches.map(m => m.match);
  const runs = matches.map(m => m.runs);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Runs Scored",
        data: runs,
        borderColor: "#00796b",
        borderWidth: 2,
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}
