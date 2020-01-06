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

    req.user = await Account.findOne({
      attributes: { exclude: ['password'] },
      where: { accountNumber: decoded.accountNumber }
    });

    return next();
  } catch (err) {
    console.log(err);

    return res
      .status(401)
      .json({ success: false, message: 'You are unauthorized' });
  }
};
