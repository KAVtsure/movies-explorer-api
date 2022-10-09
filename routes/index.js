const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');

const { auth } = require('../middlewares/auth');
const NotFoundError = require('../utils/NotFoundError');
const { loginValidate, createUserValidate } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

routes.post('/signup', createUserValidate, createUser);
routes.post('/signin', loginValidate, login);

routes.use(auth);

routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);

routes.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

module.exports = { routes };
