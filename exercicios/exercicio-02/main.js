document.addEventListener("DOMContentLoaded", function(){
    loadTasks();
    loadTheme();
});

document.getElementById("new-task").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }
}


function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const task = { text: taskText, completed: false};
        saveTask(task);
        renderTasks(task);
        taskInput.value = "";
    }
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasks();

    tasks.forEach(task => renderTasks(task));
}

function getTasks() {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

function renderTasks(task) {
    const taskList = document.getElementById("task-list");

    const taskItem = document.createElement("li");
    taskItem.className = task.completed ? "completed" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = function() {
        task.completed = !task.completed;
        updateTask(task);
        taskItem.classList.toggle("completed");
    };

    const taskTextElement = document.createElement("span");
    taskTextElement.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.onclick = function () {
        deleteTask(task);
        taskList.removeChild(taskItem);
    };

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);    
}

function updateTask(updatedTask) {
    const tasks = getTasks();
    const index = tasks.findIndex(task => task.text === updatedTask.text);
    tasks[index] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskToDelete) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.text !== taskToDelete.text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks() {
    const filterText = document.getElementById("filter-task").value.toLowerCase();
    const tasks = document.getElementById("task-list").getElementsByTagName("li");

    Array.from(tasks).forEach(function(task) {
        const taskText = task.getElementsByTagName("span")[0].textContent.toLowerCase();
        if (taskText.includes(filterText)) {
            task.style.display = "";
        } else {
            task.style.display = "none";
        }
    });
}
