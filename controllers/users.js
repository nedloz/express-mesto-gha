const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id'));
        return;
      }
      next();
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
        return;
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
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
        return;
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
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
        return;
      }
      next();
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '60295c22daed02f6e45e7ecb6eeaa19cf49621c7afc76fd508d982b4bccc1335', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  getMe,
  updateUserInfo,
  updateUserAvatar,
  login,
};
