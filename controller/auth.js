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
    res
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
      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

/**
 * @desc    Get currently  signedin user
 * @route   POST /auth/me
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

  const data = await Account.update(updateObj, {
    where: { accountNumber: req.user.accountNumber },
    individualHooks: true
  });

  res.status(200).json({ success: true, data });
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
    res.status(400).json({ success: false, error: 'Please enter your email' });
  }

  const exists = await Account.findOne(
    {
      attributes: {
        exclude: [
          'accountNumber',
          'password',
          'firstName',
          'lastName',
          'balance',
          'currency'
        ]
      }
    },
    { where: { email: req.body.email } }
  );

  if (exists[0] === 0) {
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

/* FORGOT PASSWORD */
