const User = require('../models/User');

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

const getUser = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Неверный идентификатор пользователя' });
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

// eslint-disable-next-line arrow-body-style
const createUser = (req, res) => {
  return User.create({ ...req.body })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Неверный идентификатор пользователя' });
      }
      return res.status(201).send(user);
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
        return res
          .status(404)
          .send({ message: 'Неверный идентификатор пользователя' });
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
        return res
          .status(404)
          .send({ message: 'Неверный идентификатор пользователя' });
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
  createUser,
  updateUser,
  updateAvatar,
};
