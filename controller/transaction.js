const Transaction = require('../models/Transaction');
const Accont = require('../models/Account');

/**
 * @desc    Get all transaction records
 * @route   GET /transactions
 * @access  Private
 */
exports.getAllTransactions = async (req, res, next) => {
  const accountNumber = req.user.accountNumber;

  // Only get transactions of currently logged in user
  const data = await Transaction.findAll({ where: { accountNumber } });

  res.status(200).json({ success: true, data });
};

/**
 * @desc    Get a single transaction record
 * @route   GET /transactions/:transactionId
 * @access  Private
 */
exports.getSingleTransaction = async (req, res, next) => {
  const accountNumber = req.user.accountNumber;

  // Only get transactions of currently logged in user
  const data = await Transaction.findOne({
    where: { id: req.params.transactionId, accountNumber }
  });

  if (data[0] === 0) {
    res.status(404).json({ success: false, message: 'No record found' });
  }

  res.status(200).json({ success: true, data });
};

/**
 * @desc    Create a new transaction record
 * @route   POST /transactions
 * @access  Private
 */
exports.createTransaction = async (req, res, next) => {
  try {
    req.body.accountNumber = req.user.accountNumber;

    // Check if account have enough balance
    const account = await Accont.findOne({
      where: { accountNumber: req.user.accountNumber },
      attributes: ['balance']
    });

    if (account.balance < req.body.amount && req.body.type !== 'CREDIT') {
      return res
        .status(401)
        .json({ success: false, message: 'You dont have enough balance' });
    }

    // If transection is CREFIT
    if (req.body.type === 'CREDIT') {
      await Accont.update(
        { balance: account.balance + req.body.amount },
        { where: { accountNumber: req.user.accountNumber } }
      );
    } else if (req.body.type === 'DEBIT') {
      // Deduct amount from account balance
      await Accont.update(
        { balance: account.balance - req.body.amount },
        { where: { accountNumber: req.user.accountNumber } }
      );
    }

    // Create transaction record
    const data = await Transaction.create(req.body);

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a transaction record
 * @route   PUT /transactions/:transactionId
 * @access  Private
 */
exports.updateTransaction = async (req, res, next) => {
  const data = await Transaction.update(req.body, {
    where: {
      id: req.params.transactionId,
      accountNumber: req.user.accountNumber
    }
  });

  /**
   * Sequalize retruns an array with a single elemet that is
   * the number of records that has been updated
   * If no records has been updated sequalize returns [0]
   */
  if (data[0] !== 0) {
    res
      .status(201)
      .json({ success: true, message: 'Record updated successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Record does not exists' });
  }
};

/**
 * @desc    Delete a transaction record
 * @route   DELETE /transactions/:transactionId
 * @access  Private
 */
exports.deleteTransaction = async (req, res, next) => {
  const data = await Transaction.destroy({
    where: {
      id: req.params.transactionId,
      accountNumber: req.user.accountNumber
    }
  });

  if (data) {
    res.status(200).json({
      success: true,
      message: `Record with id ${req.params.transactionId} Deleted`
    });
  } else {
    res.status(404).json({
      success: true,
      message: `Record does not exists`
    });
  }
};
