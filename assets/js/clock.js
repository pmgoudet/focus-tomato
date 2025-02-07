// CLOCK
const display = document.querySelector("#clock");
const startPauseBtn = document.querySelector(".start-pause-btn");
const duration = 1500; // 60x minutes
const urgent = document.querySelector("#urgent");
let startAudio = new Audio("/assets/sounds/start.mp3");
let pauseAudio = new Audio("/assets/sounds/pause.mp3");
let endAudio = new Audio("/assets/sounds/end.mp3");
let timer;
let interval;
let isPaused = true;
let pomodoroCount = 0;
let ciclesBeforeLongBreak = 3;

// SETTINGS
const settingsBtn = document.querySelector(".clock-settings-btn");
const clockContainer = document.querySelector(".clock-container");
const settingsContainer = document.querySelector(".settings_overlay");
const saveBtn = document.querySelector(".btn-save");
const cancelBtn = document.querySelector(".btn-cancel");
const focusTime = document.querySelector("#focus-time");
const shortTime = document.querySelector("#short-break");
const longTime = document.querySelector("#long-break");

function formatTime(seconds) {
  // time format
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (remainingSeconds < 10 ? "0" : "") +
    remainingSeconds
  );
}

function updateDisplay() {
  // actualize timer display
  display.textContent = formatTime(timer);
}

function countdown() {
  if (isPaused) {
    // Start timer
    isPaused = false;
    startPauseBtn.innerHTML = `Pause <img src="assets/img/icons/pause-icon.svg" alt="Pause Icon">`;
    startAudio.play();
    interval = setInterval(() => {
      if (timer > 0) {
        timer--;
        updateDisplay();
      } else {
        if (urgent.checked) {
          endAudio.loop = true;
        } else {
          endAudio.loop = false;
        }
        endAudio.play();
        document.addEventListener("click", () => {
          if (!endAudio.paused) {
            endAudio.pause();
            endAudio.currentTime = 0;
          }
        });
        clearInterval(interval);
        startPauseBtn.textContent = `Good!`;
      }
    }, 1000);
  } else {
    // Pause timer
    isPaused = true;
    startPauseBtn.innerHTML = `Start <img src="assets/img/icons/play-icon.svg" alt="Play Icon">`;
    pauseAudio.play();
    clearInterval(interval);
  }
}

function autostartOn() {
  const cycleCount = document.querySelector("#cycle-count").value;
  for (let i = 0; i < cycleCount.length; i++) {
    countdown();

    // CHANGE THEME
    const btnContext = document.querySelectorAll(".btn-context");
    contextItems.forEach((item) => {
      item.querySelector("button").classList.remove("active");
    });
    html.setAttribute("data-context", "short");
    btnContext[1].querySelector("button").classList.add("active");
    startPauseBtn.innerHTML = `Start <img src="assets/img/icons/play-icon.svg" alt="Play Icon">`;
    clearInterval(interval);
    isPaused = true;
    display.textContent = `${shortTime.value}:00`;
    timer = shortTime.value * 60;
  }
}

function startPauseTimer() {
  //TODO isso aqui tudo ////////////////////////////////
  const autoStart = document.querySelector("#autostart");
  if (!autoStart.checked) {
    countdown();
  } else {
    autostartOn();
  }
}

timer = duration;
updateDisplay();

startPauseBtn.addEventListener("click", startPauseTimer);

// SETTINGS

settingsBtn.addEventListener("click", () => {
  clockContainer.style.opacity = "0";
  settingsContainer.style.display = "block";
});

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clockContainer.style.opacity = "1";
  settingsContainer.style.display = "none";
  if (html.dataset.context == "focus") {
    // display clock
    display.textContent = `${focusTime.value}:00`;
    timer = focusTime.value * 60;
  } else if (html.dataset.context == "short") {
    display.textContent = `${shortTime.value}:00`;
    timer = shortTime.value * 60;
  } else {
    display.textContent = `${longTime.value}:00`;
    timer = longTime.value * 60;
  }
  updateDisplay();
});

cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clockContainer.style.opacity = "1";
  settingsContainer.style.display = "none";

  focusTime.value = 25;
  shortTime.value = 5;
  longTime.value = 15;
});
