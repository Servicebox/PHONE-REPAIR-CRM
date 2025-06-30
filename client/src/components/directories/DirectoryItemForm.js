// components/directories/DirectoryItemForm.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select,
    MenuItem, Grid, Box, Typography, FormControlLabel,
    Checkbox, Chip, Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DirectoryItemForm = ({ open, onClose, directory, item, onSave }) => {
    const [formData, setFormData] = useState({});
    const isEditMode = !!item;

    useEffect(() => {
        if (isEditMode) {
            setFormData({ ...item });
        } else {
            // Инициализация пустой формы
            const initialData = {};
            directory.fields.forEach(field => {
                initialData[field.id] = field.type === 'boolean' ? false : '';
            });
            setFormData(initialData);
        }
    }, [item, directory, isEditMode]);

    const handleChange = (fieldId, value) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{
                bgcolor: '#2196f3',
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {isEditMode ? 'Редактирование элемента' : 'Новый элемент'}
                <Chip
                    label={directory.name}
                    size="small"
                    sx={{ bgcolor: 'white', color: '#2196f3', fontWeight: 'bold' }}
                />
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                    {directory.fields.map((field) => (
                        <Grid item xs={12} md={6} key={field.id}>
                            {renderFieldInput(field, formData[field.id], handleChange)}
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid #eee' }}>
                <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                        color: 'white',
                        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                    }}
                >
                    {isEditMode ? 'Обновить' : 'Создать'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const renderFieldInput = (field, value, onChange) => {
    const handleInputChange = (e) => {
        onChange(field.id, e.target.value);
    };

    switch (field.type) {
        case 'text':
            return (
                <TextField
                    label={field.name}
                    fullWidth
                    value={value || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    multiline={field.multiline}
                    rows={field.multiline ? 4 : 1}
                    variant="outlined"
                />
            );

        case 'number':
            return (
                <TextField
                    label={field.name}
                    fullWidth
                    type="number"
                    value={value || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    variant="outlined"
                />
            );

        case 'boolean':
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!value}
                            onChange={(e) => onChange(field.id, e.target.checked)}
                            color="primary"
                        />
                    }
                    label={field.name}
                />
            );

        case 'date':
            return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label={field.name}
                        value={value || null}
                        onChange={(newValue) => onChange(field.id, newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            );

        case 'select':
            return (
                <FormControl fullWidth>
                    <InputLabel>{field.name}</InputLabel>
                    <Select
                        value={value || ''}
                        label={field.name}
                        onChange={handleInputChange}
                        multiple={field.multiple}
                    >
                        {field.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );

        default:
            return (
                <TextField
                    label={field.name}
                    fullWidth
                    value={value || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    variant="outlined"
                />
            );
    }
};

export default DirectoryItemForm;