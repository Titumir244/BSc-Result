// ==========================
// Google Sheet CSV URL
// ==========================
const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ib1jaojQVFlpH0BgM2YxlYvpOxu_cLAoGwNmWlkCiD2a9Cg-MABkIpGpPLI7yQ/pub?gid=289845772&single=true&output=csv";

// ==========================
// Hide all type sections
// ==========================
function hideAllTypes() {
  const types = ["final-year", "first-year", "second-year", "third-year", "fourth-year"];
  types.forEach(type => {
    document.querySelectorAll(`.${type}`).forEach(el => {
      el.style.display = "none";
    });
  });
}

// ==========================
// Show selected type
// ==========================
function showType(type) {
  document.querySelectorAll(`.${type}`).forEach(el => {
    el.style.display = "block";
  });
}

// ==========================
// Submit button click
// ==========================
document.getElementById("searchBtn").addEventListener("click", () => {
  const roll = document.getElementById("rollInput").value.trim();
  const type = document.getElementById("typeInput").value.trim();

  if (!roll) {
    alert("নাম সিলেক্ট করুন");
    return;
  }
  if (!type) {
    alert("Type সিলেক্ট করুন");
    return;
  }

  // Hide all types first
  hideAllTypes();

  // Show tabl4 section
  const tabl = document.querySelector(".tabl4");
  if (tabl) tabl.style.display = "block";

  // Show selected type section
  showType(type);

  // ==========================
  // Fetch CSV and populate data
  // ==========================
  fetch(csvURL)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").map(r => r.split(","));
      const dataRows = rows.slice(1); // skip header

      // Roll number in 4th column (index 3)
      const student = dataRows.find(r => r[3] === roll);

      if (!student) {
        alert("রোল নম্বর পাওয়া যায়নি");
        return;
      }

      // Course IDs
      const courseIds = ["name", "father", "mother", "regi", "cgpa",
        "211501", "212707", "212709", "213607", "213608", "213701", "213703", "213705", "213707",
        "gpa1", "english", "222707", "222708", "223609", "223610", "223701", "223703", "223705", "223706",
        "gpa2", "233701", "233703", "233705", "233707", "233709", "233711", "233713", "233714",
        "gpa3", "243701", "243703", "243705", "243707", "243709", "243711", "243713", "243717", "243718", "243720", "gpa4"];

      courseIds.forEach((code, idx) => {
        const grade = student[idx] || "";
        const cell = document.getElementById(code);
        if (cell) {
          cell.innerText = grade;
          if (grade.toUpperCase() === "F" || grade.toUpperCase() === "FAIL") {
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
});

// ==========================
// Download PDF function
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

// ==========================
// Initially hide all type sections & tabl4
// ==========================
hideAllTypes();
document.querySelector(".tabl4").style.display = "none";
