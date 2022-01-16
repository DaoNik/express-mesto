const Card = require('../models/Card');

// eslint-disable-next-line arrow-body-style
const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const createCard = (req, res) => {
  console.log(req.body, req.user);

  return Card.create({ ...req.body, owner: req.user })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  return Card.findById(id)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports = { getCards, createCard, deleteCard };
