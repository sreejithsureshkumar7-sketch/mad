function teacherGuard(){const u=prompt("Teacher Username");const p=prompt("Teacher Password");if(u!=="teacher"||p!=="teacher123"){alert("Wrong teacher login");location.href="index.html";}}
function classRepGuard(){const u=prompt("Class Rep Username");const p=prompt("Class Rep Password");if(u!=="cr"||p!=="cr123"){alert("Wrong class rep login");location.href="index.html";}}
function setToday(){const d=document.getElementById("attendanceDate");if(d)d.valueAsDate=new Date();}
async function registerStudent(){const s={name:document.getElementById("name").value.trim(),regno:document.getElementById("regno").value.trim(),department:document.getElementById("department").value.trim(),year:document.getElementById("year").value.trim(),email:document.getElementById("email").value.trim(),phone:document.getElementById("phone").value.trim(),createdAt:new Date().toISOString()};if(!s.name||!s.regno||!s.department||!s.year){alert("Name, Register Number, Department, Year required");return;}await db.collection("students").doc(s.regno).set(s);alert("Student details saved successfully!");document.querySelectorAll("input").forEach(i=>i.value="");document.querySelectorAll("select").forEach(s=>s.selectedIndex=0);}
function getFilters(){return{department:document.getElementById("filterDepartment")?.value||"",year:document.getElementById("filterYear")?.value||"",search:(document.getElementById("searchBox")?.value||"").toLowerCase()};}
async function loadStudents(){const tbody=document.getElementById("studentsTable");if(!tbody)return;const f=getFilters();tbody.innerHTML="";const snap=await db.collection("students").get();snap.forEach(doc=>{const s=doc.data();const text=`${s.name} ${s.regno}`.toLowerCase();if((!f.department||s.department===f.department)&&(!f.year||s.year===f.year)&&text.includes(f.search)){tbody.innerHTML+=`<tr><td>${s.name||""}</td><td>${s.regno||""}</td><td>${s.department||""}</td><td>${s.year||""}</td><td>${s.email||""}</td><td>${s.phone||""}</td></tr>`;}});}
async function loadAttendanceStudents(){const tbody=document.getElementById("attendanceStudents");if(!tbody)return;const dept=document.getElementById("attendanceDepartment").value;const year=document.getElementById("attendanceYear").value;tbody.innerHTML="";if(!dept||!year){tbody.innerHTML=`<tr><td colspan="6">Please select department and year</td></tr>`;return;}const snap=await db.collection("students").get();let count=0;snap.forEach(doc=>{const s=doc.data();if(s.department===dept&&s.year===year){count++;tbody.innerHTML+=`<tr data-name="${s.name}" data-regno="${s.regno}" data-department="${s.department}" data-year="${s.year}"><td>${s.name}</td><td>${s.regno}</td><td>${s.department}</td><td>${s.year}</td><td><input type="radio" class="present" name="${s.regno}" value="Present"></td><td><input type="radio" class="absent" name="${s.regno}" value="Absent"></td></tr>`;}});if(count===0)tbody.innerHTML=`<tr><td colspan="6">No students found for this department and year</td></tr>`;}
async function saveAttendance(){const date=document.getElementById("attendanceDate").value;const dept=document.getElementById("attendanceDepartment").value;const year=document.getElementById("attendanceYear").value;if(!date||!dept||!year){alert("Please select date, department and year");return;}const rows=document.querySelectorAll("#attendanceStudents tr");let saved=0;for(const row of rows){const selected=row.querySelector("input[type='radio']:checked");if(selected){const regno=row.dataset.regno;await db.collection("attendance").doc(`${date}_${regno}`).set({date,name:row.dataset.name,regno,department:row.dataset.department,year:row.dataset.year,status:selected.value,markedBy:"Class Rep",createdAt:new Date().toISOString()});saved++;}}alert(saved+" attendance records saved!");}
async function loadAttendanceReport(){
const tbody=document.getElementById("attendanceReport");
if(!tbody)return;
const f=getFilters();
tbody.innerHTML="";
let present=0,absent=0,total=0;
const snap=await db.collection("attendance").get();

snap.forEach(doc=>{
const a=doc.data();
if((!f.department||a.department===f.department)&&(!f.year||a.year===f.year)){
total++;
if(a.status==="Present")present++;
if(a.status==="Absent")absent++;
tbody.innerHTML+=`<tr><td>${a.date||""}</td><td>${a.name||""}</td><td>${a.regno||""}</td><td>${a.department||""}</td><td>${a.year||""}</td><td>${a.status||""}</td><td>${a.markedBy||""}</td></tr>`;
}
});

document.getElementById("presentCount").innerText=present;
document.getElementById("absentCount").innerText=absent;
document.getElementById("totalCount").innerText=total;

const percentage=total>0?((present/total)*100).toFixed(2):"0.00";
const percentageBox=document.getElementById("attendancePercentage");
if(percentageBox)percentageBox.innerText=percentage+"%";
}

function downloadPDF(){
window.print();
}

function downloadExcel(){
const reportBody=document.getElementById("attendanceReport");
if(!reportBody){alert("Attendance report not found");return;}
const table=reportBody.closest("table");
if(!table){alert("Attendance table not found");return;}
const html=`<html><head><meta charset="UTF-8"></head><body>${table.outerHTML}</body></html>`;
const blob=new Blob([html],{type:"application/vnd.ms-excel"});
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="attendance-report.xls";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(a.href);
}

async function viewMyAttendance(){const regno=document.getElementById("checkRegno").value.trim();const box=document.getElementById("myAttendance");if(!regno){alert("Enter register number");return;}box.innerHTML="<h3>Attendance History</h3>";const snap=await db.collection("attendance").where("regno","==",regno).get();if(snap.empty){box.innerHTML+="<p>No attendance found</p>";return;}let table="<div class='table-wrap'><table><tr><th>Date</th><th>Department</th><th>Year</th><th>Status</th></tr>";snap.forEach(doc=>{const a=doc.data();table+=`<tr><td>${a.date}</td><td>${a.department||""}</td><td>${a.year||""}</td><td>${a.status}</td></tr>`;});table+="</table></div>";box.innerHTML+=table;}