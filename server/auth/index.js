const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const router = express.Router();

const db = require('../db/connection');
const users = db.get('users');

users.createIndex('username', { unique: true });

const schema = Joi.object({
  username: Joi.string().regex(/^[A-Za-z0-9_]+$/).min(6).max(20).required(),
  password: Joi.string().trim().min(6).max(20).required()
});

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
        res.status(422);
        next(error);
      } else {
        bcrypt.hash(req.body.password, 12).then(hashedPassword => {
          const newUser = {
            username: req.body.username,
            password: hashedPassword
          };

          users.insert(newUser).then(insertedUser => {
            delete insertedUser.password;
            res.json(insertedUser);
          });
        });
      }
    });
  }
});

module.exports = router;
