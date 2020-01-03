const express = require('express');
const { login, signUp } = require('../controller/auth');

const router = express.Router();

router.post('/login', login);

router.post('/signup', signUp);

module.exports = router;
