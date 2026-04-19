import { createTheme } from '@mui/material/styles';

const primaryMain = '#e91e63';
const primaryDark = '#d81b60';
const backgroundDefault = '#f5f5f5';

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      dark: primaryDark,
    },
    secondary: {
      main: '#7b809a',
    },
    background: {
      default: backgroundDefault,
      paper: '#ffffff',
    },
    text: {
      primary: '#344767',
      secondary: '#7b809a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h3: { fontWeight: 700, color: '#344767', fontSize: '1.875rem' },
    h4: { fontWeight: 700, color: '#344767', fontSize: '1.5rem' },
    h5: { fontWeight: 700, color: '#344767', fontSize: '1.25rem' },
    h6: { fontWeight: 600, color: '#344767', fontSize: '1rem', lineHeight: 1.625 },
    subtitle1: { fontWeight: 500, color: '#344767', fontSize: '1rem' },
    subtitle2: { fontWeight: 600, color: '#7b809a', fontSize: '0.875rem' },
    body1: { fontWeight: 400, color: '#344767', fontSize: '1rem' },
    body2: { fontWeight: 400, color: '#7b809a', fontSize: '0.875rem' },
    button: { fontWeight: 600, fontSize: '0.875rem', textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          marginBottom: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minWidth: 0,
          wordWrap: 'break-word',
          backgroundColor: '#ffffff',
          backgroundClip: 'border-box',
          border: '0 solid rgba(0, 0, 0, 0.125)',
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(38, 38, 38, 0.15), 0 2px 4px -1px rgba(38, 38, 38, 0.12)',
          overflow: 'visible',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#344767',
          borderRadius: '16px',
          borderRight: 'none',
          margin: '16px',
          height: 'calc(100vh - 32px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflowX: 'hidden',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backdropFilter: 'saturate(200%) blur(30px)',
          boxShadow: 'inset 0px -1px 1px rgba(255, 255, 255, 0.6), 0px 4px 6px -1px rgba(0, 0, 0, 0.05)',
          color: '#344767',
          borderRadius: 12,
          position: 'sticky',
          top: '16px',
          zIndex: 1100,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          }
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem !important', // Exact compact form size
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '8px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(195deg, #EC407A, #D81B60)',
          boxShadow: '0 3px 3px 0 rgba(233, 30, 99, 0.15), 0 3px 1px -2px rgba(233, 30, 99, 0.2), 0 1px 5px 0 rgba(233, 30, 99, 0.15)',
          '&:hover': {
            background: 'linear-gradient(195deg, #E91E63, #C2185B)',
            boxShadow: '0 14px 26px -12px rgba(233, 30, 99, 0.4), 0 4px 23px 0 rgba(0, 0, 0, 0.15), 0 8px 10px -5px rgba(233, 30, 99, 0.2)',
          },
        },
        outlined: {
          boxShadow: 'none',
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          marginBottom: '16px',
          marginTop: '16px',
        },
      },
    },
  },
});
