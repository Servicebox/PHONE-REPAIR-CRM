import React, { useState, useEffect } from 'react';

import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    TextField,
    Button,
    Paper,
    Grid,
    CircularProgress
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

const API = 'http://localhost:9000/api';

const DocumentsPage = () => {
    const [templates, setTemplates] = useState({
        act_acceptance: '',
        act_completion: '',
        invoice: '',
        warranty: ''
    });

    const [activeTab, setActiveTab] = useState('act_acceptance');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get(`${API}/templates`);
                setTemplates(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching templates:', error);
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const handleSave = async () => {
        try {
            await axios.post(`${API}/templates`, templates);
            // Показать уведомление об успехе
        } catch (error) {
            console.error('Error saving templates:', error);
            // Показать уведомление об ошибке
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography variant="h4" gutterBottom>
                    Управление документами
                </Typography>
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Управление документами
            </Typography>

            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Акт приема" value="act_acceptance" />
                <Tab label="Акт работ" value="act_completion" />
                <Tab label="Счет" value="invoice" />
                <Tab label="Гарантийный талон" value="warranty" />
            </Tabs>

            <Box mt={3}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <TextField
                        label="Шаблон документа"
                        multiline
                        fullWidth
                        minRows={15}
                        value={templates[activeTab]}
                        onChange={(e) => setTemplates({
                            ...templates,
                            [activeTab]: e.target.value
                        })}
                        variant="outlined"
                    />

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                        >
                            Сохранить шаблон
                        </Button>
                    </Box>
                </Paper>

                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Переменные для шаблонов:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Клиент
                                </Typography>
                                <Typography variant="body1">{'{customer.name}'}</Typography>
                                <Typography variant="body1">{'{customer.phone}'}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Заказ
                                </Typography>
                                <Typography variant="body1">{'{order.number}'}</Typography>
                                <Typography variant="body1">{'{order.date}'}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Устройство
                                </Typography>
                                <Typography variant="body1">{'{device.type}'}</Typography>
                                <Typography variant="body1">{'{device.model}'}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Сумма
                                </Typography>
                                <Typography variant="body1">{'{order.total}'} ₽</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default DocumentsPage;