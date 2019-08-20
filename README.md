# TODO List

Una app de una lista de tareas es el ejemplo clásico en desarrollo web para mostrar un CRUD (_Create Read Update Delete_) sobre una base de datos.

Este ejemplo demuestra el uso de NodeJS + ExpressJS + MongoDB del lado del servidor (_backend_). Para el _frontend_ no usamos ningun framework o libreria. Solo HTML, CSS y JavaScript, pero usando funciones para manipular el DOM que son soportadas por la mayoria de los navegadores.

Pueden clonar el repositorio y ejecutar el ejemplo localmente:

```
$ git clone https://github.com/santiagotrini/todo.git
$ cd todo
$ npm install
$ npm run dev
```

O pueden intentar replicar el proyecto desde cero siguiendo las instrucciones que dejo a continuación.

## Iniciar el proyecto

En Bash

```
$ mkdir todo
$ atom todo
$ cd todo
$ git init
$ npm init -y
$ npm install express mongoose body-parser
$ touch index.js
$ touch Procfile
$ touch .gitignore
$ echo node_modules > .gitignore
$ npm install -D nodemon
```

Aca estamos haciendo tres cosas. Creamos una carpeta y con `npm init` declaramos esa carpeta como un proyecto de Node (creando un `package.json`). Instalamos los paquetes de Node necesarios. Express para desarrollar la API, Mongoose para comunicarnos con MongoDB y Body Parser para poder _parsear_ JSON. Tambien creamos el archivo que sera el punto de entrada de la app: `index.js`. Por ultimo agregamos `nodemon` como dependencia de desarrollo para no tener que restartear nuestro server a cada cambio en el codigo.

Le decimos a Git que trate a la carpeta como un repositorio y en `.gitignore` le pedimos que no _trackee_ la carpeta `node_modules`.

Creamos un archivo `Procfile` para cuando subamos la app a Heroku (el hosting).

En Atom

En `package.json` agregamos los scripts con los que ejecutamos nuestra app.

```json
{
  "name": "todo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",   
    "start": "node index.js",
    "dev": "nodemon index.js",
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "mongoose": "^5.6.9"
  },
  "devDependencies": {
    "nodemon": "^1.19.1"
  }
}
```

## Hola mundo

En `index.js` escribimos algo asi como un Hola Mundo de Express. El codigo minimo para ver si todo marcha bien.

```js
const express = require('express');

const port = process.env.PORT || 5000;

const app = express();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Testeamos,

```
$ npm start
```

Si vamos en el navegador a http://localhost:5000 nos da `Cannot GET /`. Todo va bien.

## Agregamos algo de contenido

En Bash hacemos una carpeta `public`, donde podemos servir archivos HTML o lo que querramos.

```
$ mkdir public
$ cd public
$ touch index.html
```

Armamos una interfaz de usuario re pava en el HTML.

En `public/index.html`

```html
<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>TODO List</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Montserrat|Lato&display=swap" rel="stylesheet">

    <!-- Font Awesome 4.7 -->
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">

    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <h1>Lista de tareas</h1>
    <form id="form">
      <input id="input" type="text" name="todo" value="">
      <button id="btn" type="button" name="button">Agregar</button><br>
      <br>

    </form>
    <script type="text/javascript" src="gui.js"></script>
  </body>
</html>
```

Para poder ver nuestra UI (_user interface_), en `index.js` agregamos `express.static()`. Como argumento le damos la carpeta desde donde servimos archivos estáticos.

```js
const express = require('express');

const port = process.env.PORT || 5000;

const app = express();

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Testeamos usando `nodemon` esta vez

```
$ npm run dev
```

Deberiamos ver nuestra UI en http://localhost:5000.

## Primer deploy

