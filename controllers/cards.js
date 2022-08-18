const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}; // возвращает все карточки

const createCard = (req, res, next) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user.id })
    .then((card) => res.send({ data: card }))
    .catch(next);
}; // создаёт карточку

const deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
    .then((card) => {
      if (!card.owner.equals(req.user.id)) {
        return next(new ForbiddenError('Не наша карточка'));
      }

      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
}; // удаляет карточку по идентификатору

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
    .then((card) => res.send({ data: card }))
    .catch(next);
}; // поставить лайк карточке

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
    .then((card) => res.send({ data: card }))
    .catch(next);
}; // убрать лайк с карточки

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
