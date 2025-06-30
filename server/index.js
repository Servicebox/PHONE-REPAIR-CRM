const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const CustomField = require('./models/CustomField');
const Order = require('./models/Order');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Master = require('./models/Master');
const Source = require('./models/Source');
const Service = require('./models/Service'); // Импорт модели Service
const Counterparty = require('./models/Counterparty');
const app = express();
const User = require('./models/User');
const SystemSettings = require('./models/SystemSettings');
const productRoutes = require('./routes/productRoutes'); // Добавляем роутер продуктов
const categoryRoutes = require('./routes/categoryRoutes');
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Создаем администратора, если его нет
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'Администратор',
        password: 'admin123'
      });
      await admin.save();
      console.log('Default admin user created');
    }
  })
// Define port
const port = process.env.PORT || 9000;
app.use(cors({
  origin: 'http://localhost:3000', // Разрешаем запросы с фронтенда
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware для обработки ObjectId
app.use((req, res, next) => {
  if (req.body.master === '') req.body.master = null;
  if (req.body.source === '') req.body.source = null;

  // Преобразование extraFields
  if (req.body.extraFields && Array.isArray(req.body.extraFields)) {
    req.body.extraFields = req.body.extraFields.map(field => ({
      label: field.label,
      value: field.value,
      type: field.type
    }));
  }

  next();
});



// Роуты
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);
app.use('/api/customfields', require('./routes/customFieldRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/references', require('./routes/referenceRoutes'));
app.use('/api/products', productRoutes); // Подключаем роутер продуктов
app.use('/api/categories', categoryRoutes);

// Модель для шаблонов
const templateSchema = new mongoose.Schema({
  act_acceptance: String,
  act_completion: String,
  invoice: String,
  warranty: String
}, { collection: 'templates' });

const Template = mongoose.model('Template', templateSchema);

// Получение настроек системы
app.get('/api/settings/system', async (req, res) => {
  try {
    const settings = await SystemSettings.findOne().sort({ createdAt: -1 });
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Сохранение настроек системы
app.post('/api/settings/system', async (req, res) => {
  try {
    let settings = await SystemSettings.findOne().sort({ createdAt: -1 });

    if (settings) {
      settings.set(req.body);
      await settings.save();
      res.json(settings);
    } else {
      const newSettings = new SystemSettings(req.body);
      await newSettings.save();
      res.status(201).json(newSettings);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Роуты для шаблонов
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await Template.findOne();
    if (!templates) {
      // Создаем пустые шаблоны, если не найдены
      const newTemplates = new Template({
        act_acceptance: 'Акт приема оборудования №{order.number}',
        act_completion: 'Акт выполненных работ №{order.number}',
        invoice: 'Счет №{order.number}',
        warranty: 'Гарантийный талон №{order.number}'
      });
      await newTemplates.save();
      res.json(newTemplates);
    } else {
      res.json(templates);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/templates', async (req, res) => {
  try {
    let templates = await Template.findOne();
    if (!templates) {
      templates = new Template(req.body);
    } else {
      templates.set(req.body);
    }
    await templates.save();
    res.json(templates);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Новые роуты
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Роут для типов устройств
app.get('/api/references/device-types', async (req, res) => {
  try {
    const deviceTypes = ['Телефон', 'Ноутбук', 'Планшет', 'Другое'];
    res.json(deviceTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Роуты для контрагентов
app.get('/api/counterparties', async (req, res) => {
  try {
    const counterparties = await Counterparty.find().populate('orders');
    res.json(counterparties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/counterparties', async (req, res) => {
  try {
    const newCounterparty = new Counterparty(req.body);
    await newCounterparty.save();
    res.status(201).json(newCounterparty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Обновим обработчик создания клиента
app.post('/api/customers', async (req, res) => {
  try {
    // Сохранение контрагента
    const { name, phone, email } = req.body;
    let counterparty = await Counterparty.findOne({ phone });

    if (!counterparty) {
      counterparty = new Counterparty({ name, phone, email });
      await counterparty.save();
    }

    // Сохранение заказа с привязкой к контрагенту
    const customerData = { ...req.body, counterparty: counterparty._id };
    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      // Обработка ошибки дублирования ключа
      return res.status(400).json({
        message: 'Duplicate key error',
        field: Object.keys(error.keyPattern)[0],
        value: error.keyValue[Object.keys(error.keyPattern)[0]]
      });
    }
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/masters', async (req, res) => {
  try {
    const masters = await Master.find();
    res.json(masters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // Не возвращаем пароль
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.get('/api/sources', async (req, res) => {
  try {
    const sources = await Source.find();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----- SERVICES -----

// Получить все услуги
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать новую услугу
app.post('/api/services', async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    // Проверка обязательных полей
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newService = new Service({
      name,
      price,
      category: category || '',
      description: description || ''
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Обновить услугу
app.patch('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    // Проверка существования услуги
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Обновление полей
    if (name) service.name = name;
    if (price !== undefined) service.price = price;
    if (category !== undefined) service.category = category;
    if (description !== undefined) service.description = description;

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удалить услугу
app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить все кастомные поля
app.get('/api/customfields', async (req, res) => {
  try {
    const fields = await CustomField.find();
    res.json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавить кастомное поле
app.post('/api/customfields', async (req, res) => {
  try {
    const data = req.body;
    const newField = new CustomField(data);
    await newField.save();
    res.status(201).json(newField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----- ORDERS -----

// Получить список заказов
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('extraFields.fieldId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Добавить заказ
app.post('/api/orders', async (req, res) => {
  try {
    const data = req.body;
    const newOrder = new Order(data);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить один заказ
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('extraFields.fieldId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Изменить заказ
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('extraFields.fieldId');

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удалить заказ
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});