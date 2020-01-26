const express = require('express');
const {
  login,
  signUp,
  currentlySignedInUser,
  updatePassword,
  deleteUserAccount
} = require('../controller/auth');
const { authorize } = require('../middleware/authenticateUser');

const router = express.Router();

router.post('/login', login);

router
  .route('/me')
  .post(authorize, currentlySignedInUser)
  .put(authorize, updatePassword)
  .delete(authorize, deleteUserAccount);

router.post('/signup', signUp);

module.exports = router;
