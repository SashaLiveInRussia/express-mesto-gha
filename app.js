const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();
const { PORT = 3000 } = process.env;

const logger = (req, res, next) => {
  next();
};

app.use((req, res, next) => {
  req.user = {
    _id: '62e650c2c1813a3fc8584c2f',
  };

  next();
});

app.use(bodyParser.json());
app.use(logger);
app.use(router);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
});
