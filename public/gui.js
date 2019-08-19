// script para manejar la interfaz de usuario //

let checkboxes = [];
let deleteIcons = [];
let btn = document.getElementById('btn');
btn.onclick = saveTask;
fetchTasks();

// -- helper functions -- //

function fetchTasks() {
  fetch('http://localhost:5000/api/todos')
  .then(res => res.json())
  .then(json => {
    // console.log(json);
    for (let item of json) {
      addTask(item);
    }
    getCheckboxes();
    getIcons();
  });
}

function addTask(task) {
  let label = document.createElement('label');
  let check = document.createElement('input');
  check.type = 'checkbox';
  check.id = task._id;
  label.htmlFor = task._id;
  label.innerHTML = task.description;
  document.getElementById('form').appendChild(check);
  document.getElementById('form').appendChild(label)
  let br = document.createElement('br');
  if (task.done) {
    check.checked = true;
    let icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash');
    icon.id = task._id;
    label.append(icon);
  }
  document.getElementById('form').appendChild(br);
  getCheckboxes();
}

function saveTask() {
  const data = {};
  data.description = document.getElementById('input').value;
  const url = 'http://localhost:5000/api/todo'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch(url, options)
  .then(res => res.json())
  .then(json => {
    addTask(json);
    document.getElementById('input').value = '';
  });
}

function getCheckboxes() {
  checkboxes = document.querySelectorAll('input[type=checkbox]');
  for (let cb of checkboxes) {
    cb.onclick = updateTask;
  }
}

function getIcons() {
  deleteIcons = document.querySelectorAll('i');
  for (let i of deleteIcons) {
    i.onclick = deleteTask;
  }
}

function updateTask(element) {
  const data = {};
  if (element.target.checked)
    data.done = true;
  else
    data.done = false;
  const url = 'http://localhost:5000/api/todo/' + element.target.id;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch(url, options);
  let labels = document.getElementsByTagName('label');
  for (let label of labels) {
    if (label.htmlFor == element.target.id) {
      if (element.target.checked) {
        let icon = document.createElement('i');
        icon.classList.add('fas', 'fa-trash');
        icon.id = element.target.id;
        label.append(icon);
      }
      else {
        label.removeChild(label.lastElementChild);
      }
    }
  }
  getIcons();
}

function deleteTask(element) {
  const url = 'http://localhost:5000/api/todo/' + element.target.id;
  const options = {
    method: 'DELETE'
  };
  fetch(url, options)
  .then(() => {
    for (let cb of checkboxes) {
      if (cb.id == element.target.id) {
        cb.remove();
      }
    }
    let labels = document.getElementsByTagName('label');
    for (let label of labels) {
      if (label.htmlFor == element.target.id) {
        label.remove();
      }
    }
    getCheckboxes();
    getIcons();
  });
}
