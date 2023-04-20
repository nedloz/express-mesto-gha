const express = require('express');
const mongoose = require('mongoose');
const http2 = require('node:http2');
const usersRouter = require('./routes/users');
const cardsrouter = require('./routes/cards');

const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;

try {
  mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
} catch (err) {
  process.exit();
}
const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '644109eaff4da83227c518ac',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsrouter);
app.use('*', (req, res) => res.status(NOT_FOUND).send({ message: 'Такого пути не существует' }));

app.listen(PORT);
