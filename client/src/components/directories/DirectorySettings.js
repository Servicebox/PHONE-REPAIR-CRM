/* eslint-disable react/jsx-no-undef */
// components/directories/DirectorySettings.jsx
import React, { useState } from 'react';
import {
    Box, Typography, Button, TextField,
    FormControl, InputLabel, Select, MenuItem,
    Grid, Paper, IconButton, Tooltip, Chip,
    Divider, FormControlLabel, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useDirectories } from '../../contexts/DirectoriesContext';

const DirectorySettings = ({ directory }) => {
    const { updateDirectory, addField, updateField, deleteField } = useDirectories();
    const [newField, setNewField] = useState({
        id: '',
        name: '',
        type: 'text',
        required: false,
        multiple: false
    });
    const [editField, setEditField] = useState(null);
    const [openFieldDialog, setOpenFieldDialog] = useState(false);
    const [directoryName, setDirectoryName] = useState(directory.name);

    const handleAddField = () => {
        if (!newField.name.trim()) return;

        const fieldToAdd = {
            ...newField,
            id: newField.id || `field-${Date.now()}`
        };

        addField(directory.id, fieldToAdd);
        setNewField({
            id: '',
            name: '',
            type: 'text',
            required: false,
            multiple: false
        });
        setOpenFieldDialog(false);
    };

    const handleSaveField = () => {
        if (!editField.name.trim()) return;

        updateField(directory.id, editField.id, editField);
        setEditField(null);
        setOpenFieldDialog(false);
    };

    const handleMoveField = (index, direction) => {
        const newFields = [...directory.fields];
        const temp = newFields[index];

        if (direction === 'up' && index > 0) {
            newFields[index] = newFields[index - 1];
            newFields[index - 1] = temp;
        } else if (direction === 'down' && index < newFields.length - 1) {
            newFields[index] = newFields[index + 1];
            newFields[index + 1] = temp;
        }

        updateDirectory(directory.id, { fields: newFields });
    };

    const handleSaveName = () => {
        if (directoryName.trim() && directoryName !== directory.name) {
            updateDirectory(directory.id, { name: directoryName });
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Название справочника
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        value={directoryName}
                        onChange={(e) => setDirectoryName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ maxWidth: 400 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSaveName}
                        disabled={!directoryName.trim() || directoryName === directory.name}
                    >
                        Сохранить
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Поля справочника
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditField(null);
                            setOpenFieldDialog(true);
                        }}
                    >
                        Добавить поле
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {directory.fields.map((field, index) => (
                        <Grid item xs={12} key={field.id}>
                            <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography sx={{ fontWeight: 'bold', mr: 1 }}>{field.name}</Typography>
                                        <Chip
                                            label={getFieldTypeLabel(field.type)}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                        {field.required && (
                                            <Chip
                                                label="Обязательное"
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                        {field.multiple && field.type === 'select' && (
                                            <Chip
                                                label="Множественный выбор"
                                                size="small"
                                                sx={{ ml: 1, bgcolor: '#e3f2fd', color: '#1976d2' }}
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        ID: {field.id}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex' }}>
                                    <Tooltip title="Переместить вверх">
                                        <IconButton
                                            onClick={() => handleMoveField(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Переместить вниз">
                                        <IconButton
                                            onClick={() => handleMoveField(index, 'down')}
                                            disabled={index === directory.fields.length - 1}
                                        >
                                            <ArrowDownwardIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Редактировать">
                                        <IconButton
                                            onClick={() => {
                                                setEditField(field);
                                                setOpenFieldDialog(true);
                                            }}
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton
                                            onClick={() => {
                                                if (window.confirm(`Удалить поле "${field.name}"?`)) {
                                                    deleteField(directory.id, field.id);
                                                }
                                            }}
                                        >
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Диалог добавления/редактирования поля */}
            <FieldDialog
                open={openFieldDialog}
                onClose={() => setOpenFieldDialog(false)}
                field={editField || newField}
                onChange={editField ? setEditField : setNewField}
                onSave={editField ? handleSaveField : handleAddField}
                isEdit={!!editField}
            />
        </Paper>
    );
};

const FieldDialog = ({ open, onClose, field, onChange, onSave, isEdit }) => {
    const handleChange = (key, value) => {
        onChange({ ...field, [key]: value });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white' }}>
                {isEdit ? 'Редактирование поля' : 'Добавление нового поля'}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Название поля *"
                            fullWidth
                            value={field.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="ID поля"
                            fullWidth
                            value={field.id}
                            onChange={(e) => handleChange('id', e.target.value)}
                            helperText="Уникальный идентификатор (латинские буквы, цифры и дефисы)"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Тип поля *</InputLabel>
                            <Select
                                value={field.type}
                                label="Тип поля"
                                onChange={(e) => handleChange('type', e.target.value)}
                            >
                                <MenuItem value="text">Текст</MenuItem>
                                <MenuItem value="number">Число</MenuItem>
                                <MenuItem value="boolean">Да/Нет</MenuItem>
                                <MenuItem value="date">Дата</MenuItem>
                                <MenuItem value="select">Выбор из списка</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {field.type === 'select' && (
                        <Grid item xs={12}>
                            <TextField
                                label="Варианты выбора (через запятую)"
                                fullWidth
                                value={field.options?.join(', ') || ''}
                                onChange={(e) => handleChange('options', e.target.value.split(',').map(o => o.trim()))}
                                helperText="Введите варианты через запятую"
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={field.required || false}
                                    onChange={(e) => handleChange('required', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Обязательное поле"
                        />
                    </Grid>

                    {field.type === 'select' && (
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={field.multiple || false}
                                        onChange={(e) => handleChange('multiple', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Множественный выбор"
                            />
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Отмена
                </Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    disabled={!field.name.trim()}
                    sx={{ bgcolor: '#4caf50', color: 'white' }}
                >
                    {isEdit ? 'Обновить' : 'Добавить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const getFieldTypeLabel = (type) => {
    const labels = {
        text: 'Текст',
        number: 'Число',
        boolean: 'Да/Нет',
        date: 'Дата',
        select: 'Выбор'
    };
    return labels[type] || type;
};

export default DirectorySettings;