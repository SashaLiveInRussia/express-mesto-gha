const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ 'message': 'Произошла ошибка' }));
}; // возвращает все карточки

const createCard = (req, res) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(err => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({ 'message': 'Переданы некорректные данные при создании карточки' })
      }
      res.status(500).send({ 'message': 'Произошла ошибка' })
    });
}; // создаёт карточку

const deleteCard = (req, res) => {
  console.log(req.params.cardId);
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ 'message': 'Карточка с указанным id не найдена' });
      }
      return res.send({ data: card });
    })
}; // удаляет карточку по идентификатору

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ 'message': 'Передан несуществующий id карточки' });
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({ 'message': ' Переданы некорректные данные для постановки/снятии лайка' });
      }

      return res.status(500).send({ 'message': 'Произошла ошибка' });
    });
}; // поставить лайк карточке

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ 'message': 'Карточка не найдена' });
      }

      res.send({ data: card });
    })
    .catch(err => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({ 'message': 'Некорректные данные' })
      }
      res.status(500).send({ 'message': 'Произошла ошибка' })
    })
}; // убрать лайк с карточки

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}