const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Получить все продукты с информацией о категориях
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('categoryName');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создать новый продукт
router.post('/', async (req, res) => {
    try {
        // Проверяем существование категории
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(400).json({ message: 'Category not found' });
            }
        }

        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Обновить продукт
router.patch('/:id', async (req, res) => {
    try {
        // Проверяем существование категории
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(400).json({ message: 'Category not found' });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('categoryName');

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Удалить продукт
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;