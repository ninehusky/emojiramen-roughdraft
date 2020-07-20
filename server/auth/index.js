const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const db = require('../db/connection');
const users = db.get('users');

users.createIndex('username', { unique: true });

const schema = Joi.object({
  username: Joi.string().regex(/^[A-Za-z0-9_]+$/).min(6).max(20).required(),
  password: Joi.string().trim().min(6).required()
});

function createTokenSendResponse(user, res, next) {
  const payload = {
    _id: user._id,
    username: user.username,
  };

  jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1d'
  }, (err, token) => {
    if (err) {
      respondError422(res, next);
    } else {
      res.json({
        token
      });
    }
  });
}

router.get('/', (req, res) => {
  res.json({
    message: '🔒🐶'
  });
});

router.post('/signup', (req, res, next) => {
  const validation = schema.validate(req.body);
  if (validation.error) {
    if (validation.error.name === "ValidationError") {
      res.status(422);
    }
    next(validation.error);
  } else {
    // check uniqueness of username
    users.findOne({
      username: req.body.username
    }).then(user => {
      if (user) {
        const error = new Error('That username is already taken!');
        res.status(406);
        next(error);
      } else {
        bcrypt.hash(req.body.password, 12).then(hashedPassword => {
          const newUser = {
            username: req.body.username,
            password: hashedPassword
          };
          users.insert(newUser).then(insertedUser => {
            createTokenSendResponse(insertedUser, res, next);
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  const result = schema.validate(req.body);
  if (!result.error) {
    users.findOne({
      username: req.body.username
    }).then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password).then(result => {
          if (result) {
            createTokenSendResponse(user, res, next);
          } else {
            respondError422(res, next);
          }
        });
      } else {
        respondError422(res, next);
      }
    });
  } else {
    respondError422(res, next);
  }
});

function respondError422(res, next) {
  res.status(422);
  const error = new Error('Unable to login.');
  next(error);
}

module.exports = router;
