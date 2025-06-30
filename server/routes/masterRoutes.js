// routes/masterRoutes.js
const router = require('express').Router();
const Master = require('../models/Master');

router.get('/', async (req, res) => {
    try {
        const masters = await Master.find();
        res.json(masters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Добавить остальные CRUD операции

module.exports = router;