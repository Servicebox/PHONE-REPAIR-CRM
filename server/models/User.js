// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['Мастер', 'Администратор', 'Кассир', 'Менеджер', 'Супервайзер'],
        default: 'Мастер'
    },
    password: { type: String, required: true },
    avatar: String,
    username: String,
    phone: String,
    telegram: String,
    locations: [{ type: String }],
    salaryType: {
        type: String,
        enum: ['fixed', 'percentage'],
        default: 'fixed'
    },
    fixedSalary: Number,
    servicePercentage: Number, // % от услуг
    productPercentage: Number, // % от товаров
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);