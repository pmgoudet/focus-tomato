//! SECURITY // <script type="text/javascript" src="src/purify.js"></script>

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

// TASKS
const btnAddTask = document.querySelector('.task__add-task-btn');
const taskDescription = document.querySelector('#new-task');
const itemList = document.querySelector('.tasks-list')
let tasks = [];


/********************************************/
// ---------------- CONTEXT ------------------
/********************************************/

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


/********************************************/
// ---------------- CLOCK --------------------
/********************************************/

function formatTime(seconds) { // time format
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds
  );
};

function updateDisplay() { // actualize timer display
  display.textContent = formatTime(timer);
};

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
};

timer = duration;
updateDisplay();

startPauseBtn.addEventListener('click', startPauseTimer);


/********************************************/
// ---------------- TASKS --------------------
/********************************************/


// CREATE TASK

function createTask(task) {
  let newTask = `                        
    <button class="task__active-icon task-icon"></button>
    <div class="task__description">
    <button class="task__description-icon"></button>
    <p class="task__description-text">${task}</p>
    </div>
    <button class="task__edit-icon task-icon"></button>
    <button class="task__delete-icon task-icon"></button>
    <button class="task__ready-icon task-icon"></button>
  `;
  let li = document.createElement('li');
  li.classList.add('task');
  itemList.appendChild(li);
  li.innerHTML = newTask;
  
  tasks.push(task);
  localStorage.setItem("taskItems", JSON.stringify(tasks));
};

btnAddTask.addEventListener('click', () => {
  if (taskDescription.value != "") {
    createTask(taskDescription.value);
    taskDescription.value = "";
  }
});

function getTasks() {
  let taskItems = JSON.parse(localStorage.getItem("taskItems")) || [];
  if (taskItems.length > 0) {
    taskItems.forEach((item) => {
      createTask(item);
    })
  }
};
getTasks();


// ALL TASKS EVENT LISTENER

function deleteTask(clickedBtn) {
  console.log(clickedBtn.parentElement);
  let delText = clickedBtn.parentElement.querySelector('.task__description-text').textContent;
  let index = tasks.indexOf(delText);

  if (index !== -1) { // if index doesn't exist it returns -1
    tasks.splice(index, 1);
  }

  localStorage.setItem("taskItems", JSON.stringify(tasks));
  clickedBtn.parentElement.remove();
}

function activeTask(clickedBtn) {
  
}



itemList.addEventListener('click', (event) => {
  if (event.target.classList.contains('task__active-icon')) {
    const clickedBtn = event.target;
    activeTask(clickedBtn);
  }
  // if (event.target.classList.contains('task__edit-icon')) {
  //   const clickedBtn = event.target;
  //   editTask(clickedBtn);
  // }
  if (event.target.classList.contains('task__delete-icon')) {
    const clickedBtn = event.target;
    deleteTask(clickedBtn);
  }
  // if (event.target.classList.contains('task__ready-icon')) {
  //   const clickedBtn = event.target;
  //   readyTask(clickedBtn);
  // }
});






/*function deleteTask(event) {
  // Verifica se o clique foi em um botão com a classe 'task__delete-icon'
  if (event.target.classList.contains('task__delete-icon')) {
    // Encontra o <li> que contém o botão clicado
    const taskItem = event.target.closest('li');
    if (taskItem) {
      taskItem.remove(); // Remove o <li> do DOM
    }
  }
}*/

