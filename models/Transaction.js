const Sequelize = require('sequelize');
const db = require('../config/db');
const Account = require('./Account');

const Transaction = db.define('Transaction', {
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notNull: {
        msg: 'Amount is required'
      }
    }
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['DEBIT', 'CREDIT']],
        msg: 'Transaction type not allowed'
      }
    }
  },
  details: {
    type: Sequelize.STRING
  },
  paymentMethod: {
    type: Sequelize.STRING
  }
});

Transaction.addHook('beforeDestroy', async (transaction, options) => {
  return await Account.update(
    { balance: Sequelize.literal(`balance + ${transaction.amount}`) },
    { where: { accountNumber: transaction.accountNumber } }
  );
});

module.exports = Transaction;
