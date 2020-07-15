const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();

const middlewares = require('./middlewares/middlewares');
const auth = require('./auth');

const app = express();

app.use(helmet());
app.use(morgan('dev'));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🐶 bark!'
  });
});

app.use('/auth', auth);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
