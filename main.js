// CHANGE CONTEXT
const html = document.querySelector('html');
const contextItems = document.querySelectorAll('.context-item');

// CLOCK
const display = document.querySelector('#clock');
const startPauseBtn = document.querySelector('.start-pause-btn');
const duration = 1500;  // 60x minutes
let startAudio = new Audio('/assets/sounds/start.mp3');
let pauseAudio = new Audio('/assets/sounds/pause.mp3');
let endAudio = new Audio('/assets/sounds/end.mp3');
let timer;
let interval;
let isPaused = true;
let pomodoroCount = 0;
let ciclesBeforeLongBreak = 3;

// CHANGE CONTEXT
contextItems.forEach((item) => {
  item.addEventListener('click', () => {
    contextItems.forEach((item) => {
      item.querySelector('button').classList.remove('active');
    });
    html.setAttribute('data-context', item.dataset.context);
    item.querySelector('button').classList.add('active');
    startPauseBtn.innerHTML = `Start <img src="assets/img/icons/play-icon.svg" alt="Play Icon">`;
    clearInterval(interval);
    isPaused = true;

    if (item.dataset.context == 'focus') { // display clock
      display.textContent = '25:00';
      timer = 1500;
    } else if (item.dataset.context == 'short') {
      display.textContent = '05:00';
      timer = 300;
    } else {
      display.textContent = '15:00'
      timer = 900;
    }
  })
});

// CLOCK
function formatTime(seconds) { // time format
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds
  );
}

function updateDisplay() { // actualize timer display
  display.textContent = formatTime(timer);
}

function startPauseTimer() {
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
        endAudio.play();
        clearInterval(interval);
        pomodoroCount++;
        if (pomodoroCount < ciclesBeforeLongBreak) {
          startPauseBtn.textContent = `Good!`;
          if (html.theme == "focus" && btnControl) {
            startPauseBtn.addEventListener('click', () => {
              display.textContent = '05:00';
            });
          }
        } else {
          // AQUI O BOTÃO PRA LONG BREAK
        }
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

timer = duration;
updateDisplay();

startPauseBtn.addEventListener('click', startPauseTimer);
