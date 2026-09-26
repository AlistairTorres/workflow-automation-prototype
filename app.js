const STORAGE_KEY = "workflow-board.tasks";
const STATUSES = ["todo", "inprogress", "done"];

let tasks = loadTasks();
let draggedTaskId = null;

const form = document.querySelector("#taskForm");
const input = document.querySelector("#newTask");
const statusMessage = document.querySelector("#statusMessage");

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter((task) => task && task.id && task.title && STATUSES.includes(task.status))
      : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function announce(message) {
  statusMessage.textContent = message;
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ||
    "task-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function render() {
  document.querySelectorAll(".task-list").forEach((list) => list.replaceChildren());

  tasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = "task-card";
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.tabIndex = 0;

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const advance = document.createElement("button");
    advance.type = "button";
    advance.className = "text-button";
    advance.dataset.action = "advance";
    advance.textContent = nextStatus(task.status) ? "Move on" : "Reopen";
    advance.setAttribute("aria-label", advance.textContent + " " + task.title);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "text-button danger";
    remove.dataset.action = "remove";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove " + task.title);

    actions.append(advance, remove);
    card.append(title, actions);
    document.querySelector("#" + task.status).append(card);
  });

  STATUSES.forEach((status) => {
    document.querySelector("[data-count='" + status + "']").textContent =
      tasks.filter((task) => task.status === status).length;
  });
}

function nextStatus(status) {
  const index = STATUSES.indexOf(status);
  return STATUSES[index + 1] || null;
}

function addTask(title) {
  tasks.push({ id: createId(), title, status: "todo" });
  saveTasks();
  render();
  announce("Added “" + title + "” to To do.");
}

function moveTask(id, status) {
  const task = tasks.find((item) => item.id === id);
  if (!task || !STATUSES.includes(status)) return;
  task.status = status;
  saveTasks();
  render();
  announce("Moved “" + task.title + "” to " + status.replace("inprogress", "In progress") + ".");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  addTask(title);
  form.reset();
  input.focus();
});

document.querySelector(".board").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const card = button.closest("[data-task-id]");
  const task = tasks.find((item) => item.id === card.dataset.taskId);
  if (!task) return;

  if (button.dataset.action === "remove") {
    tasks = tasks.filter((item) => item.id !== task.id);
    saveTasks();
    render();
    announce("Removed “" + task.title + "”.");
  } else {
    moveTask(task.id, nextStatus(task.status) || "todo");
  }
});

document.querySelectorAll(".column").forEach((column) => {
  column.addEventListener("dragover", (event) => event.preventDefault());
  column.addEventListener("drop", (event) => {
    event.preventDefault();
    const list = event.target.closest(".task-list");
    if (draggedTaskId && list) moveTask(draggedTaskId, column.dataset.status);
  });
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-task-id]");
  if (!card) return;
  draggedTaskId = card.dataset.taskId;
  card.classList.add("is-dragging");
});

document.addEventListener("dragend", (event) => {
  event.target.closest("[data-task-id]")?.classList.remove("is-dragging");
  draggedTaskId = null;
});

render();
