const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthorizationError = require('../errors/AuthorizationError');

// eslint-disable-next-line arrow-body-style
const getUsers = (req, res, next) => {
  return User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthorizationError('Неправильные почта или пароль');
        }

        const token = jwt.sign({ _id: user._id }, 'super-secret', {
          expiresIn: '7d',
        });
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Неверный идентификатор пользователя'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверно введены данные для пользователя'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Неверный идентификатор пользователя'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line arrow-body-style
const createUser = (req, res, next) => {
  const { email, password, ...body } = req.body;
  bcrypt
    .hash(password, 10)
    // eslint-disable-next-line arrow-body-style
    .then((hash) => {
      return User.create({
        email,
        password: hash, // записываем хеш в базу
        ...body,
      });
    })
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверно введены данные для пользователя'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        const error = new Error('Данный пользователь уже зарегистрирован');
        error.statusCode = 409;

        next(error);
      }

      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверно введены данные для пользователя'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Неверный идентификатор пользователя'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверно введены данные для аватара'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Неверный идентификатор пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
