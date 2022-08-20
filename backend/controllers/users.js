const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { getJwtToken } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => next(new BadRequestError('Переданы некорректные данные')));
// возвращает пользователей

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => next(new NotFoundError('Пользователь по указанному id не найден')))
    .then((user) => res.send(user))
    .catch(next);
};// возвращает пользователя по id

const createUser = (req, res, next) => {
  const { password } = req.body;

  return bcrypt.hash(password, 10).then((hash) => User.create({ ...req.body, password: hash })
    .then((userData) => {
      const userJson = userData.toJSON();
      delete userJson.password;
      res.status(201).json(userJson);
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такая запись уже существует'));
      }

      return next(err);
    });
}; // создает пользователя

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    { $set: { name: req.body.name, about: req.body.about } },
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Пользователь по указанному id не найден')))
    .then((user) => res.send({ data: user }))
    .catch(next);
}; //  обновляет профиль

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, { $set: { avatar: req.body.avatar } }, { new: true })
    .orFail(() => next(new NotFoundError('Пользователь по указанному id не найден')))
    .then((user) => res.send({ data: user }))
    .catch(next);
}; //  обновляет аватар

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .orFail(() => next(new AuthError('Такого пользователя не существует')))
    .then((user) => bcrypt.compare(password, user.password, (err, isValidPassword) => {
      if (!isValidPassword) {
        return next(new AuthError('Неправильный email или пароль'));
      }

      const token = getJwtToken(user.id);
      return res.status(200).send({ token });
    }))
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { id } = req.user;

  User.findById(id)
    .orFail(() => next(new NotFoundError('Пользователь по указанному id не найден')))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUserInfo,
};
