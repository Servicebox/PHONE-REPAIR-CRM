import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="content-wrapper">
                <Topbar />
                <main>{children}</main>
            </div>
        </div>
    );
};

export default Layout;