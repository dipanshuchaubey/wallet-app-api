const Account = require('../models/Account');
const asyncHandler = require('../middleware/asyncHandler');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const data = await Account.findAll({
    attributes: { exclude: ['password'] }
  });
  res.status(200).json({ success: true, data });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const data = await Account.create(req.body);
  res.status(201).json({ success: true, data });
});
