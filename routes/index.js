const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const { isAutorised } = require('../middlewares/auth');

const passswordValidation = Joi.string().required().min(8);
const emailValidation = Joi.string().required();

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: passswordValidation,
  })
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: emailValidation,
    password: passswordValidation,
  })
}), createUser);

router.use(isAutorised);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
