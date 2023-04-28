const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const usersRouter = require('./users');
const cardsrouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signInValidator, signUpValidator } = require('../middlewares/validators');

router.use('/signin', signInValidator, login);
router.use('/signup', signUpValidator, createUser);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsrouter);
router.use('*', auth, (req, res, next) => next(new NotFoundError('Такого пути не существует')));
module.exports = router;
