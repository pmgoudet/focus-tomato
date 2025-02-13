const btnAddTask = document.querySelector(".task__add-task-btn");
const taskDescription = document.querySelector("#new-task");
const taskList = document.querySelector(".tasks-list");
const completedTaskContainer = document.querySelector(
  ".completed-tasks-container"
);
const completedTaskList = document.querySelector(".completed-tasks__list");
const clearBtn = document.querySelector(".completed-tasks__head__btn");
let tasks = [];
let completedTasks = [];

// CREATE TASK

function getTasks() {
  // get content from the localstorage as we load the page
  let taskItems = JSON.parse(localStorage.getItem("taskItems"));
  let completedTaskItems = JSON.parse(
    localStorage.getItem("completedTaskItems")
  );
  if (taskItems) {
    taskItems.forEach((item) => {
      createTask(item);
    });
  }
  if (completedTaskItems != null) {
    completedTaskItems.forEach((item) => {
      loadTask(item);
      completedTasks = completedTaskItems;
    });
    showCompletedTasks();
  }
  if (taskList.children.length > 0) {
    taskList.children[0].classList.add("active");
  }
}
getTasks();

function createTask(task) {
  let newTask = `
    <div class="task-flex">
      <button class="task__active-icon task-icon"></button>
      <div class="task__description">
        <div class="task__description-flex">
          <button class="task__description-icon"></button>
          <p class="task__description-text">${task}</p>
        </div>
        <button class="task__menu-icon">
          <img
            class="task__menu-icon__option"
            src="assets/img/icons/options-icon.svg"
            alt="Options Icon"
          />
        </button>
      </div>
    </div>
    <div class="task__menu inactive">
      <button class="task__edit-icon task-icon"></button>
      <button class="task__delete-icon task-icon"></button>
      <button class="task__ready-icon task-icon"></button>
    </div>
    `;
  let li = document.createElement("li");
  li.setAttribute("draggable", "true");
  li.classList.add("task");
  taskList.appendChild(li);
  li.innerHTML = newTask;

  tasks.push(task);
  localStorage.setItem("taskItems", JSON.stringify(tasks));
}

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

  let li = document.createElement("li");
  li.classList.add("completed-tasks__task");
  completedTaskList.appendChild(li);
  li.innerHTML = newCompletedTask;
}

function activeTask(clickedBtn) {
  let taskList = document.querySelectorAll(".task");
  taskList.forEach((task) => {
    task.classList.remove("active");
  });
  clickedBtn.parentElement.parentElement.classList.add("active");
}

