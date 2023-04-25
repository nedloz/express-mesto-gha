const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const { NOT_FOUND } = require('./utils/constants');
const usersRouter = require('./routes/users');
const cardsrouter = require('./routes/cards');
const { createUser } = require('./controllers/users');

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

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
}), createUser);
app.use(errors());

app.use('/users', usersRouter);
app.use('/cards', cardsrouter);
app.use('*', (req, res) => res.status(NOT_FOUND).send({ message: 'Такого пути не существует' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  res
    .status(statusCode)
    .send({ message });
});
app.listen(PORT);
