const ERRORS = require('../errors/errors');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' }));
};// возвращает всех пользователей

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERRORS.ERROR_404).send({ message: 'Пользователь по указанному id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERRORS.ERROR_400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
};// возвращает пользователя по id

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.ERROR_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
}; // создает пользователя

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { name: req.body.name, about: req.body.about } })
    .then((user) => {
      if (!user) {
        return res.status(ERRORS.ERROR_404).send({ message: 'Пользователь с указанным id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.ERROR_404).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
}; //  обновляет профиль

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { $set: { avatar: req.body.avatar } })
    .then((user) => {
      if (!user) {
        return res.status(ERRORS.ERROR_404).send({ message: 'Пользователь с указанным id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERRORS.ERROR_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(ERRORS.ERROR_500).send({ message: 'Произошла ошибка' });
    });
}; //  обновляет аватар

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не передан' });
  };

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }

      User.create({ email, password })
        .then((user) => {
          res.status(201).send(user);
        })
        .catch(() => res.status(500).send({ message: 'Internal Error' }));
    })
    .catch(() => res.status(500).send({ message: 'Internal Error' }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
