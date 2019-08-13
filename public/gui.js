function getTasks() {
  fetch('http://localhost:5000/api/todos')
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    for (let item of json) {
      let li = document.createElement('li');
      document.body
    }
  })
}

getTasks();


let btn = document.getElementById('btn');



btn.onclick = function() {

};
