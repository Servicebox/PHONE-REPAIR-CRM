import React, { useState } from 'react';
import {
    Box, TextField, Button, Avatar, Typography,
    FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
    Paper
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const UserSettings = ({ user, onSave }) => {
    const [formData, setFormData] = useState({
        ...user,
        password: ''
    });
    const [salaryType, setSalaryType] = useState(user.salaryType || 'fixed');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            salarySettings: {
                ...formData.salarySettings,
                [name]: value
            }
        });
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Настройки пользователя
            </Typography>

            <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                    src={formData.avatar}
                    sx={{ width: 100, height: 100, mr: 3 }}
                />
                <Box>
                    <Button variant="outlined" sx={{ mr: 2 }}>Изменить аватар</Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                        Удалить
                    </Button>
                </Box>
            </Box>

            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Имя"
                    name="name"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Имя пользователя"
                    name="username"
                    fullWidth
                    value={formData.username || ''}
                    onChange={handleChange}
                />
            </Box>

            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Новый пароль"
                    name="password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Оставьте пустым, чтобы не менять"
                />
            </Box>

            <Button variant="outlined" sx={{ mb: 3 }}>
                Пригласить сотрудника по Email
            </Button>

            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Должность"
                    name="position"
                    fullWidth
                    value={formData.position || ''}
                    onChange={handleChange}
                />
                <TextField
                    label="Контактный телефон"
                    name="phone"
                    fullWidth
                    value={formData.phone || ''}
                    onChange={handleChange}
                />
            </Box>

            <TextField
                label="Telegram"
                name="telegram"
                fullWidth
                value={formData.telegram || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Права</InputLabel>
                <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Права"
                >
                    <MenuItem value="Супервайзер">Супервайзер</MenuItem>
                    <MenuItem value="Администратор">Администратор</MenuItem>
                    <MenuItem value="Менеджер">Менеджер</MenuItem>
                    <MenuItem value="Мастер">Мастер</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Привязать к локации</InputLabel>
                <Select
                    multiple
                    name="locations"
                    value={formData.locations || []}
                    onChange={handleChange}
                    label="Привязать к локации"
                >
                    <MenuItem value="Офис Северная">Офис Северная</MenuItem>
                    <MenuItem value="Офис Ленина">Офис Ленина</MenuItem>
                </Select>
            </FormControl>

            <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
                Настройки заработной платы
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Тип оплаты</InputLabel>
                <Select
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value)}
                    label="Тип оплаты"
                >
                    <MenuItem value="fixed">Фиксированная</MenuItem>
                    <MenuItem value="percentage">Процент от выручки</MenuItem>
                </Select>
            </FormControl>

            {salaryType === 'fixed' ? (
                <TextField
                    label="Фиксированная зарплата"
                    name="fixedSalary"
                    type="number"
                    fullWidth
                    value={formData.salarySettings?.fixedSalary || ''}
                    onChange={handleSalaryChange}
                    sx={{ mb: 2 }}
                />
            ) : (
                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="% от услуг"
                        name="servicePercentage"
                        type="number"
                        fullWidth
                        value={formData.salarySettings?.servicePercentage || ''}
                        onChange={handleSalaryChange}
                    />
                    <TextField
                        label="% от товаров"
                        name="productPercentage"
                        type="number"
                        fullWidth
                        value={formData.salarySettings?.productPercentage || ''}
                        onChange={handleSalaryChange}
                    />
                </Box>
            )}

            <TextField
                label="Комментарий"
                name="comment"
                fullWidth
                multiline
                rows={3}
                value={formData.comment || ''}
                onChange={handleChange}
                sx={{ mb: 2 }}
            />

            <Button
                variant="contained"
                onClick={() => onSave(formData)}
            >
                Сохранить изменения
            </Button>
        </Paper>
    );
};

export default UserSettings;