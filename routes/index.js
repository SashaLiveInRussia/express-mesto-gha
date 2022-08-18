const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');

const passswordValidation = Joi.string().required();
const emailValidation = Joi.string().required().email();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: passswordValidation,
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: passswordValidation,
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
}), createUser);

// router.use(isAutorised);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
