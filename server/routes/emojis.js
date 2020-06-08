const express = require('express');
const router = express.Router();

const emojiController = require('../controllers/emoji-controller');

router.get('/', emojiController.getEntries);
router.post('/', emojiController.createEntry);

module.exports = router;