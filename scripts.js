// আপনার Google Sheet-এর CSV URL (যেটা আপনি দিয়েছেন)
const csvURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ib1jaojQVFlpH0BgM2YxlYvpOxu_cLAoGwNmWlkCiD2a9Cg-MABkIpGpPLI7yQ/pub?gid=289845772&single=true&output=csv";

document.getElementById("searchBtn").addEventListener("click", () => {
  const roll = document.getElementById("rollInput").value.trim();
  if (!roll) {
    alert("নাম সিলেক্ট করুন");
    return;
  }

  fetch(csvURL)
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
      const courseIds = ["name","father","mother","regi","cgpa","211501","212707","212709","213607","213608","213701","213703","213705","213707","gpa1","english","222707","222708","223609","223610","223701","223703","223705","223706","gpa2","233701","233703","233705","233707","233709","233711","233713","233714","gpa3","243701","243703","243705","243707","243709","243711","243713","243717","243718","243720","gpa4"]; // আপনার সলে যুক্ত করুন

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
});

function downloadPDF(pdf) {
  let element = document.getElementById(pdf); // যে অংশটাকে PDF বানাতে চাই
  let opt = {
    margin: 0.5,
    filename: 'Result.pdf',   // ফাইলের নাম
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'px', format: [770, 900], orientation: 'landscape' }
  };
  html2pdf().set(opt).from(element).save();
}


