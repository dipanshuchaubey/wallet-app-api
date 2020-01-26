const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = db.define('Account', {
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Account number is required'
      }
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Email is required'
      },
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
    allowNull: false,
    validate: {
      len: {
        args: 6,
        msg: 'Password should be atleast 6 characters'
      },
      notNull: {
        msg: 'Password is required'
      }
    }
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'First name is required'
      }
    }
  },
  lastName: {
    type: Sequelize.STRING
  },
  balance: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notNull: {
        msg: 'Balance amount is required'
      }
    }
  },
  currency: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['INR', 'USD', 'EUR', 'YEN']],
        msg: 'Entered currency is not available'
      },
      notNull: {
        msg: 'Curreny is required'
      }
    }
  }
});

// Hash password before save and update
Account.addHook('beforeSave', async (account, options) => {
  const salt = await bcrypt.genSalt(10);

  account.password = await bcrypt.hash(account.password, salt);
});

/**
 *    Custom hook method can also be used
 *    Account.beforeSave(async function(Account) {
 *      const salt = await bcrypt.genSalt(10);
 *
 *      Account.password = await bcrypt.hash(Account.password, salt);
 *    });
 */

// Sign JWT
Account.prototype.signJWT = function() {
  return jwt.sign(
    { accountNumber: this.accountNumber },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

module.exports = Account;
