// src/components/payments/PaymentsPage.js
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Box
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';

const PaymentsPage = () => {
    const [payments, setPayments] = useState([
        { id: 1, date: '2023-10-15', orderNumber: 'ORD-12345', customer: 'Иванов И.И.', amount: 3500, method: 'Наличные', status: 'Оплачено' },
        { id: 2, date: '2023-10-14', orderNumber: 'ORD-12344', customer: 'Петров П.П.', amount: 2500, method: 'Карта', status: 'Оплачено' },
        { id: 3, date: '2023-10-13', orderNumber: 'ORD-12343', customer: 'Сидоров С.С.', amount: 5000, method: 'Перевод', status: 'Ожидание' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredPayments = payments.filter(payment =>
        payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Управление платежами</Typography>
                <Button variant="contained" startIcon={<AddIcon />}>
                    Добавить платеж
                </Button>
            </Box>

            <TextField
                label="Поиск платежей"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3, width: 300 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Дата</TableCell>
                            <TableCell>№ Заказа</TableCell>
                            <TableCell>Клиент</TableCell>
                            <TableCell>Сумма</TableCell>
                            <TableCell>Способ оплаты</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPayments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.orderNumber}</TableCell>
                                <TableCell>{payment.customer}</TableCell>
                                <TableCell>{payment.amount} ₽</TableCell>
                                <TableCell>{payment.method}</TableCell>
                                <TableCell>
                                    <Box
                                        component="span"
                                        sx={{
                                            p: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: payment.status === 'Оплачено' ? '#4caf50' : '#ff9800',
                                            color: 'white'
                                        }}
                                    >
                                        {payment.status}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Button size="small" variant="outlined">
                                        Подробнее
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PaymentsPage;