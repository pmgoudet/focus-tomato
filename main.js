// CHANGE CONTEXT
const html = document.querySelector('html');
const contextItems = document.querySelectorAll('.context-item');

contextItems.forEach((item) => {
  item.addEventListener('click', () => {
    contextItems.forEach((item) => {
      item.querySelector('button').classList.remove('active');
    });
    html.setAttribute('data-context', item.dataset.context);
    item.querySelector('button').classList.add('active');
  })
})

// CLOCK

const display = document.querySelector('#clock');
const startPauseBtn = document.querySelector('.start-pause-btn');
const duration = 60;  // VOLTAR PARA 60

let timer;
let interval;
let isPaused = true;
let pomodoroCount = 0;
let ciclesBeforeLongBreak = 3;

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
    interval = setInterval(() => {
      if (timer > 0) {
        timer--;
        updateDisplay();
      } else {
        clearInterval(interval);
        pomodoroCount++;
        if (pomodoroCount < ciclesBeforeLongBreak) {
          startPauseBtn.innerHTML = `Short Break?`;
          let btnControl = true; // Play Btn Control after timer is finished
          if (btnControl) {
            startPauseBtn.addEventListener('click', () => {
              html.setAttribute('data-context', 'short');
              
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
    clearInterval(interval);
  }
}

timer = duration;
updateDisplay();

startPauseBtn.addEventListener('click', startPauseTimer);
