const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // This is crucial for POST requests

// Routes
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

// ... rest of your code

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define port
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});