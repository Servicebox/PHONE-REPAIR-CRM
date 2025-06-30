const router = require('express').Router();
const CustomField = require('../models/CustomField');

// GET all custom fields
router.get('/', async (req, res) => {
    try {
        const customFields = await CustomField.find();
        res.json(customFields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new custom field
router.post('/', async (req, res) => {
    try {
        const customField = new CustomField(req.body);
        const savedCustomField = await customField.save();
        res.status(201).json(savedCustomField);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH custom field by ID
router.patch('/:id', async (req, res) => {
    try {
        const updatedCustomField = await CustomField.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCustomField) {
            return res.status(404).json({ message: 'Custom Field not found' });
        }
        res.json(updatedCustomField);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE custom field by ID
router.delete('/:id', async (req, res) => {
    try {
        const customField = await CustomField.findByIdAndDelete(req.params.id);
        if (!customField) {
            return res.status(404).json({ message: 'Custom Field not found' });
        }
        res.json({ message: 'Custom Field deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;