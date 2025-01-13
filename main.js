let html = document.querySelector('html');
let contextItems = document.querySelectorAll('.context-item');
let clock = document.querySelector('#clock');
let startPauseBtn = document.querySelector('.start-pause-btn');
let clockOn = false;

// CHANGE CONTEXT
contextItems.forEach((item) => {
    item.addEventListener('click', () => {
        html.setAttribute('data-context', item.dataset.context);
    })
})

// CLOCK
let timeInSeconds = 5;

const countDown = () => {
  if (timeInSeconds <= 0) {
    reset();
    return;
  }
  timeInSeconds -= 1;
  console.log("Timer:" + timeInSeconds);
};










/*


let idInterval = null;



startPauseBt.addEventListener("click", startPause);

function startPause() {
  if (idInterval) {
    reset();
    return;
  }
  idInterval = setInterval(countDown, 1000);
}

function reset() {
  clearInterval(idInterval);
  idInterval = null;
}

const countDown = () => {
  if (timeInSeconds <= 0) {
    audioTempoFinalizado.play();
    alert("Tempo finalizado");
    reset();
    return;
  }
  timeInSeconds -= 1;
  console.log("Tempo: " + timeInSeconds);
  console.log("Id: " + idInterval);
};

function startPause() {
  if (idInterval) {
    audioPausa.play();
    reset();
    return; // early return -- circuit breaker
  }



*/