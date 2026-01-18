let data = [
    { team: "TeamX", agent: "Jett", map: "Ascent", result: "Win" },
    { team: "TeamX", agent: "Jett", map: "Ascent", result: "Win" },
    { team: "TeamX", agent: "Omen", map: "Bind", result: "Loss" },
    { team: "TeamX", agent: "Raze", map: "Haven", result: "Win" },
    { team: "Cloud9", agent: "Sova", map: "Haven", result: "Win" },
    { team: "Cloud9", agent: "Jett", map: "Bind", result: "Loss" }
];

let agentChart, mapChart;

function handleTeamChange() {
    const select = document.getElementById("teamSelect").value;
    const customInput = document.getElementById("customTeam");

    if (select === "Other") {
        customInput.classList.remove("hidden");
    } else {
        customInput.classList.add("hidden");
    }
}

function generateReport() {
    let team = document.getElementById("teamSelect").value;

    if (team === "Other") {
        team = document.getElementById("customTeam").value.trim();
        if (!team) {
            alert("Please enter a team name");
            return;
        }

        // Add dummy data for new team (simulation)
        data.push(
            { team, agent: "Jett", map: "Ascent", result: "Win" },
            { team, agent: "Omen", map: "Bind", result: "Loss" }
        );
    }

    const matches = data.filter(d => d.team === team);
    if (matches.length === 0) {
        alert("No data available");
        return;
    }

    const reportDiv = document.getElementById("report");
    reportDiv.classList.remove("hidden");

    let agentCount = {}, mapCount = {}, wins = 0;

    matches.forEach(m => {
        agentCount[m.agent] = (agentCount[m.agent] || 0) + 1;
        mapCount[m.map] = (mapCount[m.map] || 0) + 1;
        if (m.result === "Win") wins++;
    });

    const winRate = ((wins / matches.length) * 100).toFixed(1);
    document.getElementById("winRate").innerText = `Win Rate: ${winRate}%`;

    drawChart("agentChart", agentCount, "Agents Used", "agent");
    drawChart("mapChart", mapCount, "Maps Played", "map");

    generateAISummary(team, winRate, agentCount);
}

function drawChart(canvasId, dataObj, label, type) {
    if (type === "agent" && agentChart) agentChart.destroy();
    if (type === "map" && mapChart) mapChart.destroy();

    const ctx = document.getElementById(canvasId);
    const chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(dataObj),
            datasets: [{
                label,
                data: Object.values(dataObj),
                backgroundColor: "#38bdf8"
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    if (type === "agent") agentChart = chart;
    else mapChart = chart;
}

function generateAISummary(team, winRate, agentCount) {
    const topAgent = Object.keys(agentCount)
        .reduce((a, b) => agentCount[a] > agentCount[b] ? a : b);

    let summary = `${team} frequently prioritizes ${topAgent}. `;

    if (winRate >= 60)
        summary += "They appear strategically strong and consistent.";
    else if (winRate >= 40)
        summary += "They show mixed performance with exploitable gaps.";
    else
        summary += "They struggle under pressure and early aggression.";

    document.getElementById("aiSummary").innerText = summary;
}
