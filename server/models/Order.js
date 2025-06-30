// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    deviceType: String,
    brand: String,
    model: String,
    acceptedAt: { type: Date, default: Date.now },
    appearance: String,
    completeness: String,
    issueDescription: String,
    status: { type: String, default: 'Pending' },
    price: Number,
    // Привязываем значения extraFields по id кастомного поля
    extraFields: [{
        fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomField' },
        value: mongoose.Schema.Types.Mixed // строка, булево и т.д.
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);