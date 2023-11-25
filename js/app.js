// ----------- global variables --------- //
const monthElement = document.getElementById('month');
const yearElement = document.getElementById('year');
const daysElement = document.getElementById('days');
const nextBtn = document.getElementById('next-month');
const previousBtn = document.getElementById('previous-month');
let currentYear;
let currentMonth;
let currentDay;

// ---------- render days of current month --------- //
function renderDaysOfMonth(Month) {
  const now = new Date;
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
    html += `<div class="day ${((day === j) && (currentMonth == month) && (currentYear === year)) ? 'today' : '' }">${j}</div>`;
  }
  daysElement.innerHTML = html;
}


function startDay() {
  let now = new Date(currentYear, currentMonth, 1);
  return ((now.getDay() -1 )  === -1) ? 6 : now.getDay();
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
  const today = new Date(cyear, cmonth, cday);
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

previousBtn.addEventListener('click', () => {
  changeMonth('left');
  main(currentYear, currentMonth, currentDay);
});

nextBtn.addEventListener('click', () => {
  changeMonth('right');
  main(currentYear, currentMonth, currentDay);
});

// ---------- calling de main function when the is loaded  --------- //
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  main(year, month, day);

  /* --------- getting the current language from device of user ------ */
  let language = window.navigator.language;
  if(language === "es-US") {
    let items = document.getElementById('days-name');
    let all = items.querySelectorAll('div');
    let leters = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    all.forEach((e, idx) => {
      e.textContent = leters[idx];
    })
  } 
});
