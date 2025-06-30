// routes/referenceRoutes.js
const express = require('express');
const router = express.Router();
const Reference = require('../models/Reference');

// Получить все записи по типу
router.get('/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const references = await Reference.find({ type }).populate('parent');
        res.json(references);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создать новую запись
router.post('/', async (req, res) => {
    try {
        const reference = new Reference(req.body);
        const savedReference = await reference.save();
        res.status(201).json(savedReference);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Обновить запись
router.patch('/:id', async (req, res) => {
    try {
        const updatedReference = await Reference.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedReference);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Удалить запись
router.delete('/:id', async (req, res) => {
    try {
        await Reference.findByIdAndDelete(req.params.id);
        res.json({ message: 'Запись удалена успешно' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;