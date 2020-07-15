const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();

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
    res.json({
      message: validation
    });
  }
});

module.exports = router;
