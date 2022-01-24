const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// /users
router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:id', getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  updateUser
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  updateAvatar
);

router.use(errors());

module.exports = router;
