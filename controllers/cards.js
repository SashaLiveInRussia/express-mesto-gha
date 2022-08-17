const ERRORS = require('../errors/errors');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' }));
}; // возвращает все карточки

const createCard = (req, res) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user.id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.ERROR_404).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
}; // создаёт карточку

const deleteCard = (req, res) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (card && card.owner.toString() !== req.user.id) {
        return res.status(403).send({ message: 'Не наша карточка' });
      }
      if (!card) {
        return res.status(ERRORS.ERROR_404).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.ERROR_400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      console.log(err);
      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
}; // удаляет карточку по идентификатору

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERRORS.ERROR_404).send({ message: 'Передан несуществующий id карточки' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.ERROR_400).send({ message: ' Переданы некорректные данные для постановки/снятии лайка' });
      }

      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
}; // поставить лайк карточке

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERRORS.ERROR_404).send({ message: 'Карточка не найдена' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.ERROR_400).send({ message: 'Некорректные данные' });
      }
      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
}; // убрать лайк с карточки

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
