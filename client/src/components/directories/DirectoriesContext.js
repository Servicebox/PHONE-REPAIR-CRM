// contexts/DirectoriesContext.jsx
import React, { createContext, useState, useContext } from 'react';

const DirectoryContext = createContext();

export const DirectoryProvider = ({ children }) => {
    const [directories, setDirectories] = useState([
        {
            id: 'counterparties',
            name: 'Контрагенты',
            icon: 'Business',
            fields: [
                { id: 'name', name: 'Наименование', type: 'text', required: true },
                { id: 'type', name: 'Тип', type: 'select', options: ['Поставщик', 'Клиент', 'Партнер'] },
                { id: 'phone', name: 'Телефон', type: 'tel' },
                { id: 'email', name: 'Email', type: 'email' },
            ],
            items: [
                { id: '1', name: 'ООО "ТехноПрофи"', type: 'Поставщик', phone: '+7 (495) 123-45-67' },
            ]
        },
        // Другие справочники по умолчанию
    ]);

    const addDirectory = (newDirectory) => {
        setDirectories([...directories, newDirectory]);
    };

    const updateDirectory = (id, updatedDirectory) => {
        setDirectories(directories.map(dir =>
            dir.id === id ? { ...dir, ...updatedDirectory } : dir
        ));
    };

    const deleteDirectory = (id) => {
        setDirectories(directories.filter(dir => dir.id !== id));
    };

    const addItem = (directoryId, newItem) => {
        setDirectories(directories.map(dir =>
            dir.id === directoryId
                ? { ...dir, items: [...dir.items, newItem] }
                : dir
        ));
    };

    const updateItem = (directoryId, itemId, updatedItem) => {
        setDirectories(directories.map(dir =>
            dir.id === directoryId
                ? {
                    ...dir,
                    items: dir.items.map(item =>
                        item.id === itemId ? { ...item, ...updatedItem } : item
                    )
                }
                : dir
        ));
    };

    const deleteItem = (directoryId, itemId) => {
        setDirectories(directories.map(dir =>
            dir.id === directoryId
                ? { ...dir, items: dir.items.filter(item => item.id !== itemId) }
                : dir
        ));
    };

    const addField = (directoryId, newField) => {
        setDirectories(directories.map(dir =>
            dir.id === directoryId
                ? { ...dir, fields: [...dir.fields, newField] }
                : dir
        ));
    };

    const updateField = (directoryId, fieldId, updatedField) => {
        setDirectories(directories.map(dir =>
            dir.id === directoryId
                ? {
                    ...dir,
                    fields: dir.fields.map(field =>
                        field.id === fieldId ? { ...field, ...updatedField } : field
                    )
                }
                : dir
        ));
    };

    const deleteField = (directoryId, fieldId) => {
        setDirectories(directories.map(dir =>
            dir.id === directoryId
                ? { ...dir, fields: dir.fields.filter(field => field.id !== fieldId) }
                : dir
        ));
    };

    return (
        <DirectoryContext.Provider value={{
            directories,
            addDirectory,
            updateDirectory,
            deleteDirectory,
            addItem,
            updateItem,
            deleteItem,
            addField,
            updateField,
            deleteField
        }}>
            {children}
        </DirectoryContext.Provider>
    );
};

export const useDirectories = () => useContext(DirectoryContext);