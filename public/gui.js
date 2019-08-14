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
  document.getElementById('form').appendChild(br);
}

function getTasks() {
  fetch('http://localhost:5000/api/todos')
  .then(res => res.json())
  .then((json) => {
    // console.log(json);
    for (let item of json) {
      addTask(item);
    }
    getCheckboxes();
  });
}

function getCheckboxes() {
  let checkboxes = document.querySelectorAll('input[type=checkbox]');
  // console.log(checkboxes);
}

getTasks();


let btn = document.getElementById('btn');

btn.onclick = function() {
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
  getCheckboxes();
};
