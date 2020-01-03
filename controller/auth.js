const Account = require('../models/Account');
const bcrypt = require('bcryptjs');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const account = await Account.findOne({ where: { email } });

  if (account) {
    const checkPassword = await bcrypt.compare(password, account.password);

    if (checkPassword) {
      res.status(200).json({ success: true, data: account });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

exports.signUp = async (req, res, next) => {
  const data = await Account.create(req.body);

  res.status(201).json({ success: true, data });
};
