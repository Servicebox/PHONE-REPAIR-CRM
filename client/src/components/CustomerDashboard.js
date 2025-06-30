/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { Snackbar, Alert } from '@mui/material';


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
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  TablePagination,
  Tooltip,
  CircularProgress,
  Zoom,
  Fab,



} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Print as PrintIcon,
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  ShoppingBasket as ProductsIcon,
  Description as ActIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  PhoneIphone as PhoneIphoneIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Search as SearchIcon,
  QrCode as QRCodeIcon,

} from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

const API = 'http://localhost:9000/api';

const STATUSES = [
  'Новый заказ',
  'В работе',
  'Завершено',
  'Готов к выдаче',
  'На согласовании',
  'Поиск запчастей',
  'Отменено',
  'Без ремонта выдан',
  'Без ремонта'
];

const STATUS_COLORS = {
  'Новый заказ': '#2196f3',
  'В работе': '#ff9800',
  'Завершено': '#4caf50',
  'Готов к выдаче': '#9c27b0',
  'На согласовании': '#673ab7',
  'Поиск запчастей': '#607d8b',
  'Отменено': '#f44336',
  'Без ремонта выдан': '#795548',
  'Без ремонта': '#9e9e9e'
};

const DEVICE_TYPES = ['Телефон', 'Ноутбук', 'Планшет', 'Другое'];
const APPEARANCE_TYPES = ['Отличный', 'Хороший', 'Удовлетворительный', 'Плохой'];
const ORDER_TYPES = ['Платный', 'Гарантийный'];

