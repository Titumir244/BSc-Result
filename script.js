const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ib1jaojQVFlpH0BgM2YxlYvpOxu_cLAoGwNmWlkCiD2a9Cg-MABkIpGpPLI7yQ/pub?gid=1610874522&single=true&output=csv";

function buildTable(targetId, rows, wantedCols) {
    const tbody = document.querySelector(`#${targetId} tbody`);
    tbody.innerHTML = "";

    rows.forEach(row => {
        const tr = document.createElement("tr");

        // প্রথমে সারি হাইলাইটের জন্য চেক
        let rowHighlightColor = null;
        for (let colIndex of wantedCols) {
            const cellValue = (row[colIndex] || "").trim().toLowerCase();
            if (cellValue === "1st") rowHighlightColor = "#4caf50";
            else if (cellValue === "2nd") rowHighlightColor = "#2196f3";
            else if (cellValue === "3rd") rowHighlightColor = "#ff9800";
        }

        wantedCols.forEach(colIndex => {
            const td = document.createElement("td");
            td.textContent = row[colIndex] || "";

            const cellValue = td.textContent.trim();

            // F থাকলে শুধু সেই সেল হাইলাইট
            if (cellValue.toUpperCase() === "F") {
                td.style.color = "#ff6666";
                td.style.fontWeight = "bold";
            } 
            // অন্যথায় সারি হাইলাইট
            else if (rowHighlightColor) {
                td.style.color = rowHighlightColor;
                td.style.fontWeight = "bold";
            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

fetch(url)
    .then(res => res.text())
    .then(csvText => {
        const rows = csvText.trim().split("\n").map(r => r.split(","));

        const cols1 = [1, 2, 3, 4, 6, 8, 10, 12, 14];
        const table1Rows = rows.slice(4, 19);

        const cols2 = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
        const table2Rows = rows.slice(24, 39);

        const cols3 = cols2;
        const table3Rows = rows.slice(44, 59);

        const cols4 = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
        const table4Rows = rows.slice(64, 79);

        const cols5 = cols2;
        const table5Rows = rows.slice(84, 99);

        buildTable("table1", table1Rows, cols1);
        buildTable("table2", table2Rows, cols2);
        buildTable("table3", table3Rows, cols3);
        buildTable("table4", table4Rows, cols4);
        buildTable("table5", table5Rows, cols5);
    })
    .catch(err => console.error("Error loading sheet:", err));
