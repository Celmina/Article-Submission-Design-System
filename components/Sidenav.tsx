import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 220;

export default function Sidenav() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Analytics Dashboard', icon: <DashboardIcon />, path: '/internal' },
    { text: 'Create Submission', icon: <SendIcon />, path: '/' },
    { text: 'Submission Revisions', icon: <SettingsIcon />, path: '/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          variant="subtitle1"
          color="inherit"
          sx={{ fontWeight: 700, letterSpacing: 0.5, m: 0, textTransform: 'uppercase' }}
        >
          Submission System
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, backgroundColor: 'rgba(0,0,0,0.12)' }} />

      <List sx={{ px: 2, mt: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: '8px',
                  py: 1.5,
                  background: active ? 'linear-gradient(195deg, #EC407A, #D81B60)' : 'transparent',
                  boxShadow: active
                    ? '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px rgba(233,30,99,.4)'
                    : 'none',
                  color: active ? '#ffffff' : '#344767',
                  '&:hover': {
                    backgroundColor: active ? 'transparent' : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: active ? '#ffffff' : '#7b809a', minWidth: 40, ml: 1 }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{ opacity: active ? 1 : 0.8 }}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: active ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 1300,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            '&:hover': {
              backgroundColor: '#ffffff',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}