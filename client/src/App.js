// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import CustomerDashboard from './components/CustomerDashboard';
import ProductsPage from './components/products/ProductsPage';
import ServicesPage from './components/services/ServicesPage';
import UsersPage from './components/users/UsersPage';
import DocumentSettings from './components/settings/DocumentSettings';
import DirectoriesPage from './components/directories/DirectoriesPage';
import DirectoryPage from './components/directories/DirectoryPage';
import DirectorySettings from './components/directories/DirectorySettings';
import SystemSettings from './components/settings/SystemSettings';
import { DirectoryProvider } from './contexts/DirectoriesContext';
import PaymentsPage from './components/payments/PaymentsPage';



function App() {
  return (
    <DirectoryProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/directories" element={<DirectoriesPage />} />
            <Route path="/directories/:directoryId" element={<DirectoryPage />} />
            <Route path="/directories/:directoryId/settings" element={<DirectorySettings />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/settings/documents" element={<DocumentSettings />} />
            <Route path="/settings/system" element={<SystemSettings />} />
            <Route path="/settings" element={<Navigate to="/settings/system" replace />} />


          </Routes>
        </Layout>
      </Router>
    </DirectoryProvider>
  );
}

export default App;