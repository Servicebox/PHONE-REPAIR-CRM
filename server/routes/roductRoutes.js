const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Получить все продукты
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создать новый продукт
router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        purchasePrice: req.body.purchasePrice,
        markupPercentage: req.body.markupPercentage,
        category: req.body.category,
        subcategory: req.body.subcategory,
        description: req.body.description,
        quantity: req.body.quantity
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Обновить продукт
router.patch('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Удалить продукт
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;