const express = require('express');

const morgan = require('morgan');

const helmet = require('helmet');

const app = express();

const dotenv = require('dotenv').config();

app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: '🐶 bark!'
  });
});

// insert middleware error handlers here

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
