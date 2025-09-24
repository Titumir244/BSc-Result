// ==========================
// প্রথম Google Sheet URL (টেবিলের জন্য)
// ==========================
const tableSheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ib1jaojQVFlpH0BgM2YxlYvpOxu_cLAoGwNmWlkCiD2a9Cg-MABkIpGpPLI7yQ/pub?gid=1610874522&single=true&output=csv";

// ==========================
// দ্বিতীয় Google Sheet URL (PDF এর জন্য)
// ==========================
const pdfSheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ib1jaojQVFlpH0BgM2YxlYvpOxu_cLAoGwNmWlkCiD2a9Cg-MABkIpGpPLI7yQ/pub?gid=289845772&single=true&output=csv";

// ==========================
// টেবিল তৈরি করার ফাংশন + Highlight
// ==========================
function buildTable(targetId, rows, wantedCols) {
    const tbody = document.querySelector(`#${targetId} tbody`);
    tbody.innerHTML = "";

    rows.forEach((row) => {
        const tr = document.createElement("tr");
        let rowClass = "";

        wantedCols.forEach((colIndex) => {
            const td = document.createElement("td");
            td.textContent = row[colIndex] || "";

            if (td.textContent.trim().toUpperCase() === "F") {
                td.style.color = "#ff6666";
                td.style.fontWeight = "bold";
            }

            const cellText = td.textContent.trim().toLowerCase();
            if (cellText === "1st") rowClass = "first";
            else if (cellText === "2nd") rowClass = "second";
            else if (cellText === "3rd") rowClass = "third";
            else if (cellText === "Fail") rowClass = "Fail";

            tr.appendChild(td);
        });

        if (rowClass === "first") tr.style.color = "#4caf50";
        else if (rowClass === "second") tr.style.color = "#2196f3";
        else if (rowClass === "third") tr.style.color = "#ff9800";
        else if (rowClass === "Fail") tr.style.color = "#ff6666";

        // ==========================
        // table1-এর VIEW বাটন
        // ==========================
        if (targetId === "table1") {
            const td = document.createElement("td");
            td.textContent = "VIEW";
            td.style.cursor = "pointer";
            td.style.fontWeight = "bold";
            td.style.textAlign = "center";
            td.style.borderRadius = "4px";

            td.addEventListener("click", () => {
                const rollNumber = row[3] || ""; // তৃতীয় কলাম = roll number
                updatePDF(rollNumber); // সরাসরি PDF আপডেট
                // CSS পরিবর্তন: টেবিল লুকানো, PDF দেখানো
                const tabSection = document.querySelector(".tab");
                const pdfSection = document.querySelector(".tabl");
                if (tabSection) tabSection.style.display = "none";
                if (pdfSection) pdfSection.style.display = "block";
            });

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });
}

// ==========================
// PDF আপডেট করার ফাংশন
// ==========================
function updatePDF(roll) {
    fetch(pdfSheetURL)
        .then(res => res.text())
        .then(text => {
            const rows = text.trim().split("\n").map(r => r.split(","));
            // ধরুন Header আছে rows[0], রোল B কলাম index 0?
            const header = rows[0];
            const dataRows = rows.slice(1);

            // ধরুন রোল নাম্বার প্রথম কলাম
            const student = dataRows.find(r => r[3] === roll);

            if (!student) {
                alert("রোল নম্বর পাওয়া যায়নি");
                return;
            }

            // কোর্স কোড তালিকা — আপনার সঠিক কোর্স আইডি গুলো
            const courseIds = ["name", "father", "mother", "regi", "cgpa", "211501", "212707", "212709", "213607", "213608", "213701", "213703", "213705", "213707", "gpa1", "english", "222707", "222708", "223609", "223610", "223701", "223703", "223705", "223706", "gpa2", "233701", "233703", "233705", "233707", "233709", "233711", "233713", "233714", "gpa3", "243701", "243703", "243705", "243707", "243709", "243711", "243713", "243717", "243718", "243720", "gpa4"]; // আপনার সলে যুক্ত করুন

            courseIds.forEach((code, idx) => {
                const grade = student[0 + idx] || "";
                const cell = document.getElementById(code);
                if (cell) {
                    cell.innerText = grade;
                    if (grade.toUpperCase() === "F") {
                        cell.classList.add("f-grade");
                    } else {
                        cell.classList.remove("f-grade");
                    }
                }
            });
        })
        .catch(err => {
            console.error("Error fetching CSV:", err);
            alert("ডাটা লোড করতে সমস্যা হয়েছে");
        });
};

// ==========================
// প্রথম Sheet থেকে টেবিল লোড
// ==========================
fetch(tableSheetURL)
    .then(res => res.text())
    .then(csvText => {
        const rows = csvText.trim().split("\n").map(r => r.split(","));

        const cols1 = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16];
        const cols2 = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
        const cols3 = cols2;
        const cols4 = [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
        const cols5 = cols2;

        const table1Rows = rows.slice(4, 19);
        const table2Rows = rows.slice(24, 39);
        const table3Rows = rows.slice(44, 59);
        const table4Rows = rows.slice(64, 79);
        const table5Rows = rows.slice(84, 99);

        buildTable("table1", table1Rows, cols1);
        buildTable("table2", table2Rows, cols2);
        buildTable("table3", table3Rows, cols3);
        buildTable("table4", table4Rows, cols4);
        buildTable("table5", table5Rows, cols5);
    })
    .catch(err => console.error("Error loading table sheet:", err));

// ==========================
// PDF Download
// ==========================
function downloadPDF(pdf) {
    let element = document.getElementById(pdf);
    let opt = {
        margin: [15, 0, 15, 15],
        filename: 'Result.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'px', format: [810, 860], orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}


