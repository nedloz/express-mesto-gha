const http2 = require('node:http2');
const Users = require('../models/user');

const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` }));
};

const getUser = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

const updateUserInfo = (req, res) => {
  const newUser = req.body;
  Users.findByIdAndUpdate(req.user._id, newUser, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUserInfo,
  updateUserAvatar,
};