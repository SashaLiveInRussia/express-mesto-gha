const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const JWT_SECRET = 'secret-key';

const getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAutorised = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new AuthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(authorization.replace('Bearer ', '').trim(), JWT_SECRET);
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = {
  isAutorised,
  getJwtToken,
};
