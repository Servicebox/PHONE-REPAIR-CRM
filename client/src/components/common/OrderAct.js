import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const OrderAct = ({ order, masters }) => {
    const calculateTotal = () => {
        const productsTotal = order.usedProducts?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
        const servicesTotal = order.performedServices?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
        return productsTotal + servicesTotal;
    };

    const getMasterName = (masterId) => {
        const master = masters.find(m => m._id === masterId);
        return master ? master.name : 'Не указан';
    };

    return (
        <Box sx={{ p: 3, border: '1px solid #eee' }}>
            <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
                Акт приема оборудования в ремонт
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1">
                    <strong>Номер заказа:</strong> {order.orderNumber}
                </Typography>
                <Typography variant="body1">
                    <strong>Дата приема:</strong> {new Date(order.acceptedAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                    <strong>Клиент:</strong> {order.name}
                </Typography>
                <Typography variant="body1">
                    <strong>Телефон:</strong> {order.phone}
                </Typography>
                <Typography variant="body1">
                    <strong>Устройство:</strong> {order.deviceType} {order.brand} {order.model}
                </Typography>
                <Typography variant="body1">
                    <strong>Серийный номер:</strong> {order.serialNumber || 'не указан'}
                </Typography>
                <Typography variant="body1">
                    <strong>Комплектация:</strong> {order.completeness}
                </Typography>
                <Typography variant="body1">
                    <strong>Внешний вид:</strong> {order.appearance}
                </Typography>
                <Typography variant="body1">
                    <strong>Описание проблемы:</strong> {order.issueDescription}
                </Typography>
            </Box>

            {order.usedProducts?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Используемые материалы
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Наименование</TableCell>
                                <TableCell>Количество</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell>Сумма</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.usedProducts.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.price} ₽</TableCell>
                                    <TableCell>{product.total} ₽</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            {order.performedServices?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Выполняемые работы
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Наименование</TableCell>
                                <TableCell>Количество</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell>Сумма</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.performedServices.map((service, index) => (
                                <TableRow key={index}>
                                    <TableCell>{service.name}</TableCell>
                                    <TableCell>{service.quantity}</TableCell>
                                    <TableCell>{service.price} ₽</TableCell>
                                    <TableCell>{service.total} ₽</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            <Box sx={{ mt: 3, borderTop: '2px solid #000', pt: 2 }}>
                <Typography variant="h6" align="right">
                    Итого: {calculateTotal()} ₽
                </Typography>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="body1">
                        <strong>Принял:</strong> {getMasterName(order.master)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        _________________________
                    </Typography>
                    <Typography variant="caption">
                        (подпись)
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body1">
                        <strong>Сдал:</strong> {order.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        _________________________
                    </Typography>
                    <Typography variant="caption">
                        (подпись)
                    </Typography>
                </Box>
            </Box>

            <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic' }}>
                * Оборудование принято на ремонт. Гарантийный срок ремонта составляет 30 дней.
                <br />
                * В случае гарантийного случая в течение этого срока, ремонт производится бесплатно.
            </Typography>
        </Box>
    );
};

export default OrderAct;