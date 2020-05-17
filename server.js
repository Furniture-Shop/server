// get env CONFIG
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'prod'}`,
});

const app = require('./app');

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
