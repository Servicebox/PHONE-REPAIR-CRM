// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    purchasePrice: { type: Number, default: 0 },
    markupPercentage: { type: Number, default: 0 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true // Добавляем индекс для ускорения поиска
    },
    description: { type: String, default: '' },
    quantity: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Включаем виртуальные поля в JSON
    toObject: { virtuals: true }
});

// Виртуальное поле для названия категории
productSchema.virtual('categoryName', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id',
    justOne: true,
    options: { select: 'name' } // Выбираем только название категории
});

module.exports = mongoose.model('Product', productSchema);