const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

// /cards
router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  createCard
);

router.delete('/:id', deleteCard);

router.put('/:id/likes', addLike);

router.delete('/:id/likes', deleteLike);

router.use(errors());

module.exports = router;
