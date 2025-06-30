// models/Source.js
const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Source', sourceSchema);