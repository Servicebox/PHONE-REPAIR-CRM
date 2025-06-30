// models/Reference.js
const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            'counterparties',
            'device-types',
            'manufacturers',
            'models',
            'service-types',
            'warehouses'
        ]
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reference'
    },
    extraFields: [{
        name: String,
        value: mongoose.Schema.Types.Mixed,
        type: {
            type: String,
            enum: ['text', 'number', 'boolean', 'date', 'select']
        },
        options: [String]
    }]
}, {
    timestamps: true
});

// Индексы для быстрого поиска
referenceSchema.index({ type: 1 });
referenceSchema.index({ name: 'text', description: 'text' });

const Reference = mongoose.model('Reference', referenceSchema);

module.exports = Reference;