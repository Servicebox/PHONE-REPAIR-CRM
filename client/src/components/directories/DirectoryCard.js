/* eslint-disable no-undef */
// components/directories/DirectoryCard.jsx
import React from 'react';
import {
    Card, CardContent, CardActionArea,
    Typography, Chip, Box, IconButton, Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Business as BusinessIcon,
    Devices as DevicesIcon,
    Factory as FactoryIcon,
    PhoneIphone as PhoneIphoneIcon,
    Construction as ConstructionIcon,
    Warehouse as WarehouseIcon
} from '@mui/icons-material';
import { useDirectories } from '../../contexts/DirectoriesContext';
import { useNavigate } from 'react-router-dom';

const iconComponents = {
    counterparties: BusinessIcon,
    'device-types': DevicesIcon,
    manufacturers: FactoryIcon,
    models: PhoneIphoneIcon,
    'service-types': ConstructionIcon,
    warehouses: WarehouseIcon,
};

const DirectoryCard = ({ directory, onClick }) => {
    const { deleteDirectory } = useDirectories();
    const navigate = useNavigate();
    const IconComponent = iconComponents[directory.id] || FolderIcon;
    const itemCount = directory.items?.length || 0;

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/directories/${directory.id}/edit`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Удалить справочник "${directory.name}"?`)) {
            deleteDirectory(directory.id);
        }
    };

    return (
        <Card
            sx={{
                borderRadius: 3,
                overflow: 'visible',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2
                    }}>
                        <Box sx={{
                            bgcolor: '#e3f2fd',
                            p: 1.5,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <IconComponent sx={{ fontSize: 32, color: '#1976d2' }} />
                        </Box>

                        <Box>
                            <Tooltip title="Редактировать">
                                <IconButton
                                    onClick={handleEdit}
                                    sx={{ color: '#1976d2', mr: 1 }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                                <IconButton
                                    onClick={handleDelete}
                                    sx={{ color: '#e53935' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {directory.name}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        <Chip
                            label={`${itemCount} ${itemCount === 1 ? 'элемент' : 'элементов'}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            label={`${directory.fields.length} полей`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                        />
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default DirectoryCard;