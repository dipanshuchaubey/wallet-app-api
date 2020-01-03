const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Account = db.define('Account', {
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isUnique: function(value, next) {
        Account.findOne({
          where: { email: value },
          attributes: ['id']
        })
          .then(user => {
            if (user) {
              return next('Email address already in use!');
            } else next();
          })
          .catch(err => console.log(err));
      }
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      len: {
        args: 6,
        msg: 'Password should be atleast 6 characters'
      }
    }
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
});

Account.beforeSave(async function(Account) {
  const salt = await bcrypt.genSalt(10);

  Account.password = await bcrypt.hash(Account.password, salt);
});

module.exports = Account;
