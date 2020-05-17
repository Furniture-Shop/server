// get env CONFIG
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'prod'}`,
});

const mongoose = require('mongoose');

const { MONGODB_URL } = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
