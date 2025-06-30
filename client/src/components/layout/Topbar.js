import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Topbar = () => {
    return (
        <AppBar position="static" color="inherit" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Servicebox
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;