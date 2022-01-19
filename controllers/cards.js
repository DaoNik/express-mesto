const Card = require('../models/Card');

// eslint-disable-next-line arrow-body-style
const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

const createCard = (req, res) => {
  console.log(req.body, req.user);

  return Card.create({ ...req.body, owner: req.user })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Неверно введены данные для карточки' });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;

  return Card.findByIdAndDelete(id)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Такой карточки не существует' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Неверный идентификатор карточки' });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

const addLike = (req, res) => {
  console.log(req.user._id, req.params.id);
  return Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Такой карточки не существует или вы уже поставили ей лайк',
        });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({
          message:
            'Неверный идентификатор карточки или вы уже поставили ей лайк',
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

const deleteLike = (req, res) => {
  console.log(req.user._id, req.params.id);
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({
            message: 'Такой карточки не существует или вы уже убрали лайк',
          });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Неверный идентификатор карточки или вы уже убрали лайк',
        });
      }
      res
        .status(500)
        .send({ message: `Произошла ошибка ${err.name}: ${err.message}` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
