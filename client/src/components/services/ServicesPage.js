import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Button, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Box, Typography
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const API = 'http://localhost:9000/api';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API}/services`);
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (currentService._id) {
                await axios.patch(`${API}/services/${currentService._id}`, currentService);
            } else {
                await axios.post(`${API}/services`, currentService);
            }
            fetchServices();
            setOpenDialog(false);
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/services/${id}`);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    return (
        <Container maxWidth="lg" className="services-page">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Управление услугами</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setCurrentService({ name: '', price: 0, description: '' });
                        setOpenDialog(true);
                    }}
                >
                    Добавить услугу
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Наименование</TableCell>
                            <TableCell>Цена</TableCell>
                            <TableCell>Категория</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service._id}>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.price} ₽</TableCell>
                                <TableCell>{service.category}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => {
                                        setCurrentService(service);
                                        setOpenDialog(true);
                                    }}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(service._id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{currentService?._id ? 'Редактирование услуги' : 'Новая услуга'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Наименование"
                        fullWidth
                        margin="normal"
                        value={currentService?.name || ''}
                        onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                    />
                    <TextField
                        label="Цена"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={currentService?.price || 0}
                        onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                    />
                    <TextField
                        label="Категория"
                        fullWidth
                        margin="normal"
                        value={currentService?.category || ''}
                        onChange={(e) => setCurrentService({ ...currentService, category: e.target.value })}
                    />
                    <TextField
                        label="Описание"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={currentService?.description || ''}
                        onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                    <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ServicesPage;