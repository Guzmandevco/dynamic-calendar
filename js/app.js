/* global variables */
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

/* get the css class for each day */
function getDayClass(j, day, month, year, currentMonth, currentYear, programmationPerMonth) {
  if (day === j && currentMonth === month && currentYear === year ) {
    return 'today';
  } else if (programmationPerMonth[j] === "1roDia" || programmationPerMonth[j] === "2doDia") {
    return 'diurnal';
  } else if (programmationPerMonth[j] === '1roNoche' || programmationPerMonth[j] === "2doNoche") {
    return 'nocturnal';
  } else if (programmationPerMonth[j] === '1erDescanso' || programmationPerMonth[j] === '2doDescanso') {
    return 'resting';
  } else {
    return '';
  }
}

/* render days of current month */
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
  const dayClass = getDayClass(j, day, month, year, currentMonth, currentYear, programmationPerMonth);
  html += `<div class="day ${dayClass}">${j}</div>`;
}
  daysElement.innerHTML = html;
}

/* get start day of week */
function startDay() {
  let now = new Date(currentYear, currentMonth, 1);
  return ((now.getDay()) == 0) ? 0 : now.getDay();
}

/* get total  days of current month */
function totalDaysOfMonth(month) {
  const daysOfMonths = {
    '31': [0, 2, 4, 6, 7, 9, 11],
    '30': [3, 5, 8, 10],
  }
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

/* main function */
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

/* Verify if given year is leap or not */
function isLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/* change the current month when user clicked */
function changeMonth(dir) {
  if(dir == 'left') {
    currentMonth -= 1
    if(currentMonth < 0) {
      currentMonth = 11
      currentYear -= 1
    }
  } else if(dir == 'right'){
    currentMonth += 1;
    if(currentMonth > 11) {
      currentMonth = 0
      currentYear += 1
    }
  }
}

/* getting the programming for the current month */
const getProgrammingPerMonth = (currentProgramation) => {
  const today = new Date();
  let month = today.getMonth();
  let startDay = month === currentMonth ? currentDay : 1;
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
  let dayIndex = programming.indexOf(programmationLastDayOfMonth);
  let programmingFirstDayNextMonth = getProgrammingFirstDayOfMonth(programmationLastDayOfMonth)
  let {programmingDict, programmingLastDay} = getProgrammingPerMonth(programmingFirstDayNextMonth);
  programmationPerMonth = programmingDict
  programmationLastDayOfMonth = programmingLastDay
  main(currentYear, currentMonth, currentDay);
});

/* calling de main function when the is loaded */
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  currentDay = day;
  currentMonth = month;
  currentYear = year;
  let {programmingDict, programmingLastDay} = getProgrammingPerMonth("1erDescanso");
  programmationPerMonth = programmingDict;
  programmationLastDayOfMonth = programmingLastDay;
  main(year, month, day);

  /* getting the current language from device of user  */
  let language = window.navigator.language;
    let items = document.getElementById('days-name');
    let divElements = items.querySelectorAll('div');
    if(language === "es-US" || language === "es-ES") {
      let chars = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
      divElements.forEach((element, index) => {
        element.textContent = chars[index];
      })
    } 
});