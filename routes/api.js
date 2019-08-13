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
