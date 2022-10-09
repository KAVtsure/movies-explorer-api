const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    if (!token) {
      next(new AuthError('Передан неверный JWT'));
      return;
    }
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    next(new AuthError('Передан неверный JWT'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = { auth };
