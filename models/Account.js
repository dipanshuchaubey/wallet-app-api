const Sequelize = require('sequelize');
const db = require('../config/db');

const Account = db.define(
  'Account',
  {
    accountNumber: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    balance: {
      type: Sequelize.INTEGER
    },
    currency: {
      type: Sequelize.STRING
    }
  },
  {
    createdAt: false,
    updatedAt: false
  }
);

module.exports = Account;
