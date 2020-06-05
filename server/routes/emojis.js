const express = require('express');
const router = express.Router();

const EmojiEntry = require('../models/EmojiEntry');

router.get('/', async (req, res, next) => {
    try {
        const entries = await EmojiEntry.find();
        res.json(entries);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        console.log(req.body);
        const emojiEntry = new EmojiEntry(req.body);
        const createdEntry = await emojiEntry.save();
        res.json(createdEntry);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
});

module.exports = router;