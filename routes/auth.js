const express = require('express');
const {
  login,
  signUp,
  currentlySignedInUser,
  updateUserDetails,
  updatePassword,
  deleteUserAccount,
  resetPasswordToken,
  resetForgotPassword
} = require('../controller/auth');
const { authorize } = require('../middleware/authenticateUser');

const router = express.Router();

router.post('/login', login);

router
  .route('/me')
  .post(authorize, currentlySignedInUser)
  .put(authorize, updateUserDetails)
  .delete(authorize, deleteUserAccount);

router.put('/me/password', authorize, updatePassword);

router.post('/me/forgotpassword', resetPasswordToken);

router.put('/me/resetpassword/:token', resetForgotPassword);

router.post('/signup', signUp);

module.exports = router;