function editTask(clickedBtn) {
  const taskDescrip = clickedBtn.parentElement.parentElement.querySelector(
    ".task__description-text"
  );
  const input = document.createElement("input");
  input.type = "text";
  input.setAttribute("maxlength", "50");
  input.classList.add("input-edit");
  input.value = taskDescrip.textContent;
  taskDescrip.replaceWith(input);
  input.focus();
  let index = tasks.indexOf(taskDescrip.textContent);

  input.addEventListener("blur", () => {
    const newTaskDescrip = document.createElement("p");
    newTaskDescrip.className = "task__description-text";
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
  let delText = clickedBtn.parentElement.parentElement.querySelector(
    ".task__description-text"
  ).textContent; //!avoid .parentElement.parentElement
  let index = tasks.indexOf(delText);

  if (index !== -1) {
    // if index doesn't exist it returns -1
    tasks.splice(index, 1);
  }

  localStorage.setItem("taskItems", JSON.stringify(tasks));
  clickedBtn.parentElement.parentElement.remove();
}

function readyTask(clickedBtn) {
  let readyText = clickedBtn.parentElement.parentElement.querySelector(
    ".task__description-text"
  ).textContent;

  let newCompletedTask = `
      <button class="completed-tasks__task__recover task-icon" title="Want to recover this task?"></button>
      <div class="completed-tasks__description">
        <img class="completed-tasks__description__img"
            src="assets/img/icons/check-green-icon.svg" alt="Checked Icon Item">
        <p class="completed-tasks__description__txt">${readyText}</p>
      </div>
      <button class="completed-tasks__task__delete-icon task-icon" title="Delete this task permanently?"></button>
    `;

  let li = document.createElement("li");
  li.classList.add("completed-tasks__task");
  completedTaskList.appendChild(li);
  li.innerHTML = newCompletedTask;

  completedTasks.push(readyText);
  localStorage.setItem("completedTaskItems", JSON.stringify(completedTasks));
  deleteTask(clickedBtn);
  showCompletedTasks();
}

btnAddTask.addEventListener("click", () => {
  if (taskDescription.value != "") {
    createTask(taskDescription.value);
    taskDescription.value = "";
  }
});

function editTaskBtn(event) {
  const taskMenuAll = document.querySelectorAll(".task__menu");
  const clickedBtn = event.target.closest(".task").querySelector(".task__menu");

  if (clickedBtn.style.display == "flex") {
    taskMenuAll.forEach((task) => {
      task.style.display = "none";
    });
  } else {
    taskMenuAll.forEach((task) => {
      task.style.display = "none";
    });
    clickedBtn.style.display = "flex";
  }
}

// ALL TASKS EVENT LISTENER

taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("task__active-icon")) {
    const clickedBtn = event.target;
    activeTask(clickedBtn);
  }
  if (event.target.classList.contains("task__edit-icon")) {
    const clickedBtn = event.target;
    editTask(clickedBtn);
  }
  if (event.target.classList.contains("task__delete-icon")) {
    const clickedBtn = event.target;
    deleteTask(clickedBtn);
  }
  if (event.target.classList.contains("task__ready-icon")) {
    const clickedBtn = event.target;
    readyTask(clickedBtn);
  }
  if (
    event.target.classList.contains("task__menu-icon__option") ||
    event.target.classList.contains("task__description") ||
    event.target.classList.contains("task__description-text")
  ) {
    editTaskBtn(event);
  }
});

//DRAG AND DROP

document.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
  reorderTasks();
});

taskList.addEventListener("dragover", (e) => {
  e.preventDefault(); // Allow drop
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(taskList, e.clientY);

  if (afterElement == null) {
    taskList.appendChild(dragging); // Inserts <li> in the end
  } else {
    taskList.insertBefore(dragging, afterElement); // Inserts before found element
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function reorderTasks() {
  let newTasks = document.querySelectorAll(".task");
  let newTasksArray = [];
  newTasks.forEach((task) => {
    newTasksArray.push(
      task.querySelector(".task__description-text").textContent
    );
  });
  tasks = newTasksArray;
  localStorage.setItem("taskItems", JSON.stringify(tasks));
}

// COMPLETED TASKS

function showCompletedTasks() {
  if (completedTaskList.children.length > 0) {
    completedTaskContainer.style.display = "block";
  } else {
    completedTaskContainer.style.display = "none";
  }
}
showCompletedTasks();

function deleteCompletedTasks(task) {
  task.parentElement.remove();
  let taskDescrip = task.parentElement.querySelector(
    ".completed-tasks__description__txt"
  ).textContent;
  index = completedTasks.indexOf(taskDescrip);
  if (index !== -1) {
    // if index doesn't exist it returns -1
    completedTasks.splice(index, 1);
  }
  localStorage.setItem("completedTaskItems", JSON.stringify(completedTasks));
  showCompletedTasks();
}

clearBtn.addEventListener("click", () => {
  const confirmed = confirm(
    "Are you sure you want to delete all the completed tasks permanently?"
  );
  if (confirmed) {
    completedTaskList.innerHTML = "";
    completedTasks = [];
    localStorage.removeItem("completedTaskItems");
    showCompletedTasks();
  }
});

completedTaskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("completed-tasks__task__recover")) {
    let taskDescrip = event.target.parentElement.querySelector(
      ".completed-tasks__description__txt"
    ).textContent;
    createTask(taskDescrip);
    deleteCompletedTasks(event.target);
  }
  if (event.target.classList.contains("completed-tasks__task__delete-icon")) {
    deleteCompletedTasks(event.target);
  }
});