Vamos a ver si esto funciona desde la Internet en un hosting. Para eso usamos Heroku (http://heroku.com), nos hacemos una cuenta e instalamos la CLI de Heroku. En Manjaro y otros derivados de Arch Linux podemos instalarla asi:

```
$ yay -S heroku-cli
```

Para Heroku lo que hosteamos en su plataforma es una rama de nuestro repositorio, asi que primero commiteamos que todavia no lo hicimos. Y despues en tres simples pasos con la CLI de Heroku hacemos nuestro primer deploy.

```
$ git add .
$ git commit -m "primer commit"
$ heroku login
$ heroku create nombre-de-la-app
$ git push heroku master
$ heroku open
```

Deberiamos ver en el navegador nuestra app pero ahora ya disponible en Internet para cualquiera.

## MongoDB y Mongoose

Ahora si, le mandamos conexion a una base de datos, cosa de tener almacenamiento permanente de las tareas. Modificamos `index.js` y agregamos el codigo minimo para conectarnos a una base de datos.

```js
const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const mongoURI = 'mongodb://localhost/todo_api'

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("DB connected");
  })
  .catch(err => console.error(`Connection error ${err}`));

const app = express();

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Fijense que agregamos la libreria Mongoose, y que nos estamos conectando a una base de datos de MongoDB en la misma computadora. Asi que si no tienen MongoDB instalado y ejecutandose lo pueden hacer asi.

```
$ yay -S mongodb-bin
$ systemctl start mongodb
```

Despues de ejecutar `npm start` deberiamos ver _DB Connected_.

## Modelo ~~Vista~~ Controlador

Vamos a darle una onda MVC a la app. No vamos a usar vistas para no agregar mas temas, aunque nos haria la vida mas facil. Express se presta muy bien a esta forma de estructurar una app, pero tampoco te limita, podemos armar nuestro codigo como querramos, pero MVC es una opcion popular.

Hacemos tres carpetas: modelos, controladores y rutas. Declaramos todas las rutas en un archivo separado. Asi tenemos todos los endpoints de la API REST juntos.

```
$ mkdir models
$ mkdir controllers
$ mkdir routes
$ cd routes
$ touch api.js
```

En `routes/api.js` usamos el objeto Router de Express para especificar todas las rutas de nuestra API (las URLs que sirven para hacer algo segun que metodo HTTP usemos). Basicamente es el CRUD del que les hable al principio. Las funciones que se ejecutan al acceder a estas rutas van a estar en el/los controladores. Los metodos HTTP (o verbos) que se suelen usar en una API REST son POST, GET, PUT, DELETE (para crear, leer, actualizar y borrar en ese orden). Para GET tenemos dos rutas, una para traer todas las tareas `/todos` y otra para una sola tarea `/todo/:id`. Si ponemos dos puntos adelante de id podemos tener el valor del id luego en el objeto `req.params`.

```js
const express = require("express");
const router = express.Router();

const todo = require('../controllers/todo');

// rutas para las tareas
// todos las tareas
router.get('/todos', todo.all);
// una sola tarea (por id)
router.get('/todo/:id', todo.one);
// crear tarea
router.post('/todo', todo.save);
// modificar tarea
router.put('/todo/:id', todo.update);
// borrar tarea
router.delete('/todo/:id', todo.delete);

module.exports = router;

```

Con eso terminamos nuestro archivo `routes/api.js`

Ahora los controladores. Aca usamos las funciones que nos da Mongoose para realizar las queries a nuestra base de datos. Primero importamos nuestro modelo (que todavia no hicimos) y exportamos cada una de las funciones que llamamos en nuestras rutas. Todas las funciones llevan tres parametros: `(req, res, next)`. Esta es la manera tipica de laburar en Express. En `controllers/todo.js`

```js
const Todo = require('../models/Todo');

// GET /api/todos
exports.all = (req, res, next) => {
  Todo.find().exec((err, json) => {
    if (err) return next(err);
    res.json(json);
  });
};

// GET /api/todo/id
exports.one = (req, res, next) => {
  Todo.findById(req.params.id).exec((err, json) => {
    if (err) return next(err);
    res.json(json);
  });
};

// POST /api/todo
exports.save = (req, res, next) => {
  const todo = new Todo({
    description: req.body.description,
    done: req.body.done
  });
  todo.save(err => {
    if (err) return next(err);
    res.json(todo);
  });
};

// DELETE /api/todo/id
exports.delete = (req, res, next) => {
  Todo.findByIdAndRemove(req.params.id).exec((err, json) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
};

// PUT /api/todo/id
exports.update = (req, res, next) => {
  Todo.findByIdAndUpdate(req.params.id, {done: req.body.done}, (err, json) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
};
```

Notemos algunas cosas. Usamos `req.params.id` en las funciones para tomar el id de una tarea que aparece en la URL. Todas las funciones terminan llamando a una funcion del objeto _response_ (respuesta). Las funciones de GET y POST devuelven una o varias tareas, siempre en formato JSON, que es la idea de una API REST, realizamos operaciones por medio de peticiones HTTP a distintas URLs y devolvemos si es necesario objetos de JavaScript en formato JSON. Como las funciones de actualizar y borrar no devuelven la tarea hay que terminar el ciclo peticion / respuesta con un `res.sendStatus(200)`. El codigo 200 es el codigo que indica que todo salio bien en HTTP. Las funciones de PUT y POST usan el cuerpo de la peticion (_body_) para llevar JSON, ahi van los datos a cargar o modificar en la base de datos. En cada funcion usamos un objeto _Todo_. Ese es nuestro modelo, que va definido en la carpeta `models`. Hacemos eso a continuacion.

Creamos el modelo para una tarea, en `models/Todo.js`. Se definen los datos que guarda una tarea: descripcion y si esta hecha o no. El id es automatico y funciona similar a una clave primaria en SQL, siempre esta en un atributo llamado `_id`. Al final exportamos el modelo para poder usarlo en nuestro controlador.

```js
const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Todo", TodoSchema);
```

## Juntando todo

Nuestra API esta terminada, la usamos en nuestra app agregandola a `index.js`. Con `app.use` le decimos que las rutas definidas en `api.js` van precedidas por un `/api`. Asi que las URLs absolutas de nuestra API van a ser http://localhost:5000/api/todos por ejemplo para mostrar todas las tareas.

```js
const router = require('./routes/api');

app.use('/api', router)
```

Testeamos las rutas, metemos un par de tareas usando cURL, una herramienta de linea de comandos para hacer peticiones HTTP.

```
$ curl -d '{"description":"Pasear al perro"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/todo
$ curl -d '{"description":"Lavar la ropa"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/todo
$ curl -d '{"description":"Hacer la tarea"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/todo
```

En el navegador podemos ver las tareas que cargamos a la DB usando la API

http://localhost:5000/api/todos

Con esto terminamos el _backend_ por ahora. Podemos convencernos de que todas las rutas hacen lo que deberian testeandolas con el Postman (`yay -S postman`).

## Ahora el frontend

Lo unico que falta es terminar nuestra interfaz de usuario, por ahora estatica. Tenemos que darle funcionalidad a los botones, y eso lo hacemos con JavaScript y utilizando las rutas de nuestra API para operar sobre la base de datos.

Como la idea es no utilizar librerias voy a hacer uso del metodo `fetch()` para traer los datos de la DB.

Con los datos que me vienen en JSON simplemente los convertimos a objetos de JavaScript y manipulamos el DOM (Document Object Model) para ir armando nuestra lista de tareas.

Usamos el archivo `gui.js` para la logica de la interfaz de usuario, que es basicamente que se ejecuta cuando hago click en los distintos elementos.

No es la unica forma de resolver el problema, nomas la primera que se me ocurrio.

Bueno en `gui.js` ponemos el siguiente codigo

```js
let checkboxes = [];
let deleteIcons = [];
let btn = document.getElementById('btn');
btn.onclick = saveTask;
fetchTasks();
```

La logica es la siguiente. Tenemos tres variables globales. Un array para guardar todas las _checkboxes_, otro para todos los iconos para borrar tareas y una variable para el boton de agregar tarea. Luego llamamos a la funcion `fetchTasks()` que hace una consulta a `http://localhost:5000/api/todos` y arma la lista con las tareas que estan en la DB.

Para eso necesitamos varias funciones ademas de `fetchTasks()`.

- `addTask(task)`
- `saveTask()`
- `updateTask(element)`
- `deleteTask(element)`
- `getCheckboxes()`
- `getIcons()`

Las dos ultimas son las que cargan los arrays globales de checkboxes e iconos y le asignan la funcion correspondiente al atributo `onclick`.

La primer funcion `addTask(task)` solo agrega tareas a la lista en la interfaz.

Las tres restantes realizan las peticiones HTTP del tipo POST, PUT y DELETE.

Las funciones son las siguientes:

```js
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
```

La funcion `fetch()` usa algo llamado promesas (_promises_) y se utiliza de la siguiente manera.
Cuando llamamos a `fetch` y le damos una URL como argumento la funcion nos devuelve una "promesa". Cuando esa promesa se resuelve (nos llegan los datos de la DB) se ejecuta una funcion _callback_ que es el argumento del `.then()`. Si esa _callback_ devuelve otra promesa entonces se puede encadenar otra funcion con `.then()`. Esto sirve para ejecutar el codigo que usa el resultado de la query a la base de datos recien cuando  tenemos la respuesta de esa query disponible.
