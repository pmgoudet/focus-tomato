//! SECURITY // <script type="text/javascript" src="src/purify.js"></script>
let log = console.log;

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
const itemList = document.querySelector('.tasks-list');
const completedTaskContainer = document.querySelector('.completed-tasks-container');
const completedTaskList = document.querySelector('.completed-tasks__list');
const clearBtn = document.querySelector('.completed-tasks__head__btn');
let tasks = [];
let completedTasks = [];


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
          //TODO AQUI O BOTÃO PRA LONG BREAK
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

function getTasks() { // get content from the localstorage as we load the page
  let taskItems = JSON.parse(localStorage.getItem("taskItems"));
  let completedTaskItems = JSON.parse(localStorage.getItem("completedTaskItems"));
  if (taskItems) {
    taskItems.forEach((item) => {
      createTask(item);
    })
  }
  if (completedTaskItems != null) {
    completedTaskItems.forEach((item) => {
      loadTask(item)
      completedTasks = completedTaskItems;
    })
    showCompletedTasks()
  }
  if (itemList.children.length > 0) {
    itemList.children[0].classList.add('active');
  }
};
getTasks();

function createTask(task) {
  let newTask = `                        
    <button class="task__active-icon task-icon" title="Defines the current task."></button>
    <div class="task__description">
    <button class="task__description-icon" title="Drag to reorder your tasks."></button>
    <p class="task__description-text">${task}</p>
    </div>
    <button class="task__edit-icon task-icon" title="Edit this task."></button>
    <button class="task__delete-icon task-icon" title="Delete this task."></button>
    <button class="task__ready-icon task-icon" title="Task completed"></button>
  `;
  let li = document.createElement('li');
  li.classList.add('task');
  itemList.appendChild(li);
  li.innerHTML = newTask;

  tasks.push(task);
  localStorage.setItem("taskItems", JSON.stringify(tasks));
};

function loadTask(item) {
  let newCompletedTask = `
    <button class="completed-tasks__task__recover task-icon" title="Want to recover this task?"></button>
    <div class="completed-tasks__description">
      <img class="completed-tasks__description__img"
          src="assets/img/icons/check-green-icon.svg" alt="Checked Icon Item">
      <p class="completed-tasks__description__txt">${item}</p>
    </div>
    <button class="completed-tasks__task__delete-icon task-icon" title="Delete this task permanently?"></button>
  `;

  let li = document.createElement('li');
  li.classList.add('completed-tasks__task');
  completedTaskList.appendChild(li);
  li.innerHTML = newCompletedTask;
}

function activeTask(clickedBtn) {
  let taskList = document.querySelectorAll('.task');
  taskList.forEach((task) => {
    task.classList.remove('active');
  })
  clickedBtn.parentElement.classList.add('active');
}

function editTask(clickedBtn) {
  const taskDescrip = clickedBtn.parentElement.querySelector('.task__description-text');
  const input = document.createElement('input');
  input.type = 'text';
  input.setAttribute('maxlength', '50');
  input.classList.add('input-edit');
  input.value = taskDescrip.textContent;
  taskDescrip.replaceWith(input);
  input.focus();
  let index = tasks.indexOf(taskDescrip.textContent);

  input.addEventListener('blur', () => {
    const newTaskDescrip = document.createElement('p');
    newTaskDescrip.className = 'task__description-text';
    if (input.value == "") {
      input.replaceWith(taskDescrip.textContent);
    } else {
      newTaskDescrip.textContent = input.value;
      input.replaceWith(newTaskDescrip);
      tasks[index] = newTaskDescrip.textContent;
      localStorage.setItem("taskItems", JSON.stringify(tasks));
    }
  });
}

function deleteTask(clickedBtn) {
  let delText = clickedBtn.parentElement.querySelector('.task__description-text').textContent;
  let index = tasks.indexOf(delText);

  if (index !== -1) { // if index doesn't exist it returns -1
    tasks.splice(index, 1);
  }

  localStorage.setItem("taskItems", JSON.stringify(tasks));
  clickedBtn.parentElement.remove();
}

function readyTask(clickedBtn) {
  let readyText = clickedBtn.parentElement.querySelector('.task__description-text').textContent;

  let newCompletedTask = `   
    <button class="completed-tasks__task__recover task-icon" title="Want to recover this task?"></button>
    <div class="completed-tasks__description">
      <img class="completed-tasks__description__img"
          src="assets/img/icons/check-green-icon.svg" alt="Checked Icon Item">
      <p class="completed-tasks__description__txt">${readyText}</p>
    </div>
    <button class="completed-tasks__task__delete-icon task-icon" title="Delete this task permanently?"></button>
  `;

  let li = document.createElement('li');
  li.classList.add('completed-tasks__task');
  completedTaskList.appendChild(li);
  li.innerHTML = newCompletedTask;

  completedTasks.push(readyText);
  localStorage.setItem("completedTaskItems", JSON.stringify(completedTasks));
  deleteTask(clickedBtn);
  showCompletedTasks()
}

btnAddTask.addEventListener('click', () => {
  if (taskDescription.value != "") {
    createTask(taskDescription.value);
    taskDescription.value = "";
  }
});


// ALL TASKS EVENT LISTENER

itemList.addEventListener('click', (event) => {
  if (event.target.classList.contains('task__active-icon')) {
    const clickedBtn = event.target;
    activeTask(clickedBtn);
  }
  if (event.target.classList.contains('task__edit-icon')) {
    const clickedBtn = event.target;
    editTask(clickedBtn);
  }
  if (event.target.classList.contains('task__delete-icon')) {
    const clickedBtn = event.target;
    deleteTask(clickedBtn);
  }
  if (event.target.classList.contains('task__ready-icon')) {
    const clickedBtn = event.target;
    readyTask(clickedBtn);
  }
});


//todo drag and drop


// COMPLETED TASKS

function showCompletedTasks() {
  if (completedTaskList.children.length > 0) {
    completedTaskContainer.style.display = "block";
  } else {
    completedTaskContainer.style.display = "none";
  }
}
showCompletedTasks()

function deleteCompletedTasks(task) {
  task.parentElement.remove()
  let taskDescrip = task.parentElement.querySelector('.completed-tasks__description__txt').textContent;
  index = completedTasks.indexOf(taskDescrip);
  if (index !== -1) { // if index doesn't exist it returns -1
    completedTasks.splice(index, 1);
  }
  localStorage.setItem("completedTaskItems", JSON.stringify(completedTasks));
  showCompletedTasks()
}

clearBtn.addEventListener('click', () => {
  const confirmed = confirm("Are you sure you want to delete all the completed tasks permanently?");
  if (confirmed) {
    completedTaskList.innerHTML = "";
    completedTasks = [];
    localStorage.removeItem("completedTaskItems");
    showCompletedTasks()
  };
})

completedTaskList.addEventListener('click', (event) => {
  if (event.target.classList.contains('completed-tasks__task__recover')) {
    let taskDescrip = event.target.parentElement.querySelector('.completed-tasks__description__txt').textContent;
    createTask(taskDescrip);
    deleteCompletedTasks(event.target);
  }
  if (event.target.classList.contains('completed-tasks__task__delete-icon')) {
    deleteCompletedTasks(event.target)
  }
});
