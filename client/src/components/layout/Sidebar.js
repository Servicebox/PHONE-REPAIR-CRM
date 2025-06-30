import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
    Build as BuildIcon,
    Payment as PaymentIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
    Business as BusinessIcon,
    Devices as DevicesIcon,
    Factory as FactoryIcon,
    PhoneIphone as PhoneIphoneIcon,
    Construction as ConstructionIcon,
    Warehouse as WarehouseIcon
} from '@mui/icons-material';

const Sidebar = () => {
    const location = useLocation();

    // Основные пункты меню
    const menuItems = [
        { text: 'Заказы', path: '/', icon: <DashboardIcon /> },
        { text: 'Товары', path: '/products', icon: <ShoppingCartIcon /> },
        { text: 'Услуги', path: '/services', icon: <BuildIcon /> },
        { text: 'Платежи', path: '/payments', icon: <PaymentIcon /> },
        { text: 'Пользователи', path: '/users', icon: <PeopleIcon /> },
        { text: 'Настройки', path: '/settings', icon: <SettingsIcon /> },
    ];

    // Справочники
    const directories = [
        { type: 'counterparties', text: 'Контрагенты', icon: <BusinessIcon /> },
        { type: 'device-types', text: 'Виды изделий', icon: <DevicesIcon /> },
        { type: 'manufacturers', text: 'Производители', icon: <FactoryIcon /> },
        { type: 'models', text: 'Модели', icon: <PhoneIphoneIcon /> },
        { type: 'service-types', text: 'Виды работ', icon: <ConstructionIcon /> },
        { type: 'warehouses', text: 'Склады', icon: <WarehouseIcon /> },
    ];

    return (
        <div className="sidebar">
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        className="sidebar-item"
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#e0e0e0',
                                '&:hover': {
                                    backgroundColor: '#d5d5d5'
                                }
                            }
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>

            <Divider />

            <Typography variant="subtitle2" sx={{ pl: 2, pt: 2, fontWeight: 'bold', color: '#7f8c8d' }}>
                Справочники
            </Typography>

            <List>
                {directories.map((dir) => (
                    <ListItem
                        key={dir.type}
                        component={Link}
                        to={`/directories/${dir.type}`}
                        selected={location.pathname === `/directories/${dir.type}`}
                        className="sidebar-subitem"
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#e0e0e0',
                                '&:hover': {
                                    backgroundColor: '#d5d5d5'
                                }
                            }
                        }}
                    >
                        <ListItemIcon>{dir.icon}</ListItemIcon>
                        <ListItemText primary={dir.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Sidebar;