const timerDisplay = document.querySelector(".display__time-left");
const timerBox = document.querySelector(".timer-display");
const endTime = document.querySelector(".display__end-time");
const checkmarks = document.querySelectorAll(".checkmarks svg");
const length = document.querySelectorAll(".length span");
const sessionDisplay = document.querySelector(".display__session");
const lengthButtons = document.querySelectorAll("[data-amt]");
const navButtons = document.querySelectorAll("nav li");
const info = document.querySelector(".info");
const saveResetBtns = document.querySelectorAll(".save-buttons button");
const settings = document.querySelector(".settings");

let countdown;
let count = 0;
let pomodoros = 0;
let isPaused = false;
let isStart = false;
let secondsLeft = 0;
let defaultTimer = true;
let session = "Focus";

function timer(seconds) {
  sessionDisplay.textContent = session;
  const now = Date.now();
  // clear any existing timers
  clearInterval(countdown);
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    secondsLeft = Math.round((then - Date.now()) / 1000);
    //check if we should stop it
    if (secondsLeft === 0) {
      clearInterval(countdown);
      defaultTimer = true;
      console.log("count: ", count);
      handleCheckmarks();
      startTimer();
    }
    // display
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;
  // sets title of page
  document.title = sessionDisplay.textContent + ": " + display;
  timerDisplay.textContent = display;
}

function displayEndTime(timeStamp) {
  const end = new Date(timeStamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Timer Ends At ${adjustedHour}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}

function handleCheckmarks() {
  if (pomodoros === 0) {
    checkmarks.forEach(check => (check.style.opacity = "0"));
  } else {
    checkmarks[pomodoros - 1].style.opacity = "1";
  }
}

function getSession() {
  if (count % 2 != 0) {
    session = "Focus";
    seconds = length[0].textContent * 60;
  } else {
    if (pomodoros < 4) {
      session = "Take a Short Break";
      seconds = length[1].textContent * 60;
    } else {
      session = "Take a Long Break";
      seconds = length[2].textContent * 60;
      pomodoros = 0;
    }
  }
}

function startTimer() {
  if ((!isStart && !isPaused) || defaultTimer) {
    count++;
    if (count % 2 !== 0) pomodoros++;
    isStart = true;
    isPaused = false;
    defaultTimer = false;
    getSession();
    timer(seconds);
  } else if (isStart && !isPaused) {
    displayTimeLeft(secondsLeft);
    clearInterval(countdown);
    sessionDisplay.textContent = "Paused";
    isStart = false;
    isPaused = true;
    defaultTimer = false;
  } else if (!isStart && isPaused) {
    isStart = true;
    isPaused = false;
    defaultTimer = false;
    timer(secondsLeft);
  }
}

function handleLength(e) {
  if (this.dataset.amt === "+1") {
    let minutes = parseInt(e.target.nextElementSibling.textContent);
    e.target.nextElementSibling.textContent = minutes + 1;
  }
  if (this.dataset.amt === "-1") {
    let minutes = parseInt(e.target.previousElementSibling.textContent);
    if (minutes != 1) e.target.previousElementSibling.textContent = minutes - 1;
  }
}

function handleNav() {
  if (this.textContent === "ℹ") {
    timerBox.style.display = "none";
    info.style.display = "block";
    this.textContent = "✖";
  } else if (this.textContent === "✖") {
    timerBox.style.display = "block";
    info.style.display = "none";
    this.textContent = "ℹ";
  } else if (this.textContent === "settings") {
    settings.style.display = "block";
    this.textContent = "done";
  } else if (this.textContent === "done") {
    settings.style.display = "none";
    this.textContent = "settings";
  }
}

function handleSave() {
  if (this.textContent === "Save") {
    localStorage.setItem("isSaved", true);
    localStorage.setItem("focusMins", length[0].textContent);
    localStorage.setItem("shortBrkMins", length[1].textContent);
    localStorage.setItem("longBrkMins", length[2].textContent);
  } else if (this.textContent === "Default") {
    length[0].textContent = 25;
    length[1].textContent = 5;
    length[2].textContent = 30;
  }

}

function loadSettings() {
  length[0].textContent = localStorage.focusMins;
  length[1].textContent = localStorage.shortBrkMins;
  length[2].textContent = localStorage.longBrkMins;
}

if(localStorage.isSaved) {
  loadSettings()
}


timerBox.addEventListener("click", startTimer);
lengthButtons.forEach(button => button.addEventListener("click", handleLength));
navButtons.forEach(button => button.addEventListener("click", handleNav));
saveResetBtns.forEach(button => button.addEventListener("click", handleSave));
