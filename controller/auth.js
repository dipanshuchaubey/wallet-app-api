const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../middleware/asyncHandler');
const sendResetPasswordMail = require('../utils/resetMail');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * @desc    Login user
 * @route   POST /auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // If credentials are not provided throw error
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: 'Please enter username and password' });
  }

  // Check if user exists
  const account = await Account.findOne({
    where: { email },
    attributes: ['accountNumber', 'password']
  });

  if (account) {
    // Compare entered password with password in DB
    const checkPassword = await bcrypt.compare(password, account.password);

    if (checkPassword) {
      // Sign JWT

      const token = await account.signJWT();
      return res.status(200).json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

/**
 * @desc    Logout user
 * @route   POST /auth/logout
 * @access  Private
 */

/**
 *   Logout functionality will be implimented when cookies of user data will be stored
 *   in the browser.
 */

/**
 * @desc    Get currently  signedin user
 * @route   POST /auth/me
 * @access  Private
 */
exports.currentlySignedInUser = asyncHandler(async (req, res, next) => {
  const data = await Account.findOne({
    attributes: { exclude: ['password'] },
    where: { accountNumber: req.user.accountNumber }
  });

  res.status(200).json({ success: true, data });
});

/**
 * @desc    Signup user
 * @route   POST /auth/signup
 * @access  Public
 */
exports.signUp = asyncHandler(async (req, res, next) => {
  const data = await Account.create(req.body);

  res.status(201).json({ success: true, data });
});

/**
 * @desc    Update user details
 * @route   PUT /auth/me
 * @access  Private
 */
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const updateObj = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }; /* Defining the object before hand so that only below mentioned fields can be updated */

  await Account.update(updateObj, {
    where: { accountNumber: req.user.accountNumber },
    individualHooks: true
  });

  res
    .status(200)
    .json({ success: true, message: 'Profile updated successfully' });
});

/**
 * @desc    Update user password
 * @route   PUT /auth/me/password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword } = req.body;

  if (!newPassword || !password) {
    return res
      .status(400)
      .json({ success: false, error: 'Enter old and new password' });
  }

  const oldPassword = await Account.findOne({
    where: { accountNumber: req.user.accountNumber }
  });

  if (!(await bcrypt.compare(password, oldPassword.password))) {
    return res
      .status(401)
      .json({ success: false, error: 'Current password is incorrect' });
  }

  await Account.update(
    { password: newPassword },
    { where: { accountNumber: req.user.accountNumber }, individualHooks: true }
  );

  res
    .status(200)
    .json({ success: true, data: 'Password updated successfully' });
});

/**
 * @desc    Delete user account
 * @route   DELETE /auth/me
 * @access  Private
 */
exports.deleteUserAccount = asyncHandler(async (req, res, next) => {
  // Delete all the tranactions related to the account
  await Transaction.destroy({
    where: { accountNumber: req.user.accountNumber }
  });

  // Delete account
  await Account.destroy({
    where: { accountNumber: req.user.accountNumber }
  });

  res
    .status(200)
    .json({ success: true, message: 'Account deleted successfully' });
});

/* FORGOT PASSWORD */
/**
 * @desc    Generate token for password reset
 * @route   POST /auth/me/forgotpassword
 * @access  Public
 */

exports.resetPasswordToken = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return res
      .status(400)
      .json({ success: false, error: 'Please enter your email' });
  }

  const exists = await Account.findOne({
    attributes: ['email'],
    where: { email: req.body.email }
  });

  if (!exists) {
    return res
      .status(401)
      .json({ success: false, error: 'No account found with that email' });
  }

  const token = crypto.randomBytes(10).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  await Account.update(
    { resetToken: hash },
    { where: { email: req.body.email } }
  );

  sendResetPasswordMail(
    exists.email, // Recipient  email
    'Reset Password - Wallet App', // Email Subject
    `To reset your password sent a PUT request using this token ${token}` // Email Body
  );

  res.status(200).json({
    success: true,
    data: 'Reset password link has been sent to your email'
  });
});

/**
 * @desc    Reset password using token from email
 * @route   PUT /auth/me/resetpassword
 * @access  Public
 */
exports.resetForgotPassword = asyncHandler(async (req, res, next) => {
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const account = await Account.findOne({
    attributes: ['email'],
    where: { resetToken: token }
  });

  if (!account) {
    return res
      .status(401)
      .json({ success: false, error: 'Provided token is invalid' });
  }

  await Account.update(
    { password: req.body.password, resetToken: null },
    { where: { email: account.dataValues.email }, individualHooks: true }
  );

  res.status(200).json({
    success: true,
    data: 'Your password has been successfully updated'
  });
});
/* FORGOT PASSWORD */
