const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectReqDataError = require('../utils/IncorrectReqDataError');
const EmailExistingError = require('../utils/EmailExistingError');
const NotFoundError = require('../utils/NotFoundError');
const AuthError = require('../utils/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, name, password: hashedPassword,
    });
    res.send(user);
  } catch (e) {
    if (e.code === 11000) {
      next(new EmailExistingError('Пользователь с таким email уже существует'));
      return;
    }
    if (e.name === 'ValidationError') {
      next(new IncorrectReqDataError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(e);
    }
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new IncorrectReqDataError('Невалидный ID пользователя'));
    } else {
      next(e);
    }
  }
};

const updateUserProfile = async (req, res, next) => {
  const owner = req.user._id;
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Пользователь с указанным _id не найден'));
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.code === 11000) {
      next(new EmailExistingError('Пользователь с таким email уже существует'));
      return;
    }
    if (e.name === 'ValidationError') {
      next(new IncorrectReqDataError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(e);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password');
    if (!user) {
      next(new AuthError('Неправильные почта или пароль'));
      return;
    }
    const resultMatching = await bcrypt.compare(password, user.password);
    if (!resultMatching) {
      next(new AuthError('Неправильные почта или пароль'));
      return;
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
      .send({ token });
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new IncorrectReqDataError('Невалидный ID пользователя'));
    } else {
      next(e);
    }
  }
};

module.exports = {
  getCurrentUser, createUser, updateUserProfile, login,
};
