const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NotFoundError = require('../errors/NotFoundError');
// const validator = require('validator');

// eslint-disable-next-line arrow-body-style
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select(+password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        const token = jwt.sign({ _id: user._id }, 'super-secret', {
          expiresIn: '7d',
        });
        return res.status(200).send({ token });
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getUser = (req, res) => {
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
        res
          .status(400)
          .send({ message: 'Неверный идентификатор пользователя' });
      } else {
        res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Неверно введены данные для пользователя' });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Неверный идентификатор пользователя' });
      } else {
        res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
      }
    });
};

// eslint-disable-next-line arrow-body-style
const createUser = (req, res) => {
  const { email, password, ...body } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      console.log(hash);
      return User.create({
        email,
        password: hash, // записываем хеш в базу
        ...body,
      });
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Неверно введены данные для пользователя' });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

const updateUser = (req, res) => {
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
        res
          .status(400)
          .send({ message: 'Неверно введены данные для пользователя' });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Неверный идентификатор пользователя' });
      } else {
        res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
      }
    });
};

const updateAvatar = (req, res) => {
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
        res.status(400).send({ message: 'Неверно введены данные для аватара' });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Неверный идентификатор пользователя' });
      } else {
        res
          .status(500)
          .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
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
