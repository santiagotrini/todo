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
