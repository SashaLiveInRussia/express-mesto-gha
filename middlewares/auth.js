const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret-key';

const getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAutorised = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(authorization.replace('Bearer ', '').trim(), JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};

module.exports = {
  isAutorised,
  getJwtToken,
};
