const Account = require('../models/Account');

exports.getAllUsers = async (req, res, next) => {
  const data = await Account.findAll();
  res.status(200).json({ success: true, data });
};

exports.createUser = async (req, res, next) => {
  const data = await Account.create(req.body);

  try {
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};
