const mongoose = require('mongoose');

const counterpartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Counterparty', counterpartySchema);