//! SECURITY // <script type="text/javascript" src="src/purify.js"></script>
let log = console.log;

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
    startPauseBtn.innerHTML = `Start <img src="assets/img/icons/play-icon.svg" alt="Play Icon">`;
    clearInterval(interval);
    isPaused = true;

    if (item.dataset.context == 'focus') { // display clock
      display.textContent = `${focusTime.value}:00`;
      timer = focusTime.value * 60;
    } else if (item.dataset.context == 'short') {
      display.textContent = `${shortTime.value}:00`;
      timer = shortTime.value * 60;
    } else {
      display.textContent = `${longTime.value}:00`;
      timer = longTime.value * 60;
    }
  })
});
