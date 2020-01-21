const Account = require('../models/Account');
const jwt = require('jsonwebtoken');

exports.authorize = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ success: false, message: 'You are unauthorized' });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findOne({
      attributes: { exclude: ['password'] },
      where: { accountNumber: decoded.accountNumber }
    });

    if (!account) {
      return res
        .status(401)
        .json({ success: false, message: 'You are unauthorized' });
    }

    req.user = account;

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: 'You are unauthorized' });
  }
};
