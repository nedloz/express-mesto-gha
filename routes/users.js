const router = require('express').Router();

const {
  getUserByIdValidator,
  changeUserMeValidator,
  changeUserMeAvatarValidator,
} = require('../middlewares/validators');
const {
  getUsers,
  getUser,
  getMe,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUserByIdValidator, getUser);
router.patch('/me', changeUserMeValidator, updateUserInfo);
router.patch('/me/avatar', changeUserMeAvatarValidator, updateUserAvatar);

module.exports = router;
