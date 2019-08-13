function getTasks() {
  fetch('http://localhost:5000/api/todos')
  .then(res => res.json())
  .then((json) => {
    // console.log(json);
    for (let item of json) {
      let li = document.createElement('li');
      document.getElementById('list').appendChild(li)
      let check = document.createElement('input');
      check.type = 'checkbox';
      li.innerHTML = item.description;
      li.appendChild(check);
    }
  });
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
    let li = document.createElement('li');
    document.getElementById('list').appendChild(li)
    let check = document.createElement('input');
    check.type = 'checkbox';
    li.innerHTML = json.description;
    li.appendChild(check);
    document.getElementById('input').value = '';
  });
};
