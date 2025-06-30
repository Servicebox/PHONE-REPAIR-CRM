const router = require('express').Router();
const Customer = require('../models/Customer');

// GET route
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST route for adding new customer
router.post('/', async (req, res) => {
    try {
        console.log('Received POST request with data:', req.body); // Debug log
        const customer = new Customer(req.body);
        const savedCustomer = await customer.save();
        console.log('Saved customer:', savedCustomer); // Debug log
        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error('Error saving customer:', error);
        res.status(400).json({ message: error.message });
    }
});

// DELETE route
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfullyyyyyyyyyyyyyyy' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;