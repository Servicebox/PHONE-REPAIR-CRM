// models/Master.js
const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Master', masterSchema);