const express = require('express');
const {
  getAllTransactions,
  getSingleTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controller/transaction');
const { authorize } = require('../middleware/authenticateUser');

const router = express.Router();

router
  .route('/')
  .get(authorize, getAllTransactions)
  .post(authorize, createTransaction);

router
  .route('/:transactionId')
  .get(authorize, getSingleTransaction)
  .put(authorize, updateTransaction)
  .delete(authorize, deleteTransaction);

module.exports = router;
