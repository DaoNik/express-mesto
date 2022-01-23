const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');
const auth = require('../middleware/auth');

// /cards
router.get('/', auth, getCards);

router.post('/', auth, createCard);

router.delete('/:id', auth, deleteCard);

router.put('/:id/likes', auth, addLike);

router.delete('/:id/likes', auth, deleteLike);

module.exports = router;
