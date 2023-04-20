const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { NOT_FOUND } = require('./utils/constants');
const usersRouter = require('./routes/users');
const cardsrouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

try {
  mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
} catch (err) {
  process.exit();
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);
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
