// ==========================
// Configuration Section
// ==========================
const CONFIG = {
    csvURL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Ib1jaojQVFlpH0BgM2YxlYvpOxu_cLAoGwNmWlkCiD2a9Cg-MABkIpGpPLI7yQ/pub?gid=289845772&single=true&output=csv",
    
    // Year types
    yearTypes: ["final-year", "first-year", "second-year", "third-year", "fourth-year"],
    
    // Column indices for data mapping
    columnIndices: {
        basicInfo: { start: 0, end: 4 },
        firstYear: { start: 5, end: 13 },
        secondYear: { start: 15, end: 23 },
        thirdYear: { start: 25, end: 32 },
        fourthYear: { start: 34, end: 43 },
        gpa: [14, 24, 33, 44]
    },
    
    // Color scheme for better UI
    colors: {
        // primary: "#2563eb",
        success: "#059669",
        warning: "#d97706",
        // error: "#dc2626"
    }
};

// ==========================
// Utility Functions
// ==========================
class Utils {
    /**
     * Parse CSV text into array of rows
     */
    static parseCSV(csvText) {
        return csvText.trim().split("\n").map(row => 
            row.split(",").map(cell => cell.trim())
        );
    }
    
    /**
     * Show error message
     */
    static showError(message) {
        console.error(message);
        alert(message);
    }
    
    /**
     * Validate input fields
     */
    static validateInputs(roll, type) {
        if (!roll) {
            Utils.showError("নাম সিলেক্ট করুন");
            return false;
        }
        if (!type) {
            Utils.showError("Type সিলেক্ট করুন");
            return false;
        }
        return true;
    }
}

// ==========================
// UI Manager Class
// ==========================
class UIManager {
    /**
     * Hide all year type sections
     */
    static hideAllTypes() {
        CONFIG.yearTypes.forEach(type => {
            document.querySelectorAll(`.${type}`).forEach(el => {
                el.style.display = "none";
            });
        });
    }
    
    /**
     * Show selected year type section
     */
    static showType(type) {
        document.querySelectorAll(`.${type}`).forEach(el => {
            el.style.display = "block";
        });
    }
    
    /**
     * Show main result section
     */
    static showResultSection() {
        const tabl = document.querySelector(".tabl4");
        if (tabl) {
            tabl.style.display = "block";
            tabl.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Show loading state on search button
     */
    static showLoading() {
        const btn = document.getElementById("searchBtn");
        if (btn) {
            btn.innerHTML = '<i class="loading-spinner"></i> লোড হচ্ছে...';
            btn.disabled = true;
        }
    }
    
    /**
     * Hide loading state
     */
    static hideLoading() {
        const btn = document.getElementById("searchBtn");
        if (btn) {
            btn.innerHTML = 'রেজাল্ট দেখুন';
            btn.disabled = false;
        }
    }
    
    /**
     * Show success state briefly
     */
    static showSuccess() {
        const btn = document.getElementById("searchBtn");
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> সফল!';
            btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            
            setTimeout(() => {
                this.resetButton();
            }, 1500);
        }
    }
    
    /**
     * Reset button to original state
     */
    static resetButton() {
        const btn = document.getElementById("searchBtn");
        if (btn) {
            btn.innerHTML = 'রেজাল্ট দেখুন';
            btn.style.background = '';
            btn.disabled = false;
        }
    }
}

// ==========================
// Data Manager Class
// ==========================
class DataManager {
    /**
     * Extract student data from CSV row
     */
    static extractStudentData(student) {
        return {
            // Basic Information
            basicInfo: {
                "name": student[0],
                "father": student[1], 
                "mother": student[2],
                "regi": student[3],
                "final-cgpa": student[4]
            },
            
            // Course Data
            courses: {
                // First Year Courses
                ...this.mapCourses(student, 5, 13, "first", "final"),
                // Second Year Courses  
                ...this.mapCourses(student, 15, 23, "second", "final"),
                // Third Year Courses
                ...this.mapCourses(student, 25, 32, "third", "final"),
                // Fourth Year Courses
                ...this.mapCourses(student, 34, 43, "fourth", "final")
            },
            
            // GPA Data
            gpaData: {
                "result-gpa1": student[14],
                "table-gpa1": student[14],
                "result-gpa2": student[24],
                "table-gpa2": student[24],
                "result-gpa3": student[33],
                "table-gpa3": student[33],
                "result-gpa4": student[44],
                "table-gpa4": student[44]
            }
        };
    }
    
    /**
     * Map courses for both year-specific and final year sections
     */
    static mapCourses(student, startIdx, endIdx, yearPrefix, finalPrefix) {
        const courseMap = {};
        const courseIds = this.getCourseIds(yearPrefix);
        
        for (let i = startIdx, j = 0; i <= endIdx && j < courseIds.length; i++, j++) {
            const courseId = courseIds[j];
            courseMap[`${finalPrefix}-${courseId}`] = student[i];
            courseMap[`${yearPrefix}-${courseId}`] = student[i];
        }
        
        return courseMap;
    }
    
