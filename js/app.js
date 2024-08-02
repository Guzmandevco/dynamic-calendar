// ----------- global variables --------- //
const monthElement = document.getElementById('month');
const yearElement = document.getElementById('year');
const daysElement = document.getElementById('days');
const nextBtn = document.getElementById('next-month');
const previousBtn = document.getElementById('previous-month');

let currentYear;
let currentMonth;
let currentDay;
let programmationPerMonth;
let programmationLastDayOfMonth;

/* available programming */
const programming = [
  "1roDia",
  "2doDia",
  "1roNoche",
  "2doNoche",
  "1erDescanso",
  "2doDescanso"
  ]
  
  const listOfMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// ---------- render days of current month --------- //
function renderDaysOfMonth(Month) {
  const now = new Date();
  let day = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();
  let days = totalDaysOfMonth(Month);
  let daysPrev = totalDaysOfMonth(currentMonth-1);
  let html = '';
  for(let i = startDay(); i > 0; i--) {
    html += `<div class="day shadow">${daysPrev - (i-1)}</div>`;
  }
  for (let j = 1; j <= days; j++) {
    html += `<div class="day ${((day === j) && (currentMonth == month) && (currentYear === year)) ? 'today' :  (programmationPerMonth[j] == "1roDia" || programmationPerMonth[j] == "2doDia") ? 'diurnal' : programmationPerMonth[j] == '1roNoche' || programmationPerMonth[j] == "2doNoche" ? 'nocturnal' : programmationPerMonth[j] == '1erDescanso' || programmationPerMonth[j] == '2doDescanso' ? 'resting' : '' }">${j}</div>`;
  }
  
  daysElement.innerHTML = html;
}


function startDay() {
  let now = new Date(currentYear, currentMonth, 1);
  return ((now.getDay()) == 0) ? 0 : now.getDay();
}

// ---------- get total  days of current month --------- //
const daysOfMonths = {
  '31': [0, 2, 4, 6, 7, 9, 11],
  '30': [3, 5, 8, 10],
}
function totalDaysOfMonth(month) {
  if(daysOfMonths['31'].indexOf(month) != -1) {
    return 31;
  } else if(daysOfMonths['30'].indexOf(month) != -1) {
    return 30;
  } if(isLeap(currentYear)) {
    return 29;
  } else {
    return 28;
  }
}

// ---------- main function  --------- //
function main(cyear, cmonth, cday) {
  
  const today = new Date(cyear, cmonth, 1 );
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  monthElement.innerText = listOfMonths[month];
  yearElement.innerText = year;
  currentDay = day;
  currentYear = year;
  currentMonth = month;
  renderDaysOfMonth(currentMonth);
}

// ---------- Verify if given year is leap or not  --------- //
function isLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// ---------- change the current month when user clicked   --------- //
function changeMonth(dir) {
  if(dir == 'left') {
    currentMonth -= 1;
  } else if(dir == 'right'){
    currentMonth += 1;
  }
}

/* getting the programming for the current month */
const getProgrammingPerMonth = (currentProgramation) => {
  const today = new Date();
  let month = today.getMonth();
  let startDay = month !== currentMonth ? currentDay : 1;
  let programmingDict = {};
  let totalDays = totalDaysOfMonth(currentMonth);
  let currentIndex = programming.indexOf(currentProgramation);
  let nextDayIndex = currentIndex;
  let programmingLastDay = undefined;
  nextDayIndex += 1;
  for (let i = startDay; i <= totalDays; i++) {
    programmingDict[i] = programming[currentIndex % programming.length]
    currentIndex += 1
  }
  programmingLastDay = programmingDict[totalDays]
  return {programmingDict, programmingLastDay}
}

/**
 * @param {String} lastDay programmation last day previous month
 * @returns {String} 
 */
function getProgrammingFirstDayOfMonth (lastDay) {
  let firstDay = undefined;
  if(lastDay == "1roDia") {
    firstDay = "2doDia"
  } else if (lastDay == "2doDia") {
    firstDay = "1roNoche"
  } else if (lastDay == "1roNoche") {
    firstDay = "2doNoche"
  } else if (lastDay == "2doNoche") {
    firstDay = "1erDescanso"
  } else if (lastDay == "1erDescanso") {
    firstDay = "2doDescanso"
  } else if (lastDay == "2doDescanso") {
    firstDay = "1roDia"
  } else {
    console.log("Unknown guest!")
  }
  return firstDay;
}



previousBtn.addEventListener('click', () => {
  changeMonth('left');
  main(currentYear, currentMonth, currentDay);
});

nextBtn.addEventListener('click', () => {
  changeMonth('right');
  main(currentYear, currentMonth, currentDay);
  let dayIndex = programming.indexOf(programmationLastDayOfMonth);
  let programmingFirstDayNextMonth = getProgrammingFirstDayOfMonth(programmationLastDayOfMonth)
  
  
  //console.log("First day september", programmingFirstDayNextMonth)
  let {programmingDict, programmingLastDay} = getProgrammingPerMonth(programmingFirstDayNextMonth);
  programmationPerMonth = programmingDict
  console.log(programmationLastDayOfMonth)
  console.log(`Programming ${listOfMonths[currentMonth]}`, programmationPerMonth)
  //console.log("Programming Last day", programmingLastDay)
  programmationLastDayOfMonth = programmingLastDay
  //console.log(programmationLastDayOfMonth)
});

// ---------- calling de main function when the is loaded  --------- //
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  currentDay = day;
  currentMonth = month;
  currentYear = year;
  let {programmingDict, programmingLastDay} = getProgrammingPerMonth("2doNoche");
  programmationPerMonth = programmingDict;
  programmationLastDayOfMonth = programmingLastDay;
  main(year, month, day);
  console.log(programmationPerMonth)

  /* --------- getting the current language from device of user ------ */
  let language = window.navigator.language;
  if(language === "en-US") {
    let items = document.getElementById('days-name');
    let all = items.querySelectorAll('div');
    let leters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    all.forEach((e, idx) => {
      e.textContent = leters[idx];
    })
  } 
});