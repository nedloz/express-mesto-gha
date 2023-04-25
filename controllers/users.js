const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Users = require('../models/user');

const getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id'));
      }
      next();
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  Users.create({
    email, password, name, about, avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
      }
      next();
    });
};

const updateUserInfo = (req, res, next) => {
  const newUser = req.body;
  Users.findByIdAndUpdate(req.user._id, newUser, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      next();
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      next();
    });
};

// const login = (req, res, next) => {
//   const { email, password } = req.body;
//   if (!validator.isEmail(email)) {
//     next();
//   }

// };

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  // login,
};
