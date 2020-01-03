const express = require('express');
const {
  getAllTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controller/transaction');

const router = express.Router();

router.get('/', getAllTransactions);

router.post('/', createTransaction);

router.get('/:transactionId', getSingleTransaction);

router.put('/:transactionId', updateTransaction);

router.delete('/:transactionId', deleteTransaction);

module.exports = router;
