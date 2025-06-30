import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControlLabel, Checkbox, Typography, Paper, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const GeneralSettings = () => {
    const [settings, setSettings] = useState({
        companyName: '',
        address: '',
        phone: '',
        email: '',
        currency: '₽',
        timezone: 'Europe/Moscow',
        autoOrderNumber: true,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Загрузка настроек при монтировании
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/settings/system');
                const data = await response.json();
                if (data) {
                    setSettings(data);
                }
            } catch (error) {
                showSnackbar('Ошибка загрузки настроек', 'error');
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:9000/api/settings/system', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                showSnackbar('Настройки успешно сохранены', 'success');
            } else {
                const errorData = await response.json();
                showSnackbar(errorData.message || 'Ошибка сохранения', 'error');
            }
        } catch (error) {
            showSnackbar('Сетевая ошибка', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Основные настройки системы
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    label="Название компании"
                    name="companyName"
                    value={settings.companyName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Адрес"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Телефон"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    type="email"
                />

                <TextField
                    label="Валюта"
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Часовой пояс"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    select
                    SelectProps={{ native: true }}
                >
                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                    <option value="Europe/Kaliningrad">Калининград (UTC+2)</option>
                    <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                </TextField>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={settings.autoOrderNumber}
                            onChange={handleChange}
                            name="autoOrderNumber"
                        />
                    }
                    label="Автоматическая нумерация заказов"
                    sx={{ mt: 2 }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Сохранить настройки
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </Paper>
    );
};

export default GeneralSettings;
