const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  res.send('hello');
});

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

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use(errors());

module.exports = router;
