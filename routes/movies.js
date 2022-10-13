const express = require('express');
const { createMovieValidate, deleteMovieValidate } = require('../middlewares/validation');

const movieRoutes = express.Router();
const {
  getMovie, deleteMovie, createMovie,
} = require('../controllers/movies');

movieRoutes.post('/', createMovieValidate, createMovie);

movieRoutes.get('/', getMovie);

movieRoutes.delete('/:movieId', deleteMovieValidate, deleteMovie);

module.exports = { movieRoutes };
