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

En `routes/api.js` usamos el objeto Router de Express para especificar todas las rutas de nuestra API (las URLs que sirven para hacer algo segun que metodo HTTP usemos). Basicamente es el CRUD del que les hable al principio. Las funciones que se ejecutan al acceder a estas rutas van a estar en el/los controladores.

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

En `controllers/todo.js`

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
```

Creamos el modelo para una tarea, en `models/Todo.js`

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

Agregamos las rutas a la app en `index.js`

```js
const router = require('./routes/api');

app.use('/api', router)
```

Testeamos las rutas, metemos un par de tareas usando cURL

```
$ curl -d '{"description":"Pasear al perro"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/todo
$ curl -d '{"description":"Lavar la ropa"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/todo
$ curl -d '{"description":"Hacer la tarea"}' -H "Content-Type: application/json" -X POST http://localhost:5000/api/todo
```

En el navegador podemos ver las tareas que cargamos a la DB usando la API

http://localhost:5000/api/todos
