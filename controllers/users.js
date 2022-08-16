const bcrypt = require('bcryptjs');
const validator = require('validator');
const ERRORS = require('../errors/errors');
const User = require('../models/user');

const { getJwtToken } = require('../middlewares/auth');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(ERRORS.ERROR_400).send({ message: 'Переданы некорректные данные' }));

const getUser = (req, res) => {
  const { id } = req.user;
  User.findById(id)
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(ERRORS.ERROR_400).send({ message: 'Email или пароль не передан' });
  }

  if (!validator.isEmail(email)) {
    return res.status(ERRORS.ERROR_400).send({ message: 'Email некорректен' });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }

      return bcrypt.hash(password, 10).then((hash) => {
        User.create({ email, password: hash })
          .then((userData) => res.status(201).send(userData))
          .catch(() => res.status(500).send({ message: 'Internal Error' }));
      });
    })

    .catch(() => res.status(500).send({ message: 'Internal Error' }));
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
    return res.status(ERRORS.ERROR_400).send({ message: 'Email или пароль не передан' });
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'Такого пользователя не существует' });
      }

      return bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'Неправильный email или пароль' });
        }

        const token = getJwtToken(user.id);
        return res.status(200).send({ token });
      });
    })
    .catch(() => res.status(ERRORS.ERROR_500).send({ message: 'Internal Error' }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
