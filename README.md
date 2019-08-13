# TODO List

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

En Atom

En `package.json` agregar scripts.

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

En `index.js`

```js
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Testeamos,

```
$ npm start
```

Nos da `Cannot GET /`.

En Bash

```
$ mkdir public
$ cd public
$ touch index.html
```

En `public/index.html`

```html
<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>TODO List</title>
  </head>
  <body>
    <h1>Lista de tareas</h1>
    <form class="" action="index.html" method="post">
      <input type="text" name="todo" value="">
      <button type="button" name="button">Agregar</button>
      <ul>

      </ul>
    </form>
  </body>
</html>
```
En `index.js` agregamos `express.static()`

```js
const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

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

Hacemos el primer commit y el deploy a Heroku

```
$ git add .
$ git commit -m "primer commit"
$ heroku login
$ heroku create nombre-de-la-app
$ git push heroku master
$ heroku open
```
Ahora la conexion con la base de datos

```js
const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const mongoURI = 'mongodb://santiago:todo1234@ds261817.mlab.com:61817/todo_api';

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

Vamos a darle una onda MVC a la app, asi que hacemos carpetas para rutas, modelos y controladores.

Ahora declaramos las rutas en un archivo separado. Asi tenemos todos los endpoints de la API juntos.

```
$ mkdir models
$ mkdir controllers
$ mkdir routes
$ cd routes
$ touch api.js
```

En `routes/api.js`

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
$ curl -d '{"description":"Pasear al perro"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/todo
$ curl -d '{"description":"Lavar la ropa"}' -H "Content-Type: application/json" -X POST http://localhost:3000/api/todo
```

En el navegador podemos ver las tareas que cargamos a la DB usando la API

http://localhost:3000/api/todos 
