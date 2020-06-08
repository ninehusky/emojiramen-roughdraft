const EmojiEntry = require('../models/emoji-entry');

exports.getEntries = async (req, res, next) => {
    try {
        const entries = await EmojiEntry.find(); // pagination?
        res.json(entries);
    } catch (error) {
        next(error);
    }
};

exports.getEntryById = async (req, res, next) => {
    try {
        const entry = await EmojiEntry.findById(req.body.__id);
        res.json(entry);
    } catch (error) {
        next(error);
    }
};

exports.createEntry = async(req, res, next) => {
    try {
        // console.log(req.body);
        const emojiEntry = new EmojiEntry(req.body);
        const createdEntry = await emojiEntry.save();
        res.json(createdEntry);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
};