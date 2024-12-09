const express = require('express');
const { getRegUser, register, login } = require('../controllers/authController');

const router = express.Router();

// router.get('/show', getRegUser);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
