// components/directories/CreateDirectoryModal.jsx
import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, Box, Typography, Chip
} from '@mui/material';
import { useDirectories } from '../../contexts/DirectoriesContext';

const CreateDirectoryModal = ({ open, onClose }) => {
    const { addDirectory } = useDirectories();
    const [directoryData, setDirectoryData] = useState({
        name: '',
        id: '',
        icon: 'Folder'
    });
    const [error, setError] = useState('');

    const handleChange = (key, value) => {
        setDirectoryData({ ...directoryData, [key]: value });

        if (key === 'name' && !directoryData.id) {
            // Генерация ID на основе названия
            const generatedId = value
                .toLowerCase()
                .replace(/[^a-z0-9а-яё]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            setDirectoryData(prev => ({ ...prev, id: generatedId }));
        }
    };

    const handleSubmit = () => {
        if (!directoryData.name.trim()) {
            setError('Название обязательно');
            return;
        }

        if (!directoryData.id.trim()) {
            setError('ID обязательно');
            return;
        }

        const newDirectory = {
            ...directoryData,
            fields: [
                { id: 'name', name: 'Наименование', type: 'text', required: true }
            ],
            items: []
        };

        addDirectory(newDirectory);
        onClose();
        setDirectoryData({ name: '', id: '', icon: 'Folder' });
        setError('');
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ bgcolor: '#2196f3', color: 'white' }}>
                Создание нового справочника
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Название справочника *"
                            fullWidth
                            value={directoryData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            error={!!error && !directoryData.name}
                            helperText={error && !directoryData.name ? error : ''}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="ID справочника *"
                            fullWidth
                            value={directoryData.id}
                            onChange={(e) => handleChange('id', e.target.value)}
                            error={!!error && !directoryData.id}
                            helperText={error && !directoryData.id ? error : "Уникальный идентификатор (латинские буквы, цифры и дефисы)"}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            После создания вы сможете добавить дополнительные поля и настроить справочник.
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ bgcolor: '#2196f3', color: 'white' }}
                    disabled={!directoryData.name || !directoryData.id}
                >
                    Создать справочник
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateDirectoryModal;