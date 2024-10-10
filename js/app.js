/* global variables */
const monthElement = document.getElementById('month');
const yearElement = document.getElementById('year');
const daysElement = document.getElementById('days');
const nextBtn = document.getElementById('next-month');
const previousBtn = document.getElementById('previous-month');
const selectElement = document.getElementById('options-select');
const modalElement = document.getElementById('modal');
const closeModalBtn = modalElement.querySelector('span');
const messagaElement = document.getElementById('message-element');
const headingElement = document.getElementById("heading");


let language = window.navigator.language;
let currentYear;
let currentMonth;
let currentDay;
let selectedProgrammation = undefined;
let programmationPerMonth;
let programmationLastDayOfMonth;
let currentProgramation;
let helpMessageWasShowed = getCookie("messageView") || false;
let modalShowed = getCookie("modal") || false;
let programmationSelected = false;

/* available programming */
const programming = [
  "1roDia",
  "2doDia",
  "1roNoche",
  "2doNoche",
  "1erDescanso",
  "2doDescanso"
]


let listOfMonths = language == "es-ES" ? [
"Enero",
"Febrero",
"Marzo",
"Abril",
"Mayo",
"Junio",
"Julio",
"Agosto",
"Septiembre",
"Octubre",
"Noviembre",
"Diciembre"]
:
[  "January",
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

headingElement.textContent = (language == "es-ES") ? "Turnos Laborales" : "Work scheduling";

function retrieveCurrentProgramation (programming) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  currentDay = day;
  currentMonth = month;
  currentYear = year;
  let {programmingDict, programmingLastDay} = getProgrammingPerMonth(programming);
  programmationPerMonth = programmingDict;
  programmationLastDayOfMonth = programmingLastDay;
  currentProgramation = programming;
  main(year, month, day);
  return currentProgramation;
}

/* setting a cookie for modal and messages */
function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

/* get cookie */
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/* get the css class for each day */
function getDayClass(index, day, month, year, currentMonth, currentYear, programmationPerMonth) {
  if ((day === index && currentMonth === month && currentYear === year) && (programmationPerMonth[index] == "1roDia" || programmationPerMonth[index] == "2doDia")) {
    return 'today diurnal';
  } else if ((day === index && currentMonth === month && currentYear === year) && (programmationPerMonth[index] == "1roNoche" || programmationPerMonth[index] == "2doNoche") ) {
    return 'today nocturnal';
  } else if ((day === index && currentMonth === month && currentYear === year) && (programmationPerMonth[index] == "1erDescanso" || programmationPerMonth[index] == "2doDescanso") ) {
    return 'today resting';
  } else if (programmationPerMonth[index] === "1roDia" || programmationPerMonth[index] === "2doDia") {
    return 'diurnal';
  } else if (programmationPerMonth[index] === '1roNoche' || programmationPerMonth[index] === "2doNoche") {
    return 'nocturnal';
  } else if (programmationPerMonth[index] === '1erDescanso' || programmationPerMonth[index] === '2doDescanso') {
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
    html += `<div class="day previous">${daysPrev - (i-1)}</div>`;
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
  } if(isLeap(currentYear) && currentMonth === 1) {
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
    alert("Esta acción está en desarrollo!!!, por favor vuelve a seleccionar la programación que deseas consultar.")
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
  let programmingDict = {};
  const today = new Date();
  let month = today.getMonth();
  //let startDay = month === currentMonth ? 1 : 1;
  let startDay = month === currentMonth ? (currentDay - 30) : 1;
  let totalDays = totalDaysOfMonth(currentMonth);
  let currentIndex = programming.indexOf(currentProgramation);
  let programmingLastDay = undefined;
  
  for (let i = startDay; i <= totalDays; i++) {
    programmingDict[i] = programming[currentIndex % programming.length]
    currentIndex += 1
  }
  programmingLastDay = programmingDict[totalDays]
  return {programmingDict, programmingLastDay}
}

/**
 * @param {String} lastDay programmation last day previous month
 * @returns {String | undefined} 
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
  let programmingFirstDayNextMonth = getProgrammingFirstDayOfMonth(programmationLastDayOfMonth)
  let {programmingDict, programmingLastDay} = getProgrammingPerMonth(programmingFirstDayNextMonth);
  programmationPerMonth = programmingDict
  programmationLastDayOfMonth = programmingLastDay
  main(currentYear, currentMonth, currentDay);
});

/* calling de main function when document is loaded */
selectElement.addEventListener("change", (e) => {
  if(!helpMessageWasShowed) {
    const ulElement = modalElement.querySelector('ul');
    const helpMessage = "Te recordamos que las casillas marcadas con amarillo🟨\nson los turnos diurnos, las casillas marcadas con azúl🟦\nson los turnos nocturnos y las casillas marcadas con verde🟩\ncorresponden a los dias de descanso.";
    ulElement.innerHTML = "";
    messagaElement.innerHTML = helpMessage;
    modalElement.classList.add("active");
    setCookie("messageView", true, 30);
  }
  saveToLocalStorage("programmation", e.target.value)
  retrieveCurrentProgramation(e.target.value);
  helpMessageWasShowed = true;
})

const getProgrammationFromLStorage = (key) => {
  return localStorage.getItem(key) || "1roDia";
}

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
}

// get the next midnight every day
function getNextMidNight() {
  const now = new Date();
  const nextMidNight = new Date();

  nextMidNight.setHours(24, 0, 0, 0);
  // set hour at 00:00:00
  const timeUntilNextMidNight = nextMidNight - now;
  return timeUntilNextMidNight;
}

// change the current programmation at midnight
function changeProgAtMidnight(currentValue) {
  let nextProg = getProgrammingFirstDayOfMonth(currentValue);
  selectedProgrammation = nextProg;
  saveToLocalStorage("programmation", selectedProgrammation);
  console.log(selectedProgrammation)
  
  //recalculate and program again
  const timeUntilNextMidNight = 24 * 60 * 60  * 1000; // 24 hours on miliseconds
  setTimeout(changeProgAtMidnight, timeUntilNextMidNight);
}

function startAtMidNight() {
  const timeUntilMidNight = getNextMidNight();
  console.log(selectedProgrammation)
  setTimeout(() => {
    changeProgAtMidnight(selectedProgrammation || programming[1]);
  }, timeUntilMidNight);
}

startAtMidNight();

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  currentDay = day;
  currentMonth = month;
  currentYear = year;
  selectedProgrammation = getProgrammationFromLStorage("programmation");
  selectElement.value = selectedProgrammation;
  let {programmingDict, programmingLastDay} = getProgrammingPerMonth(selectedProgrammation);
  programmationPerMonth = programmingDict;
  programmationLastDayOfMonth = programmingLastDay;
  main(year, month, day);
  startAtMidNight();
  
  let items = document.getElementById('days-name');
  let divElements = items.querySelectorAll('div');
  if(language === "es-US" || language === "es-ES") {
    let chars = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    divElements.forEach((element, index) => {
      element.textContent = chars[index];
    })
  }
  
  setTimeout(() => {
    if(!modalShowed) {
      modalElement.classList.add("active");
      setCookie("modal", true, 15);
    }
  }, 1000);
  
});


closeModalBtn.onclick = () => {
  modalElement.classList.remove("active");
}