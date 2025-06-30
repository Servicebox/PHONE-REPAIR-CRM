// components/directories/DirectoriesPage.jsx
import React, { useState } from 'react';
import {
    Container, Grid, Paper, Typography, Button,
    IconButton, Box, TextField, Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Folder as FolderIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDirectories } from '../../contexts/DirectoriesContext';
import DirectoryCard from './DirectoryCard';
import CreateDirectoryModal from './CreateDirectoryModal';

const DirectoriesPage = () => {
    const { directories } = useDirectories();
    const [searchTerm, setSearchTerm] = useState('');
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const navigate = useNavigate();

    const filteredDirectories = directories.filter(dir =>
        dir.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCardClick = (directoryId) => {
        navigate(`/directories/${directoryId}`);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <FolderIcon sx={{ mr: 2, fontSize: 40, color: '#3498db' }} />
                    Динамические справочники
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Поиск справочников..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateModal(true)}
                        sx={{
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            color: 'white',
                            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                            '&:hover': {
                                boxShadow: '0 3px 8px 4px rgba(33, 203, 243, .4)',
                            },
                        }}
                    >
                        Новый справочник
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {filteredDirectories.map((directory) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={directory.id}>
                        <DirectoryCard
                            directory={directory}
                            onClick={() => handleCardClick(directory.id)}
                        />
                    </Grid>
                ))}
            </Grid>

            <CreateDirectoryModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            />
        </Container>
    );
};

export default DirectoriesPage;