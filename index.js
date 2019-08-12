const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
