// src/components/settings/SystemSettings.js
import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box, Paper } from '@mui/material';
import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';

const SystemSettings = () => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Системные настройки
            </Typography>

            <Tabs
                value={tabIndex}
                onChange={(e, newValue) => setTabIndex(newValue)}
                variant="fullWidth"
                sx={{ mb: 3 }}
            >
                <Tab label="Основные" />
                <Tab label="Уведомления" />
                <Tab label="Интеграции" />
            </Tabs>

            <Box mt={3}>
                {tabIndex === 0 && <GeneralSettings />}
                {tabIndex === 1 && <NotificationSettings />}
                {tabIndex === 2 && (
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Интеграции со сторонними сервисами
                        </Typography>
                        <Typography>
                            Здесь будут настройки интеграций с 1С, CRM, мессенджерами и другими сервисами.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default SystemSettings;