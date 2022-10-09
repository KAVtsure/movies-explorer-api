const Movie = require('../models/movie');
const IncorrectReqDataError = require('../utils/IncorrectReqDataError');
const ServerError = require('../utils/ServerError');
const NotFoundError = require('../utils/NotFoundError');
const MovieDeleteError = require('../utils/MovieDeleteError');

const createMovie = async (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN,
    thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    res.send(movie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new IncorrectReqDataError('Переданы некорректные данные при создании фильма'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

const getMovie = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner });
    res.send(movies);
  } catch (e) {
    next(new ServerError('Ошибка по умолчанию'));
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      next(new NotFoundError('фильм с указанным _id не найден'));
      return;
    }
    if (movie.owner.toString() !== req.user._id) {
      next(new MovieDeleteError('Невозможно удалить чужой фильм'));
      return;
    }
    await Movie.deleteOne(movie);
    res.send({ message: 'фильм успешно удален' });
  } catch (e) {
    if (e.name === 'CastError') {
      next(new IncorrectReqDataError('Невалидный ID фильма'));
    } else {
      next(new ServerError('Ошибка по умолчанию'));
    }
  }
};

module.exports = {
  getMovie, deleteMovie, createMovie,
};
