const router = require('express').Router();

const {
  createCardValidator,
  deleteCardValidator,
  putLikeValidator,
  deleteLikeValidator,
} = require('../middlewares/validators');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:cardId', deleteCardValidator, deleteCard);
router.put('/:cardId/likes', putLikeValidator, putLike);
router.delete('/:cardId/likes', deleteLikeValidator, deleteLike);

module.exports = router;
