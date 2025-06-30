import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Grid, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Chip, Box
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ReferencesPage.css'
const API = 'http://localhost:9000/api';

const directoryTypes = {
  'counterparties': 'Контрагенты',
  'device-types': 'Виды изделий',
  'manufacturers': 'Производители',
  'models': 'Модели',
  'service-types': 'Виды работ',
  'warehouses': 'Склады'
};

const ReferencePage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [references, setReferences] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReferences();

    // Для моделей загружаем производителей
    if (type === 'models') {
      axios.get(`${API}/references/manufacturers`)
        .then(res => setParentOptions(res.data))
        .catch(err => console.error(err));
    }
  }, [type]);

  const fetchReferences = () => {
    axios.get(`${API}/references/${type}`)
      .then(res => setReferences(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    const method = currentItem._id ? 'patch' : 'post';
    const url = currentItem._id ? `${API}/references/${currentItem._id}` : `${API}/references`;

    axios[method](url, currentItem)
      .then(() => {
        fetchReferences();
        setOpenDialog(false);
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`${API}/references/${id}`)
      .then(fetchReferences)
      .catch(err => console.error(err));
  };

  const filteredReferences = references.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FolderIcon sx={{ fontSize: 40, color: '#3498db', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {directoryTypes[type] || 'Справочник'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            label="Поиск"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setCurrentItem({ name: '', description: '', type });
              setOpenDialog(true);
            }}
            sx={{ mb: 2, width: { xs: '100%', md: 'auto' } }}
          >
            Добавить запись
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Описание</TableCell>
                    {type === 'models' && <TableCell sx={{ fontWeight: 'bold' }}>Производитель</TableCell>}
                    <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReferences.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={item.name}
                            sx={{
                              bgcolor: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 'bold',
                              borderRadius: 1
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      {type === 'models' && (
                        <TableCell>
                          {item.parent?.name || 'Не указан'}
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton onClick={() => {
                          setCurrentItem(item);
                          setOpenDialog(true);
                        }}>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item._id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Диалог редактирования */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: '#3498db', color: 'white' }}>
          {currentItem._id ? 'Редактирование' : 'Новая запись'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            label="Название *"
            fullWidth
            margin="normal"
            value={currentItem.name || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
          />

          <TextField
            label="Описание"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentItem.description || ''}
            onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
          />

          {type === 'models' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Производитель *</InputLabel>
              <Select
                value={currentItem.parent?._id || ''}
                onChange={(e) => setCurrentItem({ ...currentItem, parent: e.target.value })}
                label="Производитель"
              >
                {parentOptions.map(option => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!currentItem.name || (type === 'models' && !currentItem.parent)}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReferencePage;