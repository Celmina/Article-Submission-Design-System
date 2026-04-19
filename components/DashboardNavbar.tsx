import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  IconButton,
  InputBase,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation } from 'react-router-dom';

export default function DashboardNavbar() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:480px)');

  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatPathLabel = (path: string) => {
    if (path === 'internal') return 'Analytics Dashboard';
    if (!path) return 'New Submission';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const getPageTitle = () => {
    if (pathnames.length === 0) return 'New Submission';
    return formatPathLabel(pathnames[pathnames.length - 1]);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        mx: { xs: 1, sm: 2, md: 3 },
        mt: { xs: 1, sm: 2, md: 3 },
        width: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'saturate(200%) blur(30px)',
        borderRadius: { xs: 2, md: 3 },
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: '64px !important', md: '72px !important' },
          px: { xs: 1.5, sm: 2, md: 3 },
          pl: { xs: 7, sm: 8, md: 3 },
          py: { xs: 1, md: 1.5 },
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {!isSmallMobile && (
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                '& .MuiBreadcrumbs-separator': { color: '#7b809a' },
                mb: 0.25,
                lineHeight: 1,
                overflow: 'hidden',
              }}
            >
              <Link
                underline="hover"
                color="#7b809a"
                href="#"
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                Pages
              </Link>

              {pathnames.map((val, i) => (
                <Typography
                  key={i}
                  color="#344767"
                  sx={{
                    fontSize: '0.75rem',
                    mb: 0,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatPathLabel(val)}
                </Typography>
              ))}

              {pathnames.length === 0 && (
                <Typography
                  color="#344767"
                  sx={{
                    fontSize: '0.75rem',
                    mb: 0,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  New Submission
                </Typography>
              )}
            </Breadcrumbs>
          )}

          <Typography
            variant="h6"
            color="#344767"
            sx={{
              fontWeight: 700,
              mb: 0,
              mt: 0,
              lineHeight: 1.1,
              fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.25rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {getPageTitle()}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            gap: 0.25,
            ml: 1,
          }}
        >
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: '10px',
                border: '1px solid #d2d6da',
                px: 1.25,
                py: 0.75,
                mr: 1,
                minWidth: 180,
              }}
            >
              <SearchIcon sx={{ color: '#7b809a', mr: 1, fontSize: '1.2rem' }} />
              <InputBase
                placeholder="Search here"
                sx={{ fontSize: '0.875rem', width: '100%' }}
              />
            </Box>
          )}

          <IconButton color="inherit" sx={{ color: '#7b809a', p: 0.75 }}>
            <AccountCircleIcon fontSize="small" />
          </IconButton>

          {!isSmallMobile && (
            <IconButton color="inherit" sx={{ color: '#7b809a', p: 0.75 }}>
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}

          <IconButton color="inherit" sx={{ color: '#7b809a', p: 0.75 }}>
            <NotificationsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}