const CustomerDashboard = () => {
  // Основные состояния
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [masters, setMasters] = useState([]);
  const [sources, setSources] = useState([]);

  // Фильтры и поиск
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');

  // Диалоги и вкладки
  const [openDialog, setOpenDialog] = useState(false);
  const [openCustomFieldDialog, setOpenCustomFieldDialog] = useState(false);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [nextOrderNumber, setNextOrderNumber] = useState(1000);

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
  });

  // Ссылка для печати
  const printRef = useRef(null);

  // Инициализация данных
  const initialCustomer = {
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    brand: '',
    model: '',
    appearance: '',
    completeness: '',
    issueDescription: '',
    agreementAmount: 0,
    acceptedAt: new Date(),
    isDeviceWithClient: false,
    isUrgent: false,
    needDelivery: false,
    master: '',
    source: '',
    orderType: 'Платный',
    usedProducts: [],
    performedServices: [],
    extraFields: [],
    orderNumber: nextOrderNumber,
    status: 'Новый заказ',
    acceptedBy: '',
    repairedBy: '',
    serialNumber: '',
  };

  const [formData, setFormData] = useState(initialCustomer);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          customersRes,
          fieldsRes,
          servicesRes,
          productsRes,
          mastersRes,
          sourcesRes,
          usersRes
        ] = await Promise.all([
          axios.get(`${API}/customers`),
          axios.get(`${API}/customfields`),
          axios.get(`${API}/services`),
          axios.get(`${API}/products`),
          axios.get(`${API}/masters`),
          axios.get(`${API}/sources`),
          axios.get(`${API}/users`)
        ]);

        setCustomers(customersRes.data);
        setCustomFields(fieldsRes.data);
        setServices(servicesRes.data);
        setProducts(productsRes.data);
        setMasters(mastersRes.data);
        setSources(sourcesRes.data);
        setUsers(usersRes.data);
        setFilteredCustomers(customersRes.data);

        // Установка следующего номера заказа
        if (customersRes.data.length > 0) {
          const maxOrderNumber = Math.max(...customersRes.data.map(c => c.orderNumber));
          setNextOrderNumber(maxOrderNumber + 1);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Фильтрация данных
  useEffect(() => {
    let result = customers;

    if (searchTerm) {
      result = result.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      );
    };

    if (statusFilter !== 'all') {
      result = result.filter(customer => customer.status === statusFilter);
    }

    if (deviceFilter !== 'all') {
      result = result.filter(customer => customer.deviceType === deviceFilter);
    }

    setFilteredCustomers(result);
  }, [searchTerm, statusFilter, deviceFilter, customers]);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const [typesRes] = await Promise.all([
          axios.get(`${API}/references/device-types`)
        ]);
        setDeviceTypes(typesRes.data);
      } catch (error) {
        console.error('Error fetching references:', error);
      }
    };
    fetchReferences();
  }, []);
  // Обработчики для диалога заказа
  const handleAddCustomer = () => {
    setFormData({ ...initialCustomer, orderNumber: nextOrderNumber });
    setIsEditing(false);
    setCurrentTab(0);
    setOpenDialog(true);
  };

  const handleEditCustomer = (customer) => {
    setFormData(customer);
    setIsEditing(true);
    setCurrentTab(0);
    setOpenDialog(true);
  };

  const handleStatusChange = async (customerId, newStatus) => {
    try {
      await axios.patch(`${API}/customers/${customerId}`, { status: newStatus });
      setCustomers(customers.map(c =>
        c._id === customerId ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setFormData(initialCustomer);
  };

  // Обработчики изменений формы
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Подготовка данных для отправки
      const dataToSend = {
        ...formData,
        acceptedAt: formData.acceptedAt || new Date(),
        extraFields: formData.extraFields.filter(f => f.label && f.value)
      };

      if (isEditing) {
        // Для редактирования
        const response = await axios.patch(`${API}/customers/${formData._id}`, dataToSend);
        setCustomers(customers.map(c => c._id === response.data._id ? response.data : c));
        setFilteredCustomers(filteredCustomers.map(c => c._id === response.data._id ? response.data : c));

        // Показываем сообщение об успехе
        setSnackbar({ open: true, message: 'Заказ успешно обновлен', severity: 'success' });
      } else {
        // Для новых заказов
        delete dataToSend._id;
        const response = await axios.post(`${API}/customers`, dataToSend);

        // Обновляем состояние
        const newCustomer = response.data;
        setCustomers([...customers, newCustomer]);
        setFilteredCustomers([...filteredCustomers, newCustomer]);
        setNextOrderNumber(prev => prev + 1);

        // Обновляем formData для печати
        setFormData(newCustomer);

        // Переключаем в режим редактирования
        setIsEditing(true);

        // Переключаем на вкладку акта
        setCurrentTab(3);

        // Показываем сообщение об успехе
        setSnackbar({ open: true, message: 'Заказ успешно создан', severity: 'success' });
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      setSnackbar({
        open: true,
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  };

  // Обработчики для дополнительных полей
  const handleExtraFieldChange = (idx, key, value) => {
    setFormData(prev => {
      const newFields = [...prev.extraFields];
      newFields[idx] = { ...newFields[idx], [key]: value };
      return { ...prev, extraFields: newFields };
    });
  };

  const handleAddExtraField = () => {
    setFormData(prev => ({
      ...prev,
      extraFields: [...prev.extraFields, { label: '', value: '', type: 'text' }]
    }));
  };

  const handleRemoveExtraField = (idx) => {
    setFormData(prev => ({
      ...prev,
      extraFields: prev.extraFields.filter((_, i) => i !== idx)
    }));
  };

  // Обработчики для кастомных полей
  const handleOpenCustomFieldDialog = (field = null) => {
    setEditingField(field || { label: '', fieldType: 'text', options: [] });
    setOpenCustomFieldDialog(true);
  };

  const handleSaveCustomField = async () => {
    try {
      if (editingField._id) {
        const { data } = await axios.patch(`${API}/customfields/${editingField._id}`, editingField);
        setCustomFields(customFields.map(f => f._id === data._id ? data : f));
      } else {
        const { data } = await axios.post(`${API}/customfields`, editingField);
        setCustomFields([...customFields, data]);
      }
      setOpenCustomFieldDialog(false);
    } catch (error) {
      console.error('Error saving custom field:', error);
    }
  };

  // Обработчики для услуг
  const handleOpenServiceDialog = (service = null) => {
    setEditingService(service || { name: '', category: '', price: 0, description: '' });
    setOpenServiceDialog(true);
  };

  const handleSaveService = async () => {
    try {
      if (editingService._id) {
        const { data } = await axios.patch(`${API}/services/${editingService._id}`, editingService);
        setServices(services.map(s => s._id === data._id ? data : s));
      } else {
        const { data } = await axios.post(`${API}/services`, editingService);
        setServices([...services, data]);
      }
      setOpenServiceDialog(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  // Обработчики для товаров и услуг в заказе
  const handleAddProductToOrder = (product) => {
    setFormData(prev => ({
      ...prev,
      usedProducts: [...prev.usedProducts, {
        ...product,
        quantity: 1,
        total: product.price
      }]
    }));
  };

  const handleAddServiceToOrder = (service) => {
    setFormData(prev => ({
      ...prev,
      performedServices: [...prev.performedServices, {
        ...service,
        quantity: 1,
        total: service.price
      }]
    }));
  };

  const handleRemoveProductFromOrder = (index) => {
    setFormData(prev => {
      const newProducts = [...prev.usedProducts];
      newProducts.splice(index, 1);
      return { ...prev, usedProducts: newProducts };
    });
  };

  const handleRemoveServiceFromOrder = (index) => {
    setFormData(prev => {
      const newServices = [...prev.performedServices];
      newServices.splice(index, 1);
      return { ...prev, performedServices: newServices };
    });
  };

  const handleProductQuantityChange = (index, quantity) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    setFormData(prev => {
      const newProducts = [...prev.usedProducts];
      newProducts[index] = {
        ...newProducts[index],
        quantity: qty,
        total: newProducts[index].price * qty
      };
      return { ...prev, usedProducts: newProducts };
    });
  };

  const handleServiceQuantityChange = (index, quantity) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    setFormData(prev => {
      const newServices = [...prev.performedServices];
      newServices[index] = {
        ...newServices[index],
        quantity: qty,
        total: newServices[index].price * qty
      };
      return { ...prev, performedServices: newServices };
    });
  };

  // Обработчики удаления
  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`${API}/customers/${customerId}`);
      setCustomers(customers.filter(c => c._id !== customerId));
      setFilteredCustomers(filteredCustomers.filter(c => c._id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Обработчик печати
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Акт_приема_${formData.name || 'заказ'}`,
    onAfterPrint: () => {
      if (!isEditing) {
        handleClose();
      }
    },
    // Добавляем задержку для корректной работы
    onBeforeGetContent: () => new Promise(resolve => setTimeout(resolve, 500))
  });

  const handlePrintCompletionAct = () => {
    console.log("Printing completion act...");
  };

  const calculateOrderTotal = (order) => {
    const productsTotal = order.usedProducts?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    const servicesTotal = order.performedServices?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    return productsTotal + servicesTotal;
  };

  // Вспомогательные функции
  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || '#9e9e9e';
  };

  const statuses = ['all', ...STATUSES];

  const calculateTotal = () => {
    const productsTotal = formData.usedProducts.reduce((sum, item) => sum + item.total, 0);
    const servicesTotal = formData.performedServices.reduce((sum, item) => sum + item.total, 0);
    return productsTotal + servicesTotal;
  };

  const renderExtraFieldInput = (field, idx) => {
    switch (field.type) {
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value === 'true'}
                onChange={(e) => handleExtraFieldChange(idx, 'value', e.target.checked.toString())}
              />
            }
            label={field.label}
          />
        );
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={field.value || ''}
              onChange={(e) => handleExtraFieldChange(idx, 'value', e.target.value)}
              label={field.label}
            >
              {field.options?.map((option, i) => (
                <MenuItem key={i} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return (
          <TextField
            label={field.label}
            value={field.value || ''}
            onChange={(e) => handleExtraFieldChange(idx, 'value', e.target.value)}
            fullWidth
          />
        );
    }
  };

  // Изменение пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3 }}>
        <span style={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Управление заказами и клиентами
        </span>
      </Typography>

      {/* Панель управления */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: 3,
        width: '100%',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            onClick={() => handleOpenCustomFieldDialog()}
            variant="contained"
            sx={{
              bgcolor: '#9b59b6',
              '&:hover': { bgcolor: '#8e44ad' },
              boxShadow: '0 4px 8px rgba(155, 89, 182, 0.3)'
            }}
            startIcon={<AddIcon />}
          >
            Кастомное поле
          </Button>
          <Button
            onClick={() => handleOpenServiceDialog()}
            variant="contained"
            sx={{
              bgcolor: '#3498db',
              '&:hover': { bgcolor: '#2980b9' },
              boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)'
            }}
            startIcon={<AddIcon />}
          >
            Добавить работу
          </Button>
        </Box>

        <Box sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: { xs: 'flex-start', md: 'flex-end' }
        }}>
          <TextField
            label="Поиск клиентов"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 250 }}
            InputProps={{
              endAdornment: <SearchIcon color="action" />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              value={statusFilter}
              label="Статус"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(status => (
                <MenuItem key={status} value={status}>
                  {status === 'all' ? 'Все' : status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Тип устройства</InputLabel>
            <Select
              value={deviceFilter}
              label="Тип устройства"
              onChange={(e) => setDeviceFilter(e.target.value)}
            >
              <MenuItem value="all">Все</MenuItem>
              {deviceTypes.map(device => (
                <MenuItem key={device} value={device}>
                  {device}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCustomer}
            sx={{
              bgcolor: '#27ae60',
              '&:hover': { bgcolor: '#219653' },
              boxShadow: '0 4px 8px rgba(39, 174, 96, 0.3)',
              minWidth: 180
            }}
          >
            Новый заказ
          </Button>
        </Box>
      </Box>

      {/* Статистика по статусам */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h6">Всего заказов</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {customers.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h6">Общая сумма</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {customers.reduce((sum, order) => sum + calculateOrderTotal(order), 0).toLocaleString()} ₽
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h6">Завершено</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {customers.filter(c => c.status === 'Завершено').length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 2,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: 3
          }}>
            <Typography variant="h6">В работе</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
              {customers.filter(c => c.status === 'В работе').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Статусы в виде карточек */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 2,
        mb: 4
      }}>
        {STATUSES.map(status => {
          const count = customers.filter(c => c.status === status).length;
          return (
            <Paper
              key={status}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
                userSelect: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                backgroundColor: getStatusColor(status),
                color: 'white',
                p: 2,
                minHeight: 100,
                boxShadow: `0 4px 8px ${getStatusColor(status)}50`,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  boxShadow: `0 6px 12px ${getStatusColor(status)}80`,
                  transform: 'translateY(-5px)'
                }
              }}
              onClick={() => setStatusFilter(status)}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{status}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {count}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Таблица заказов */}
      <Paper elevation={3} sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        mb: 3
      }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#34495e' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>№</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Имя</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Телефон</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Устройство</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Проблема</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Сумма</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Статус</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Дата приема</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow
                    key={customer._id}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                      transition: 'background-color 0.3s',
                      '&:hover': { backgroundColor: '#f0f7ff' }
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold">#{customer.orderNumber}</Typography>
                    </TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {customer.deviceType === 'Телефон' && <PhoneIphoneIcon sx={{ mr: 1, color: '#2196f3' }} />}
                        {customer.deviceType === 'Ноутбук' && <LaptopIcon sx={{ mr: 1, color: '#4caf50' }} />}
                        {customer.deviceType === 'Планшет' && <TabletIcon sx={{ mr: 1, color: '#ff9800' }} />}
                        <Typography>
                          {customer.brand} {customer.model}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={customer.issueDescription}>
                        <Typography sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 200
                        }}>
                          {customer.issueDescription}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="#2e7d32">
                        {calculateOrderTotal(customer).toLocaleString()} ₽
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={customer.status}
                        onChange={(e) => handleStatusChange(customer._id, e.target.value)}
                        sx={{
                          backgroundColor: getStatusColor(customer.status) + '20',
                          color: getStatusColor(customer.status),
                          fontWeight: 'bold',
                          minWidth: 180
                        }}
                      >
                        {STATUSES.map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(customer.acceptedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Редактировать">
                          <IconButton
                            onClick={() => handleEditCustomer(customer)}
                            size="small"
                            sx={{
                              backgroundColor: '#2196f3',
                              color: 'white',
                              '&:hover': { backgroundColor: '#1976d2' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton
                            onClick={() => handleDeleteCustomer(customer._id)}
                            size="small"
                            sx={{
                              backgroundColor: '#f44336',
                              color: 'white',
                              '&:hover': { backgroundColor: '#d32f2f' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
      </Paper>

      {/* Диалог редактирования заказа */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        fullScreen={currentTab === 3} // Акт приема на весь экран
      >
        <DialogTitle sx={{
          bgcolor: '#3498db',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 3
        }}>
          <Box display="flex" alignItems="center">
            {isEditing ? 'Редактирование заказа' : 'Новый заказ'}
            <Chip
              label={`№ ${formData.orderNumber}`}
              size="small"
              sx={{
                ml: 2,
                bgcolor: 'white',
                color: '#3498db',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            />
          </Box>
          <Box>
            {formData.status === 'Готов к выдаче' && (
              <Button
                onClick={handlePrintCompletionAct}
                variant="contained"
                startIcon={<PrintIcon />}
                sx={{
                  bgcolor: '#2ecc71',
                  ml: 1,
                  '&:hover': { bgcolor: '#27ae60' },
                  fontSize: '0.75rem',
                  py: 0.5
                }}
              >
                Акт работ
              </Button>
            )}
            <Button
              onClick={handlePrint}
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{
                bgcolor: '#e74c3c',
                ml: 1,
                '&:hover': { bgcolor: '#c0392b' },
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              Акт приема
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 0 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ mb: 3 }}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Основная" icon={<AssignmentIcon />} />
            <Tab label="Товары" icon={<ProductsIcon />} />
            <Tab label="Работы" icon={<BuildIcon />} />
            <Tab label="Акт приема" icon={<ActIcon />} />
          </Tabs>

          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="name"
                  label="Имя клиента *"
                  value={formData.name}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  error={!formData.name}
                  helperText={!formData.name && "Обязательное поле"}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                />
                <TextField
                  name="phone"
                  label="Телефон *"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  error={!formData.phone}
                  helperText={!formData.phone && "Обязательное поле"}
                  variant="outlined"
                  size="small"
                />

                <FormGroup row sx={{ my: 2, justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={<Checkbox
                      checked={formData.isDeviceWithClient}
                      onChange={handleFieldChange}
                      name="isDeviceWithClient"
                      color="primary"
                    />}
                    label="Аппарат у клиента"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      checked={formData.isUrgent}
                      onChange={handleFieldChange}
                      name="isUrgent"
                      color="warning"
                    />}
                    label="Срочный заказ"
                    sx={{ color: formData.isUrgent ? '#e67e22' : 'inherit' }}
                  />
                  <FormControlLabel
                    control={<Checkbox
                      checked={formData.needDelivery}
                      onChange={handleFieldChange}
                      name="needDelivery"
                      color="success"
                    />}
                    label="Требуется доставка"
                  />
                </FormGroup>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Принял</InputLabel>
                  <Select
                    name="acceptedBy"
                    value={formData.acceptedBy}
                    onChange={handleFieldChange}
                    label="Принял"
                  >
                    {users.map(user => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} ({user.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Выполнил ремонт</InputLabel>
                  <Select
                    name="repairedBy"
                    value={formData.repairedBy}
                    onChange={handleFieldChange}
                    label="Выполнил ремонт"
                  >
                    {users.filter(u => u.role === 'Мастер').map(user => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Тип устройства *</InputLabel>
                  <Select
                    name="deviceType"
                    value={formData.deviceType}
                    onChange={handleFieldChange}
                    label="Тип устройства *"
                    error={!formData.deviceType}
                  >
                    {DEVICE_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  name="brand"
                  label="Бренд"
                  value={formData.brand}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                />
                <TextField
                  name="model"
                  label="Модель"
                  value={formData.model}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Дата приёма"
                    value={formData.acceptedAt}
                    onChange={(newValue) => setFormData({ ...formData, acceptedAt: newValue })}
                    inputFormat="dd.MM.yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Внешний вид</InputLabel>
                  <Select
                    name="appearance"
                    value={formData.appearance}
                    onChange={handleFieldChange}
                    label="Внешний вид"
                  >
                    {APPEARANCE_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  name="completeness"
                  label="Комплектация"
                  value={formData.completeness}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="small"
                />

                <TextField
                  name="issueDescription"
                  label="Описание проблемы *"
                  value={formData.issueDescription}
                  onChange={handleFieldChange}
                  fullWidth
                  margin="normal"
                  multiline
                  minRows={3}
                  error={!formData.issueDescription}
                  helperText={!formData.issueDescription && "Обязательное поле"}
                  variant="outlined"
                  size="small"
                />

                <TextField
                  name="agreementAmount"
                  label="Сумма согласования"
                  value={formData.agreementAmount}
                  onChange={handleFieldChange}
                  type="number"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₽</InputAdornment>
                  }}
                  variant="outlined"
                  size="small"
                />

                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Мастер</InputLabel>
                  <Select
                    name="master"
                    value={formData.master}
                    onChange={handleFieldChange}
                    label="Мастер"
                  >
                    {masters.map(master => (
                      <MenuItem key={master._id} value={master._id}>{master.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Источник заказа</InputLabel>
                  <Select
                    name="source"
                    value={formData.source}
                    onChange={handleFieldChange}
                    label="Источник заказа"
                  >
                    {sources.map(source => (
                      <MenuItem key={source._id} value={source._id}>{source.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Вид заказа</InputLabel>
                  <Select
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleFieldChange}
                    label="Вид заказа"
                  >
                    {ORDER_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 3, borderTop: '1px solid #eee', pt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Дополнительные поля
                  </Typography>

                  {formData.extraFields?.map((field, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: '1px solid #eee',
                        borderRadius: 1,
                        backgroundColor: '#f9f9f9'
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                          <TextField
                            label="Название поля"
                            value={field.label}
                            onChange={(e) => handleExtraFieldChange(idx, 'label', e.target.value)}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={5}>
                          {renderExtraFieldInput(field, idx)}
                        </Grid>
                        <Grid item xs={2} sx={{ textAlign: 'right' }}>
                          <IconButton
                            onClick={() => handleRemoveExtraField(idx)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddExtraField}
                    sx={{ mt: 1 }}
                  >
                    Добавить поле
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Товары для ремонта
              </Typography>

              {formData.usedProducts.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Наименование</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Количество</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Цена</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Сумма</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 80 }}>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.usedProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductQuantityChange(index, e.target.value)}
                              inputProps={{ min: 1 }}
                              size="small"
                              sx={{ width: 80 }}
                              variant="standard"
                            />
                          </TableCell>
                          <TableCell>{product.price.toLocaleString()} ₽</TableCell>
                          <TableCell>{product.total.toLocaleString()} ₽</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleRemoveProductFromOrder(index)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ borderTop: '2px solid #eee' }}>
                        <TableCell colSpan={3} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                          Итого:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {formData.usedProducts.reduce((sum, item) => sum + item.total, 0).toLocaleString()} ₽
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  p: 3,
                  border: '1px dashed #ddd',
                  borderRadius: 2,
                  mb: 2
                }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#777' }}>
                    Товары не добавлены
                  </Typography>
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>
                Доступные товары
              </Typography>

              <Paper sx={{ maxHeight: 300, overflow: 'auto', p: 1 }}>
                <List>
                  {products.map(product => (
                    <ListItem
                      key={product._id}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleAddProductToOrder(product)}
                          startIcon={<AddIcon />}
                        >
                          Добавить
                        </Button>
                      }
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={product.name}
                        secondary={`${product.price.toLocaleString()} ₽`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Выполненные работы
              </Typography>

              {formData.performedServices.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Наименование</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Количество</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Цена</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Сумма</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 80 }}>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.performedServices.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={service.quantity}
                              onChange={(e) => handleServiceQuantityChange(index, e.target.value)}
                              size="small"
                              sx={{ width: 80 }}
                              variant="standard"
                            />
                          </TableCell>
                          <TableCell>{service.price.toLocaleString()} ₽</TableCell>
                          <TableCell>{service.total.toLocaleString()} ₽</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleRemoveServiceFromOrder(index)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ borderTop: '2px solid #eee' }}>
                        <TableCell colSpan={3} sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                          Итого:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {formData.performedServices.reduce((sum, item) => sum + item.total, 0).toLocaleString()} ₽
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  p: 3,
                  border: '1px dashed #ddd',
                  borderRadius: 2,
                  mb: 2
                }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#777' }}>
                    Работы не добавлены
                  </Typography>
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>
                Доступные работы
              </Typography>

              <Paper sx={{ maxHeight: 300, overflow: 'auto', p: 1 }}>
                <List>
                  {services.map(service => (
                    <ListItem
                      key={service._id}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleAddServiceToOrder(service)}
                          startIcon={<AddIcon />}
                        >
                          Добавить
                        </Button>
                      }
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={service.name}
                        secondary={`${service.price.toLocaleString()} ₽`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
          {currentTab === 3 && (
            <Box ref={printRef} sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Акт приема оборудования в ремонт
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  № {formData.orderNumber} от {new Date(formData.acceptedAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Дата приема:</strong> {new Date(formData.acceptedAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Клиент:</strong> {formData.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Телефон:</strong> {formData.phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Устройство:</strong> {formData.deviceType} {formData.brand} {formData.model}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Серийный номер:</strong> {formData.serialNumber || 'не указан'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Комплектация:</strong> {formData.completeness}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Внешний вид:</strong> {formData.appearance}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Описание проблемы:</strong> {formData.issueDescription}
                  </Typography>
                </Grid>
              </Grid>
              {formData.usedProducts.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}>
                    Используемые материалы
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Наименование</TableCell>
                        <TableCell align="right">Количество</TableCell>
                        <TableCell align="right">Цена</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.usedProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">{product.quantity}</TableCell>
                          <TableCell align="right">{product.price.toLocaleString()} ₽</TableCell>
                          <TableCell align="right">{product.total.toLocaleString()} ₽</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>Итого:</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formData.usedProducts.reduce((sum, item) => sum + item.total, 0).toLocaleString()} ₽
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}
              {formData.performedServices.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}>
                    Выполняемые работы
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Наименование</TableCell>
                        <TableCell align="right">Количество</TableCell>
                        <TableCell align="right">Цена</TableCell>
                        <TableCell align="right">Сумма</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.performedServices.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell align="right">{service.quantity}</TableCell>
                          <TableCell align="right">{service.price.toLocaleString()} ₽</TableCell>
                          <TableCell align="right">{service.total.toLocaleString()} ₽</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>Итого:</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formData.performedServices.reduce((sum, item) => sum + item.total, 0).toLocaleString()} ₽
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              <Box sx={{ mt: 3, borderTop: '2px solid #000', pt: 2 }}>
                <Typography variant="h6" align="right">
                  Итого: {calculateTotal().toLocaleString()} ₽
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Принял:</strong> {masters.find(m => m._id === formData.master)?.name || 'не указан'}
                  </Typography>
                  <Box sx={{ mt: 3, borderTop: '1px solid #000', width: '80%', pt: 1 }}>
                    <Typography variant="body2" align="center">
                      (подпись)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Сдал:</strong> {formData.name}
                  </Typography>
                  <Box sx={{ mt: 3, borderTop: '1px solid #000', width: '80%', pt: 1 }}>
                    <Typography variant="body2" align="center">
                      (подпись)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  * Оборудование принято на ремонт. Гарантийный срок ремонта составляет 30 дней.
                  <br />
                  * В случае гарантийного случая в течение этого срока, ремонт производится бесплатно.
                </Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">QR-код для клиента</Typography>
              <QRCodeSVG
                value={`Заказ №${formData.orderNumber}`}
                size={100}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">Штрих-код для сервиса</Typography>
              <Barcode
                value={formData._id || formData.orderNumber.toString()}
                width={1.5}
                height={50}
                displayValue={false}
              />
            </Box>
          </Box>

          )
          <Typography variant="h6" align="center" sx={{ mt: 4 }}></Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{ color: '#f44336', borderColor: '#f44336' }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.name || !formData.phone || !formData.issueDescription}
            startIcon={<SaveIcon />}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
              '&:hover': {
                boxShadow: '0 3px 8px 4px rgba(33, 150, 243, .4)',
              },
            }}
          >
            {isEditing ? 'Обновить заказ' : 'Создать заказ'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог кастомных полей */}
      <Dialog
        open={openCustomFieldDialog}
        onClose={() => setOpenCustomFieldDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{
          bgcolor: '#9b59b6',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {editingField?._id ? 'Редактирование кастомного поля' : 'Добавление кастомного поля'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            label="Название поля *"
            fullWidth
            margin="normal"
            value={editingField?.label || ''}
            onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Тип поля *</InputLabel>
            <Select
              value={editingField?.fieldType || 'text'}
              onChange={(e) => setEditingField({ ...editingField, fieldType: e.target.value })}
              label="Тип поля"
            >
              <MenuItem value="text">Текст</MenuItem>
              <MenuItem value="checkbox">Чекбокс</MenuItem>
              <MenuItem value="select">Выпадающий список</MenuItem>
              <MenuItem value="date">Дата</MenuItem>
            </Select>
          </FormControl>
          {editingField?.fieldType === 'select' && (
            <TextField
              label="Варианты выбора (через запятую)"
              fullWidth
              margin="normal"
              value={editingField?.options ? editingField.options.join(', ') : ''}
              onChange={(e) => setEditingField({ ...editingField, options: e.target.value.split(',').map(s => s.trim()) })}
              helperText="Введите варианты через запятую"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCustomFieldDialog(false)} variant="outlined">
            Отмена
          </Button>
          <Button
            onClick={handleSaveCustomField}
            variant="contained"
            color="primary"
            disabled={!editingField?.label}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог работ */}
      <Dialog
        open={openServiceDialog}
        onClose={() => setOpenServiceDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{
          bgcolor: '#3498db',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {editingService?._id ? 'Редактирование работы' : 'Добавление работы'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            label="Наименование работы *"
            fullWidth
            margin="normal"
            value={editingService?.name || ''}
            onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
          />
          <TextField
            label="Категория"
            fullWidth
            margin="normal"
            value={editingService?.category || ''}
            onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
          />
          <TextField
            label="Цена *"
            type="number"
            fullWidth
            margin="normal"
            value={editingService?.price || 0}
            onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
            InputProps={{ startAdornment: <InputAdornment position="start">₽</InputAdornment> }}
          />
          <TextField
            label="Описание"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={editingService?.description || ''}
            onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServiceDialog(false)} variant="outlined">
            Отмена
          </Button>
          <Button
            onClick={handleSaveService}
            variant="contained"
            color="primary"
            disabled={!editingService?.name || !editingService?.price}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Плавающая кнопка добавления */}
      <Zoom in={!openDialog}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddCustomer}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.5)',
            '&:hover': {
              boxShadow: '0 6px 24px rgba(33, 150, 243, 0.7)',
              transform: 'scale(1.05)'
            }
          }}
        >

          <AddIcon />
        </Fab>
      </Zoom>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container >
  );
};

export default CustomerDashboard;