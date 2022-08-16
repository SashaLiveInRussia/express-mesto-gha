const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');
const { errors } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;

const logger = (req, res, next) => {
  next();
};

app.use(bodyParser.json());
app.use(logger);
app.use(router);
app.use(errors());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
