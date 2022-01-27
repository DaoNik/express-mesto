const Card = require('../models/Card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

// eslint-disable-next-line arrow-body-style
const getCards = (req, res, next) => {
  return Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  console.log(req.body, req.user);

  return Card.create({ ...req.body, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверно введены данные для карточки'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;

  return Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      const cardOwnerId = card.owner.toString();
      if (cardOwnerId !== req.user._id) {
        const error = new Error('Вы не можете удалить эту карточку');
        error.statusCode = 403;
        throw error;
      }
      return card;
    })
    .then(() => Card.findByIdAndDelete(id))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id карточки'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError('Неверный идентификатор карточки'));
      }
      next(err);
    });
};

const addLike = (req, res, next) => {
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
          // eslint-disable-next-line comma-dangle
          'Нет карточки с таким id или вы уже поставили ей лайк'
        );
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new ValidationError(
            // eslint-disable-next-line comma-dangle
            'Неверный идентификатор карточки или вы уже поставили ей лайк'
            // eslint-disable-next-line comma-dangle
          )
        );
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
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
        next(
          new ValidationError(
            // eslint-disable-next-line comma-dangle
            'Неверный идентификатор карточки или вы уже убрали лайк'
            // eslint-disable-next-line comma-dangle
          )
        );
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
