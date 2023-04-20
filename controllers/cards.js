const http2 = require('node:http2');
const Cards = require('../models/card');

const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` }));
};

const createCard = (req, res) => {
  const owner = req.user;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

const deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ message: 'Карточка удалена' });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

const putLike = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

const deleteLike = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) {
        res.send({ message: 'Карточка удалена' });
        return;
      }
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданны некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
