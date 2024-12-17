import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const CustomerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    issueDescription: '',
    status: 'Pending'
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers');
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    let result = customers;

    if (searchTerm) {
      result = result.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(customer => customer.status === statusFilter);
    }

    if (deviceFilter !== 'all') {
      result = result.filter(customer => customer.deviceType === deviceFilter);
    }

    setFilteredCustomers(result);
  }, [searchTerm, statusFilter, deviceFilter, customers]);

  const deviceTypes = ['all', ...new Set(customers.map(customer => customer.deviceType))];
  const statuses = ['all', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'In Progress': 'info',
      'Completed': 'success',
      'Cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  const handleEdit = (id) => {
    console.log('Edit customer:', id);
    // TODO: Implement edit functionality
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        console.log('Attempting to delete customer:', id); // Debug log
        const response = await axios.delete(`http://localhost:5000/api/customers/${id}`);
        console.log('Delete response:', response); // Debug log
        setCustomers(prevCustomers => {
          console.log('Previous customers:', prevCustomers); // Debug log
          const newCustomers = prevCustomers.filter(customer => customer._id !== id);
          console.log('New customers:', newCustomers); // Debug log
          return newCustomers;
        });
        setFilteredCustomers(prevFiltered => prevFiltered.filter(customer => customer._id !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleAddCustomer = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      deviceType: '',
      issueDescription: '',
      status: 'Pending'
    });
  };
  
  const handleSubmit = async () => {
    try {
      console.log('Submitting new customer:', newCustomer); // Debug log
      const response = await axios.post('http://localhost:5000/api/customers', newCustomer);
      console.log('Server response:', response.data); // Debug log
      setCustomers([...customers, response.data]);
      setFilteredCustomers([...filteredCustomers, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error adding customer:', error);
      console.error('Error details:', error.response); // Add this line
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Phone Repair CRM
      </Typography>

<Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Total Repairs</Typography>
    <Typography variant="h4">{customers.length}</Typography>
  </Paper>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Pending</Typography>
    <Typography variant="h4" color="warning.main">
      {customers.filter(c => c.status === 'Pending').length}
    </Typography>
  </Paper>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">In Progress</Typography>
    <Typography variant="h4" color="info.main">
      {customers.filter(c => c.status === 'In Progress').length}
    </Typography>
  </Paper>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">Completed</Typography>
    <Typography variant="h4" color="success.main">
      {customers.filter(c => c.status === 'Completed').length}
    </Typography>
  </Paper>
</Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Search customers"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 200 }}
        />
        
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Device Type</InputLabel>
          <Select
            value={deviceFilter}
            label="Device Type"
            onChange={(e) => setDeviceFilter(e.target.value)}
          >
            {deviceTypes.map(device => (
              <MenuItem key={device} value={device}>
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCustomer}
        >
        New Customer
        </Button>
      </Box>

      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Phone</TableCell>
        <TableCell>Device</TableCell>
        <TableCell>Issue</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Created At</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredCustomers.map((customer) => (
        <TableRow key={customer._id}>
          <TableCell>{customer.name}</TableCell>
          <TableCell>{customer.email}</TableCell>
          <TableCell>{customer.phone}</TableCell>
          <TableCell>{customer.deviceType}</TableCell>
          <TableCell>{customer.issueDescription}</TableCell>
          <TableCell>
            <Chip 
              label={customer.status} 
              color={getStatusColor(customer.status)}
              size="small"
            />
          </TableCell>
          <TableCell>
            {new Date(customer.createdAt).toLocaleDateString()}
          </TableCell>
          <TableCell>
            <IconButton 
              onClick={() => handleEdit(customer._id)}
              size="small"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              onClick={() => handleDelete(customer._id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


<Dialog open={openDialog} onClose={handleClose}>
  <DialogTitle>Add New Customer</DialogTitle>
  <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
      <TextField
        name="name"
        label="Name"
        value={newCustomer.name}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="email"
        label="Email"
        value={newCustomer.email}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="phone"
        label="Phone"
        value={newCustomer.phone}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="deviceType"
        label="Device Type"
        value={newCustomer.deviceType}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        name="issueDescription"
        label="Issue Description"
        value={newCustomer.issueDescription}
        onChange={handleInputChange}
        multiline
        rows={4}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={newCustomer.status}
          onChange={handleInputChange}
          label="Status"
        >
          {statuses.filter(status => status !== 'all').map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleSubmit} variant="contained" color="primary">
      Add Customer
    </Button>
  </DialogActions>
</Dialog>


    </Container>
  );
};

export default CustomerDashboard;