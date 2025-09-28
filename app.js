let taskId = 0;

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const task = document.getElementById(data);
  ev.target.closest(".task-list").appendChild(task);
}

function addTask() {
  const input = document.getElementById("newTask");
  const taskText = input.value.trim();
  if (!taskText) return;

  const task = document.createElement("div");
  task.className = "task";
  task.id = `task-${taskId++}`;
  task.draggable = true;
  task.ondragstart = drag;
  task.textContent = taskText;

  document.getElementById("todo").appendChild(task);
  input.value = "";
}
