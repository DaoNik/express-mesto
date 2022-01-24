const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
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

router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  createCard
);

router.delete('/:id', auth, deleteCard);

router.put('/:id/likes', auth, addLike);

router.delete('/:id/likes', auth, deleteLike);

router.use(errors());

module.exports = router;
