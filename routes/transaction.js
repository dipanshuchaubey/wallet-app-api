const express = require('express');
const {
  getAllTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controller/transaction');

const router = express.Router();

router
  .route('/')
  .get(getAllTransactions)
  .post(createTransaction);

router
  .route('/:transactionId')
  .get(getSingleTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
