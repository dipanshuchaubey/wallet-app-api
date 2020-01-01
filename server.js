const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');

// Mount ENV file
dotenv.config({ path: './config/config.env' });

// Connect Database
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log(`Error ${err}`));

const app = express();

// Body parser
app.use(express.json());

// Import router files
const Users = require('./routes/users');

// Mount routes
app.use('/', Users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
