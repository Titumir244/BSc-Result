const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ib1jaojQVFlpH0BgM2YxlYvpOxu_cLAoGwNmWlkCiD2a9Cg-MABkIpGpPLI7yQ/pub?gid=1610874522&single=true&output=csv";
// ফাংশন: টেবিলের tbody পূরণ + F হাইলাইট
function buildTable(targetId, rows, wantedCols) {
    const tbody = document.querySelector(`#${targetId} tbody`);
    tbody.innerHTML = "";

    rows.forEach(row => {
        const tr = document.createElement("tr");
        wantedCols.forEach(colIndex => {
            const td = document.createElement("td");
            td.textContent = row[colIndex] || "";

            // ✨ F থাকলে লাল হাইলাইট
            if (td.textContent.trim().toUpperCase() === "F") {
                td.style.color = "#ff6666"; // লেখা লাল
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

        // কলাম ইন্ডেক্স (A=0, B=1, ...)
        const cols1 = [1, 2, 3, 4, 6, 8, 10, 12, 14];
        const cols2 = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
        const cols3 = cols2;
        const cols4 = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20,22];
        const cols5 = cols2;

        // সারি স্লাইস (index 0 থেকে)
        const table1Rows = rows.slice(4, 19);  // 5-19
        const table2Rows = rows.slice(24, 39); // 25-39
        const table3Rows = rows.slice(44, 59); // 45-59
        const table4Rows = rows.slice(64, 79); // 65-79
        const table5Rows = rows.slice(84, 99); // 85-99

        // টেবিল তৈরি
        buildTable("table1", table1Rows, cols1);
        buildTable("table2", table2Rows, cols2);
        buildTable("table3", table3Rows, cols3);
        buildTable("table4", table4Rows, cols4);
        buildTable("table5", table5Rows, cols5);
    })

    .catch(err => console.error("Error loading sheet:", err));

