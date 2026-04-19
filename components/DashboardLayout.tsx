import React from 'react';
import { Box } from '@mui/material';
import Sidenav from './Sidenav';
import DashboardNavbar from './DashboardNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Sidenav />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          px: 3,
          pt: 2,
          pb: 4,
        }}
      >
        <DashboardNavbar />

        <Box sx={{ mt: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}