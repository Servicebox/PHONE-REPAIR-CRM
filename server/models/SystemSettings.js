const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    address: String,
    phone: String,
    email: String,
    currency: { type: String, default: '₽' },
    timezone: { type: String, default: 'Europe/Moscow' },
    autoOrderNumber: { type: Boolean, default: true },
}, { timestamps: true });

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

module.exports = SystemSettings;