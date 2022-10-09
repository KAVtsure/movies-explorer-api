const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidate = (v, helpers) => {
  if (validator.isURL(v)) {
    return v;
  }
  return helpers.message('Введен некорректный URL');
};

const loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createUserValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const updateUserProfileValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const createMovieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidate),
    trailerLink: Joi.string().required().custom(urlValidate),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(urlValidate),
    movieId: Joi.number().required(),
  }),
});

const deleteMovieValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  loginValidate,
  createUserValidate,
  updateUserProfileValidate,
  createMovieValidate,
  deleteMovieValidate,
};
