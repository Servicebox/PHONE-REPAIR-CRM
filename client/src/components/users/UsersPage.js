/* eslint-disable no-undef */
// components/users/UsersPage.js
import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, IconButton, Box, Typography,

} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import UserSettings from './UserSettings';

const API = 'http://localhost:9000/api';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            if (userData._id) {
                await axios.patch(`${API}/users/${userData._id}`, userData);
            } else {
                await axios.post(`${API}/users`, userData);
            }
            fetchUsers();
            setEditMode(false);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`${API}/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Управление пользователями</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setCurrentUser({
                            name: '',
                            email: '',
                            role: 'Мастер',
                            password: '',
                            salaryType: 'fixed',
                            salarySettings: {}
                        });
                        setEditMode(true);
                    }}
                >
                    Добавить пользователя
                </Button>
            </Box>

            {!editMode ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Имя</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Роль</TableCell>
                                <TableCell>Локации</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{(user.locations || []).join(', ')}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            setCurrentUser(user);
                                            setEditMode(true);
                                        }}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(user._id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <UserSettings
                    user={currentUser}
                    onSave={handleSaveUser}
                    onCancel={() => setEditMode(false)}
                />
            )}
        </Container>
    );
};

export default UsersPage;