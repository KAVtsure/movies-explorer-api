const express = require('express');
const { updateUserProfileValidate } = require('../middlewares/validation');

const userRoutes = express.Router();
const {
  updateUserProfile, getCurrentUser,
} = require('../controllers/users');

userRoutes.patch('/me', updateUserProfileValidate, updateUserProfile);

userRoutes.get('/me', getCurrentUser);

module.exports = { userRoutes };
