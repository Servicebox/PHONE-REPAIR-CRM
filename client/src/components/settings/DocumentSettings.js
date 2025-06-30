// components/settings/DocumentSettings.js
import React, { useState } from 'react';
import {
    Container, Paper, Typography, Tabs, Tab, Box,
    TextField, Button
} from '@mui/material';
import { Description as DocumentIcon } from '@mui/icons-material';

const DocumentSettings = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [templates, setTemplates] = useState({
        acceptance: '',
        completion: '',
        sticker: '',
        receipt: ''
    });

    const documentTypes = [
        { id: 'acceptance', name: 'Акт приема' },
        { id: 'completion', name: 'Акт выполненных работ' },
        { id: 'sticker', name: 'Наклейка на устройство' },
        { id: 'receipt', name: 'Товарный чек' }
    ];

    const handleTemplateChange = (e) => {
        const { name, value } = e.target;
        setTemplates(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Сохранение шаблонов в локальное хранилище или на сервер
        localStorage.setItem('documentTemplates', JSON.stringify(templates));
        alert('Настройки сохранены!');
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
                Настройки документов
            </Typography>

            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
                {documentTypes.map((doc, index) => (
                    <Tab key={doc.id} label={doc.name} icon={<DocumentIcon />} />
                ))}
            </Tabs>

            <Paper sx={{ p: 3, mt: 2 }}>
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                        {documentTypes[currentTab].name}
                    </Typography>

                    <TextField
                        name={documentTypes[currentTab].id}
                        value={templates[documentTypes[currentTab].id]}
                        onChange={handleTemplateChange}
                        multiline
                        rows={10}
                        fullWidth
                        variant="outlined"
                    />
                </Box>

                <Button variant="contained" color="primary" onClick={handleSave}>
                    Сохранить шаблон
                </Button>
            </Paper>
        </Container>
    );
};

export default DocumentSettings;