const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

/**
 * @desc    Login user
 * @route   POST /auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

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
};

/**
 * @desc    Get currently  signedin user
 * @route   POST /auth/me
 * @access  Private
 */
exports.currentlySignedInUser = async (req, res, next) => {
  const data = await Account.findOne({
    attributes: { exclude: ['password'] },
    where: { accountNumber: req.user.accountNumber }
  });

  res.status(200).json({ success: true, data });
};

/**
 * @desc    Signup user
 * @route   POST /auth/signup
 * @access  Public
 */
exports.signUp = async (req, res, next) => {
  const data = await Account.create(req.body);

  res.status(201).json({ success: true, data });
};

/**
 * @desc    Delete user account
 * @route   DELETE /auth/me
 * @access  Private
 */
exports.deleteUserAccount = async (req, res, next) => {
  await Transaction.destroy({
    where: { accountNumber: req.user.accountNumber }
  });

  await Account.destroy({
    where: { accountNumber: req.user.accountNumber }
  });

  res
    .status(200)
    .json({ success: true, message: 'Account deleted successfully' });
};
