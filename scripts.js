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

      // Basic student info
      const basicInfo = {
        "name": student[0],
        "father": student[1], 
        "mother": student[2],
        "regi": student[3],
        "final-cgpa": student[4]
      };

      // 1st Year Courses (দুইবার ব্যবহার)
      const firstYearCourses = {
        "final-211501": student[5],   // Final Year section
        "first-211501": student[5],   // 1st Year section
        "final-212707": student[6],
        "first-212707": student[6],
        "final-212709": student[7],
        "first-212709": student[7],
        "final-213607": student[8],
        "first-213607": student[8],
        "final-213608": student[9],
        "first-213608": student[9],
        "final-213701": student[10],
        "first-213701": student[10],
        "final-213703": student[11],
        "first-213703": student[11],
        "final-213705": student[12],
        "first-213705": student[12],
        "final-213707": student[13],
        "first-213707": student[13]
      };

      // 2nd Year Courses (দুইবার ব্যবহার)
      const secondYearCourses = {
        "final-english": student[15],// Final Year section
        "second-english": student[15],// 2nd Year section
        "final-222707": student[16],  
        "second-222707": student[16], 
        "final-222708": student[17],
        "second-222708": student[17],
        "final-223609": student[18],
        "second-223609": student[18],
        "final-223610": student[19],
        "second-223610": student[19],
        "final-223701": student[20],
        "second-223701": student[20],
        "final-223703": student[21],
        "second-223703": student[21],
        "final-223705": student[22],
        "second-223705": student[22],
        "final-223706": student[23],   // Final Year section
        "second-223706": student[23]   // 2nd Year section
      };

      // 3rd Year Courses (দুইবার ব্যবহার)
      const thirdYearCourses = {
        "final-233701": student[25],  // Final Year section
        "third-233701": student[25],  // 3rd Year section
        "final-233703": student[26],
        "third-233703": student[26],
        "final-233705": student[27],
        "third-233705": student[27],
        "final-233707": student[28],
        "third-233707": student[28],
        "final-233709": student[29],
        "third-233709": student[29],
        "final-233711": student[30],
        "third-233711": student[30],
        "final-233713": student[31],
        "third-233713": student[31],
        "final-233714": student[32],
        "third-233714": student[32]
      };

      // 4th Year Courses (দুইবার ব্যবহার)
      const fourthYearCourses = {
        "final-243701": student[34],  // Final Year section
        "fourth-243701": student[34], // 4th Year section
        "final-243703": student[35],
        "fourth-243703": student[35],
        "final-243705": student[36],
        "fourth-243705": student[36],
        "final-243707": student[37],
        "fourth-243707": student[37],
        "final-243709": student[38],
        "fourth-243709": student[38],
        "final-243711": student[39],
        "fourth-243711": student[39],
        "final-243713": student[40],
        "fourth-243713": student[40],
        "final-243717": student[41],
        "fourth-243717": student[41],
        "final-243718": student[42],
        "fourth-243718": student[42],
        "final-243720": student[43],
        "fourth-243720": student[43]
      };

      // GPA Data (দুইবার ব্যবহার)
      const gpaData = {
        "result-gpa1": student[14],   // Result section
        "table-gpa1": student[14],    // Table section
        "result-gpa2": student[24],
        "table-gpa2": student[24],
        "result-gpa3": student[33],
        "table-gpa3": student[33],
        "result-gpa4": student[44],
        "table-gpa4": student[44]
      };

      // Populate Basic Info
      Object.keys(basicInfo).forEach(id => {
        const cell = document.getElementById(id);
        if (cell) {
          cell.innerText = basicInfo[id] || "";
        }
      });

      // Populate All Courses (দুইবার ডাটা সেট হবে)
      const allCourses = {
        ...firstYearCourses,
        ...secondYearCourses, 
        ...thirdYearCourses,
        ...fourthYearCourses
      };

      Object.keys(allCourses).forEach(id => {
        const cell = document.getElementById(id);
        if (cell) {
          const grade = allCourses[id] || "";
          cell.innerText = grade;
          
          // F grade styling
          if (grade.toUpperCase() === "F" || grade.toUpperCase() === "FAIL") {
            cell.classList.add("f-grade");
          } else {
            cell.classList.remove("f-grade");
          }
        }
      });

      // Populate GPA Data
      Object.keys(gpaData).forEach(gpaId => {
        const cell = document.getElementById(gpaId);
        if (cell) {
          const gpaValue = gpaData[gpaId] || "0.00";
          if (gpaId.startsWith('table-')) {
            cell.innerHTML = `<b>GPA: ${gpaValue}</b>`;
          } else {
            cell.innerText = gpaValue;
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
