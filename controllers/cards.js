const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
// const UnAuthorizedError = require('../errors/UnAuthorizedError');
// const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');

const Cards = require('../models/card');

const getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
        return;
      }
      next();
    });
};

const deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return card.deleteOne(card)
        .then(() => res.send({ data: card }));
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки'));
        return;
      }
      next();
    });
};

const deleteLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки'));
        return;
      }
      next();
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
