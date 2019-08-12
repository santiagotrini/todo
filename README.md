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
