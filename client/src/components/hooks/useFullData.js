// hooks/useFullData.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useFullData() {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [fields, setFields] = useState([]);
    useEffect(() => {
        axios.get('/api/customers').then(r => setCustomers(r.data));
        axios.get('/api/orders').then(r => setOrders(r.data));
        axios.get('/api/customfields').then(r => setFields(r.data));
    }, []);
    return { customers, setCustomers, orders, setOrders, fields, setFields };
}