const express = require('express');
const {
  login,
  signUp,
  currentlySignedInUser,
  deleteUserAccount
} = require('../controller/auth');
const { authorize } = require('../middleware/authenticateUser');

const router = express.Router();

router.post('/login', login);

router.get('/me', authorize, currentlySignedInUser);

router.post('/signup', signUp);

router.delete('/me', authorize, deleteUserAccount);

module.exports = router;
