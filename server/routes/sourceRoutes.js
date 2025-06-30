const router = require('express').Router();
const Source = require('../models/Source');

router.get('/', async (req, res) => {
    try {
        const sources = await Source.find();
        res.json(sources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Добавить остальные CRUD операции

module.exports = router;