const router = require('express').Router();
const Customer = require('../models/Customer');
const Counterparty = require('../models/Counterparty');
// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new customer
router.post('/', async (req, res) => {
  try {
    // Генерируем уникальный номер заказа
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const customer = new Customer({ ...req.body, orderNumber });
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH customer by ID
router.patch('/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    // Создаем клиента
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();

    // Автоматически добавляем в контрагенты
    const counterparty = new Counterparty({
      name: savedCustomer.name,
      type: 'customer',
      contactInfo: {
        phone: savedCustomer.phone,
        email: savedCustomer.email
      },
      relatedCustomer: savedCustomer._id
    });

    await counterparty.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;