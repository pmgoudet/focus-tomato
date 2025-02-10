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
const inputValue = document.querySelectorAll(".input-settings");
let inputMemory = 0;

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

function countdown(callback) {
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
        clearInterval(interval);
        startPauseBtn.textContent = `Good!`;

        endAudio.loop = urgent.checked;
        endAudio.play();

        document.addEventListener("click", () => {
          if (!endAudio.paused) {
            endAudio.pause();
            endAudio.currentTime = 0;
          }
        });

        if (callback) callback(); // Execute next step
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

function changeTheme() {
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

function autostartOn() {
  const cycleCount = parseInt(document.querySelector("#cycle-count").value, 10);

  let currentCycle = 0;

  function startNextCycle() {
    if (currentCycle + 1 <= cycleCount * 2 - 1) {
      countdown(() => {
        // CHANGE THEME after counting ends
        const btnContext = document.querySelectorAll(".btn-context");
        let context = ["focus", "short", "long"];
        contextItems.forEach((item) => {
          item.querySelector("button").classList.remove("active");
        });
        html.setAttribute(
          "data-context",
          context[currentCycle % 2 === 0 ? 1 : 0]
        );
        btnContext[currentCycle % 2 === 0 ? 1 : 0].classList.add("active");
        startPauseBtn.innerHTML = `Start <img src="assets/img/icons/play-icon.svg" alt="Play Icon">`;
        isPaused = true;
        if (currentCycle % 2 === 0 ? 1 : 0) {
          display.textContent = `${shortTime.value}:00`;
          timer = shortTime.value * 60;
        } else {
          display.textContent = `${focusTime.value}:00`;
          timer = focusTime.value * 60;
        }

        currentCycle++;
        startNextCycle();
      });
    } else {
      const btnContext = document.querySelectorAll(".btn-context");
      contextItems.forEach((item) => {
        item.querySelector("button").classList.remove("active");
      });
      html.setAttribute("data-context", "long");
      btnContext[2].classList.add("active");
      startPauseBtn.innerHTML = `Start <img src="assets/img/icons/play-icon.svg" alt="Play Icon">`;
      countdown();
    }
  }

  startNextCycle(); // Start first cycle
}

function startPauseTimer() {
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

inputValue.forEach((input) => {
  input.addEventListener("focus", () => {
    inputMemory = input.value;
    input.value = "";
  });

  input.addEventListener("blur", () => {
    if (input.value == "") {
      input.value = inputMemory;
    }
  });
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
