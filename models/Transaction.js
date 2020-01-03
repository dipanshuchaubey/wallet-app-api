const Sequelize = require('sequelize');
const db = require('../config/db');

const Transaction = db.define('Transaction', {
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    values: ['DEBIT', 'CREDIT']
  },
  details: {
    type: Sequelize.STRING,
    allowNull: false
  },
  paymentMethod: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Transaction;
