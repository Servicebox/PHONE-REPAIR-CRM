const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// Получить все категории с иерархией
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        const buildTree = (categories, parentId = null) => {
            return categories
                .filter(cat => {
                    const catParent = cat.parent ? cat.parent.toString() : null;
                    return catParent === (parentId ? parentId.toString() : null);
                })
                .map(cat => ({
                    ...cat._doc,
                    children: buildTree(categories, cat._id)
                }));
        };

        res.json(buildTree(categories));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создать категорию
router.post('/', async (req, res) => {
    try {
        const { name, parent, description } = req.body;

        // Проверка на пустое имя
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Category name is required' });
        }

        // Проверка уникальности имени в рамках родителя
        const existingCategory = await Category.findOne({
            name: name.trim(),
            parent: parent || null
        });

        if (existingCategory) {
            return res.status(400).json({
                message: 'Category name must be unique within the same parent category'
            });
        }

        // Проверка родительской категории
        if (parent) {
            const parentExists = await Category.findById(parent);
            if (!parentExists) {
                return res.status(400).json({ message: 'Parent category not found' });
            }
        }

        const category = new Category({
            name: name.trim(),
            parent: parent || null,
            description: description || ''
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Category name must be unique within the same parent category'
            });
        }
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});


// Обновить категорию
router.patch('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Проверяем родительскую категорию
        if (req.body.parent) {
            const parentExists = await Category.findById(req.body.parent);
            if (!parentExists) {
                return res.status(400).json({ message: 'Parent category not found' });
            }

            // Запрещаем циклические ссылки
            if (req.body.parent === req.params.id) {
                return res.status(400).json({ message: 'Category cannot be parent of itself' });
            }
        }

        // Обновляем только переданные поля
        if (req.body.name) category.name = req.body.name;
        if (req.body.description !== undefined) category.description = req.body.description;
        if (req.body.parent !== undefined) category.parent = req.body.parent || null;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Category name must be unique'
            });
        }

        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

// Удалить категорию
router.delete('/:id', async (req, res) => {
    try {
        // Проверяем, есть ли подкатегории
        const children = await Category.find({ parent: req.params.id });
        if (children.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete category with subcategories'
            });
        }

        // Проверяем, есть ли товары в категории
        const products = await Product.find({ category: req.params.id });
        if (products.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete category with products'
            });
        }

        const result = await Category.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;