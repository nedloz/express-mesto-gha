const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  getUsers,
  getUser,
  getMe,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({ scheme: ['http', 'https'] }),
  }),
}), updateUserAvatar);
router.use((req, res, err) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
router.use(errors());
module.exports = router;
