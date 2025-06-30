// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);