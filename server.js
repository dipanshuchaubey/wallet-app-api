const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');

// Middlewares
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');

// Mount ENV file
dotenv.config({ path: './config/config.env' });

// Connect Database
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log(`Error ${err}`));

const app = express();

// Body parser
app.use(express.json());

// Static folder
app.use(express.static('./public'));

// Mount Middlewares
app.use(helmet());

// Import router files
//const Users = require('./routes/users');
const Auth = require('./routes/auth');
const Transaction = require('./routes/transaction');

// Mount routes
// app.use('/', Users);
app.use('/auth', Auth);
app.use('/transaction', Transaction);

// Mount error handler middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
