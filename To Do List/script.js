const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

// Theme loading and toggle
document.addEventListener('DOMContentLoaded', () => {
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
    themeLabel.textContent = 'Dark Mode';
  } else {
    document.body.classList.remove('dark');
    themeToggle.checked = false;
    themeLabel.textContent = 'Light Mode';
  }
  loadTodos();
});

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    themeLabel.textContent = 'Dark Mode';
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    themeLabel.textContent = 'Light Mode';
  }
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const task = input.value.trim();
  if (task) {
    addTodo(task);
    saveTodo(task);
    input.value = '';
  }
});

function addTodo(task, completed = false) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (completed ? ' completed' : '');

  const span = document.createElement('span');
  span.className = 'task';
  span.textContent = task;
  span.addEventListener('click', function() {
    li.classList.toggle('completed');
    updateStorage();
  });

  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.textContent = 'Delete';
  btn.addEventListener('click', function() {
    li.remove();
    updateStorage();
  });

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}

function saveTodo(task) {
  const todos = getTodos();
  todos.push({ task, completed: false });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todos = getTodos();
  todos.forEach(item => addTodo(item.task, item.completed));
}

function updateStorage() {
  const items = document.querySelectorAll('.todo-item');
  const todos = [];
  items.forEach(li => {
    todos.push({
      task: li.querySelector('.task').textContent,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}