    /**
     * Get course IDs for each year
     */
    static getCourseIds(year) {
        const courseMap = {
            first: ["211501", "212707", "212709", "213607", "213608", "213701", "213703", "213705", "213707"],
            second: ["english", "222707", "222708", "223609", "223610", "223701", "223703", "223705", "223706"],
            third: ["233701", "233703", "233705", "233707", "233709", "233711", "233713", "233714"],
            fourth: ["243701", "243703", "243705", "243707", "243709", "243711", "243713", "243717", "243718", "243720"]
        };
        
        return courseMap[year] || [];
    }
    
    /**
     * Find student by roll number
     */
    static findStudentByRoll(rows, roll) {
        const dataRows = rows.slice(1); // skip header
        return dataRows.find(row => row[3] === roll);
    }
}

// ==========================
// Data Populator Class
// ==========================
class DataPopulator {
    /**
     * Populate all data to UI
     */
    static populateAllData(studentData) {
        this.populateBasicInfo(studentData.basicInfo);
        this.populateCourses(studentData.courses);
        this.populateGPA(studentData.gpaData);
    }
    
    /**
     * Populate basic student information
     */
    static populateBasicInfo(basicInfo) {
        Object.keys(basicInfo).forEach(id => {
            const cell = document.getElementById(id);
            if (cell) {
                cell.textContent = basicInfo[id] || "";
            }
        });
    }
    
    /**
     * Populate course grades with F grade styling
     */
    static populateCourses(courses) {
        Object.keys(courses).forEach(id => {
            const cell = document.getElementById(id);
            if (cell) {
                const grade = courses[id] || "";
                cell.textContent = grade;
                
                // Apply F grade styling
                this.applyGradeStyling(cell, grade);
            }
        });
    }
    
    /**
     * Apply styling based on grade
     */
    static applyGradeStyling(cell, grade) {
        const normalizedGrade = grade.toUpperCase();
        
        if (normalizedGrade === "F" || normalizedGrade === "FAIL") {
            cell.classList.add("f-grade");
            cell.style.color = CONFIG.colors.error;
            cell.style.fontWeight = "bold";
        } else {
            cell.classList.remove("f-grade");
            cell.style.color = "";
            cell.style.fontWeight = "";
        }
    }
    
    /**
     * Populate GPA data with special formatting
     */
    static populateGPA(gpaData) {
        Object.keys(gpaData).forEach(gpaId => {
            const cell = document.getElementById(gpaId);
            if (cell) {
                const gpaValue = gpaData[gpaId] || "0.00";
                
                if (gpaId.startsWith('table-')) {
                    cell.innerHTML = `<b>GPA: ${gpaValue}</b>`;
                    cell.style.color = CONFIG.colors.primary;
                } else {
                    cell.textContent = gpaValue;
                }
            }
        });
    }
}

// ==========================
// Main Application Class
// ==========================
class ResultApp {
    /**
     * Initialize the application
     */
    static init() {
        this.setupEventListeners();
        this.hideAllSections();
    }
    
    /**
     * Setup event listeners
     */
    static setupEventListeners() {
        const searchBtn = document.getElementById("searchBtn");
        if (searchBtn) {
            searchBtn.addEventListener("click", () => this.handleSearch());
        }
        
        // Enter key support for roll input
        const rollInput = document.getElementById("rollInput");
        if (rollInput) {
            rollInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") this.handleSearch();
            });
        }
    }
    
    /**
     * Hide all sections initially
     */
    static hideAllSections() {
        UIManager.hideAllTypes();
        const tabl = document.querySelector(".tabl4");
        if (tabl) tabl.style.display = "none";
    }
    
    /**
     * Handle search button click
     */
    static async handleSearch() {
        const roll = document.getElementById("rollInput").value.trim();
        const type = document.getElementById("typeInput").value.trim();
        
        if (!Utils.validateInputs(roll, type)) return;
        
        UIManager.showLoading();
        
        try {
            // Hide all and show selected
            UIManager.hideAllTypes();
            UIManager.showType(type);
            UIManager.showResultSection();
            
            // Fetch and process data
            await this.fetchAndDisplayData(roll);
            UIManager.showSuccess();
            
        } catch (error) {
            console.error("Error:", error);
            Utils.showError("ডাটা লোড করতে সমস্যা হয়েছে");
            UIManager.hideLoading();
        }
    }
    
    /**
     * Fetch CSV data and display results
     */
    static async fetchAndDisplayData(roll) {
        const response = await fetch(CONFIG.csvURL);
        const text = await response.text();
        const rows = Utils.parseCSV(text);
        
        const student = DataManager.findStudentByRoll(rows, roll);
        if (!student) {
            Utils.showError("রোল নম্বর পাওয়া যায়নি");
            throw new Error("Student not found");
        }
        
        const studentData = DataManager.extractStudentData(student);
        DataPopulator.populateAllData(studentData);
    }
}

// ==========================
// PDF Download Function
// ==========================
function downloadPDF(pdf) {
    const element = document.getElementById(pdf);
    if (!element) {
        Utils.showError("PDF element not found");
        return;
    }
    
    const options = {
        filename: 'Result.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'px', format: [740, 860], orientation: 'landscape' }
    };
    
    html2pdf().set(options).from(element).save();
}

// ==========================
// Initialize Application when DOM is ready
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    ResultApp.init();
});
