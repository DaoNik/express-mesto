const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');
const auth = require('../middleware/auth');

// /users
router.get('/', auth, getUsers);

router.get('/me', auth, getCurrentUser);

router.get('/:id', auth, getUser);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  login
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  // eslint-disable-next-line comma-dangle
  createUser
);

router.patch(
  '/me',
  auth,
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
  auth,
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
