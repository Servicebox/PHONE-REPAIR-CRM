import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
    Paper,
    List,
    ListItem,

    TextField,
    Divider
} from '@mui/material';

const NotificationSettings = () => {
    const [notifications, setNotifications] = useState({
        newOrder: true,
        statusChange: true,
        paymentReceived: true,
        emailNotifications: true,
        smsNotifications: false,
        telegramToken: '',
        telegramChatId: '',
    });

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет логика сохранения настроек
        console.log('Notification settings saved:', notifications);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Настройки уведомлений
            </Typography>

            <List>
                <ListItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={notifications.newOrder}
                                onChange={handleChange}
                                name="newOrder"
                            />
                        }
                        label="Уведомлять о новых заказах"
                    />
                </ListItem>

                <Divider />

                <ListItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={notifications.statusChange}
                                onChange={handleChange}
                                name="statusChange"
                            />
                        }
                        label="Уведомлять об изменении статуса заказа"
                    />
                </ListItem>

                <Divider />

                <ListItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={notifications.paymentReceived}
                                onChange={handleChange}
                                name="paymentReceived"
                            />
                        }
                        label="Уведомлять о получении оплаты"
                    />
                </ListItem>

                <Divider />

                <ListItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={notifications.emailNotifications}
                                onChange={handleChange}
                                name="emailNotifications"
                            />
                        }
                        label="Email уведомления"
                    />
                </ListItem>

                <Divider />

                <ListItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={notifications.smsNotifications}
                                onChange={handleChange}
                                name="smsNotifications"
                            />
                        }
                        label="SMS уведомления"
                    />
                </ListItem>
            </List>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                Настройки Telegram
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Telegram Bot Token"
                    name="telegramToken"
                    value={notifications.telegramToken}
                    onChange={(e) => setNotifications({ ...notifications, telegramToken: e.target.value })}
                    fullWidth
                    margin="normal"
                    helperText="Получить у @BotFather"
                />

                <TextField
                    label="Telegram Chat ID"
                    name="telegramChatId"
                    value={notifications.telegramChatId}
                    onChange={(e) => setNotifications({ ...notifications, telegramChatId: e.target.value })}
                    fullWidth
                    margin="normal"
                    helperText="Получить у @userinfobot"
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Сохранить настройки
                </Button>
            </Box>
        </Paper>
    );
};

export default NotificationSettings;