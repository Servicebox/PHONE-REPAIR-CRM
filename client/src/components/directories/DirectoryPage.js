// components/directories/DirectoryPage.jsx
import React, { useState } from 'react';
import {
    Container, Box, Typography, Button,
    TextField, Paper, Table,
    TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Tooltip,
    Chip, Tabs, Tab
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDirectories } from '../../contexts/DirectoriesContext';
import DirectoryItemForm from './DirectoryItemForm';
import DirectorySettings from './DirectorySettings';

const DirectoryPage = () => {
    const { directoryId } = useParams();

    const { directories, addItem, updateItem, deleteItem } = useDirectories();
    const [openForm, setOpenForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTab, setCurrentTab] = useState('items');

    const directory = directories.find(dir => dir.id === directoryId);

    if (!directory) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4 }}>
                    Справочник не найден
                </Typography>
            </Container>
        );
    }

    const filteredItems = directory.items.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleAddItem = () => {
        setEditItem(null);
        setOpenForm(true);
    };

    const handleEditItem = (item) => {
        setEditItem(item);
        setOpenForm(true);
    };

    const handleSaveItem = (itemData) => {
        if (editItem) {
            updateItem(directoryId, editItem.id, itemData);
        } else {
            addItem(directoryId, { id: Date.now().toString(), ...itemData });
        }
        setOpenForm(false);
    };

    const handleDeleteItem = (itemId) => {
        if (window.confirm('Удалить этот элемент?')) {
            deleteItem(directoryId, itemId);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
                        {directory.name}
                    </Typography>
                    <Chip
                        label={`${directory.items.length} элементов`}
                        color="primary"
                        size="small"
                    />
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                    sx={{
                        background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                        color: 'white',
                        boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                        '&:hover': {
                            boxShadow: '0 3px 8px 4px rgba(76, 175, 80, .4)',
                        },
                    }}
                >
                    Добавить элемент
                </Button>
            </Box>

            <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{ mb: 3 }}
            >
                <Tab label="Элементы" value="items" />
                <Tab
                    label="Настройки справочника"
                    value="settings"
                    icon={<SettingsIcon />}
                    iconPosition="start"
                />
            </Tabs>

            {currentTab === 'items' ? (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Поиск элементов..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                            }}
                            sx={{ width: 300 }}
                        />
                    </Box>

                    <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                                <TableRow>
                                    {directory.fields.map((field) => (
                                        <TableCell key={field.id} sx={{ fontWeight: 'bold' }}>
                                            {field.name}
                                            {field.required && <span style={{ color: 'red' }}>*</span>}
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        hover
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                            }
                                        }}
                                    >
                                        {directory.fields.map((field) => (
                                            <TableCell key={`${item.id}-${field.id}`}>
                                                {renderFieldValue(item[field.id], field.type)}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <Tooltip title="Редактировать">
                                                <IconButton
                                                    onClick={() => handleEditItem(item)}
                                                    sx={{ color: '#1976d2' }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    sx={{ color: '#e53935' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                <DirectorySettings directory={directory} />
            )}

            <DirectoryItemForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                directory={directory}
                item={editItem}
                onSave={handleSaveItem}
            />
        </Container>
    );
};

// Вспомогательная функция для отображения значений
const renderFieldValue = (value, type) => {
    if (value === undefined || value === null) return '-';

    switch (type) {
        case 'boolean':
            return value ? 'Да' : 'Нет';
        case 'date':
            return new Date(value).toLocaleDateString();
        case 'select':
            return Array.isArray(value) ? value.join(', ') : value;
        default:
            return value;
    }
};

export default DirectoryPage;