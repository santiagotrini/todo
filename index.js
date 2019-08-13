const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/api');

const port = process.env.PORT || 3000;
// const mongoURI = 'mongodb://santiago:todo1234@ds261817.mlab.com:61817/todo_api';
const mongoURI = 'mongodb://localhost/todo_api'

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("DB connected");
  })
.catch(err => console.error(`Connection error ${err}`));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router)

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
