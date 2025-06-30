// models/CustomField.js
const mongoose = require('mongoose');

const CustomFieldSchema = new mongoose.Schema({
    label: { type: String, required: true },
    fieldType: { type: String, enum: ['text', 'dropdown', 'checkbox'], required: true },
    options: [{ type: String }], // для dropdown
});

module.exports = mongoose.model('CustomField', CustomFieldSchema);