const Card = require('../models/Card');
const NotFoundError = require('../errors/NotFoundError');

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

  return Card.create({ ...req.body, owner: req.user._id })
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

  return Card.findById(id)
    .then((card) => {
      const cardOwnerId = card.owner.toString();
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else if (cardOwnerId !== req.user._id) {
        return Promise.reject(
          new Error({ message: 'Вы не можете удалить эту карточку' })
        );
      }
      return card;
    })
    .then(() => Card.findByIdAndDelete(id))
    .then((card) => res.status(200).send(card))
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
        throw new NotFoundError(
          'Нет карточки с таким id или вы уже поставили ей лайк'
        );
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
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
        throw new NotFoundError(
          // eslint-disable-next-line comma-dangle
          'Нет карточки с таким id или вы уже убрали лайк'
        );
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
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
