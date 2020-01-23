const Account = require('../models/Account');

exports.getAllUsers = async (req, res, next) => {
  try {
    const data = await Account.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const data = await Account.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};
