// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  acceptedAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  deviceType: { type: String, required: true },
  brand: String,
  model: String,
  serialNumber: String,
  appearance: String,
  completeness: String,
  issueDescription: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  agreementAmount: Number,
  isDeviceWithClient: Boolean,
  isUrgent: Boolean,
  needDelivery: Boolean,
  master: { type: mongoose.Schema.Types.ObjectId, ref: 'Master' },
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'Source' },
  orderType: { type: String, default: 'Взять в работу' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  repairedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentType: { type: String, default: 'Наличные' },
  paymentStatus: { type: String, default: 'Не оплачено' },
  paymentDate: Date,


  orderType: String,
  paymentType: String,

  usedProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],

  performedServices: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],

  extraFields: [{
    label: String,
    value: mongoose.Schema.Types.Mixed,
    type: String
  }],
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    index: ({ orderNumber: 1 }, { unique: true }),
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);