const { celebrate, Joi } = require('celebrate');
const { linkSchema } = require('../utils/constants');

const signInValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signUpValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkSchema),
  }),
});

const getUserByIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
});

const changeUserMeValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const changeUserMeAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkSchema).required(),
  }),
});

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(linkSchema).required(),
  }),
});

const deleteCardValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
});

const putLikeValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
});

const deleteLikeValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
});

module.exports = {
  signInValidator,
  signUpValidator,
  getUserByIdValidator,
  changeUserMeValidator,
  changeUserMeAvatarValidator,
  createCardValidator,
  deleteCardValidator,
  putLikeValidator,
  deleteLikeValidator,
};
