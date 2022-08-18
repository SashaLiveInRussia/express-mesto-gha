const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const NotFoundError = require('./errors/NotFoundError');

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

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(404).send({ message: 'Переданы некорректные данные' }); // Добавлено здесь потому что дублируется везде
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  return next();
});

app.listen(PORT, () => {});
