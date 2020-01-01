const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');

// Mount ENV file
dotenv.config({ path: './config/config.env' });

// Import Model
const Account = require('./models/Account');

// Connect Database
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log(`Error ${err}`));

const app = express();

// Body parser
app.use(express.json());

app.get('/', async (req, res, next) => {
  const data = await Account.findAll();
  res.status(200).json({ success: true, data });
});

app.post('/user', async (req, res, next) => {
  const data = await Account.create(req.body);

  try {
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
