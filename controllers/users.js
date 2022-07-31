const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ 'message': 'Произошла ошибка' }));
};// возвращает всех пользователей

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ 'message': 'Пользователь по указанному id не найден' });
      }
      res.status(200).send(user)
    })
    .catch((err) => res.status(500).send({ 'message': 'Произошла ошибка' }))
};// возвращает пользователя по id

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => {

      res.status(200).send(user)
    })
    .catch(err => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({ 'message': 'Переданы некорректные данные при создании пользователя' })
      }
      res.status(500).send({ 'message': 'Произошла ошибка' })
    });
}; // создает пользователя

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { name: req.body.name, about: req.body.about } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ 'message': 'Пользователь с указанным id не найден' });
      }

      res.send({ data: user })
    })
    .catch(err => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({ 'message': 'Переданы некорректные данные при обновлении профиля' })
      }
      res.status(500).send({ 'message': 'Произошла ошибка' })
    })
}; //  обновляет профиль

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { avatar: req.body.avatar } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ 'message': 'Пользователь с указанным id не найден' });
      }
      res.send({ data: user })
    })
    .catch(err => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({ 'message': 'Переданы некорректные данные при обновлении аватара' })
      }
      res.status(500).send({ 'message': 'Произошла ошибка' })
    });
}; //  обновляет аватар


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar
}