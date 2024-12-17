const mongoose = require('mongoose');
const Customer = require('./models/Customer');
require('dotenv').config();

// Array of sample data to randomly pick from
const deviceTypes = ['iPhone 13', 'iPhone 14', 'iPhone 15', 'Samsung S21', 'Samsung S22', 'Samsung S23', 'Google Pixel 6', 'Google Pixel 7', 'OnePlus 9', 'OnePlus 10'];
const issues = ['Broken screen', 'Battery issues', 'Won\'t charge', 'Camera not working', 'Speaker problems', 'Water damage', 'Software issues', 'Button not working', 'No signal', 'Overheating'];
const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

// Function to generate random customer data
const generateCustomer = () => {
  const firstName = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emma', 'James', 'Mary'][Math.floor(Math.random() * 10)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][Math.floor(Math.random() * 10)];
  
  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
    issueDescription: issues[Math.floor(Math.random() * issues.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
  };
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Delete existing customers
      await Customer.deleteMany({});
      console.log('Cleared existing customers');

      // Generate and insert 50 customers
      const customers = Array(50).fill(null).map(generateCustomer);
      await Customer.insertMany(customers);
      
      console.log('Successfully added 50 random customers');
      mongoose.connection.close();
    } catch (error) {
      console.error('Error seeding data:', error);
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
  });