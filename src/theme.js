// src/theme.js
import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#2e7d32' : '#81c784', // green
    },
    secondary: {
      main: '#ffb300', // accent
    },
    background: {
      default: mode === 'light' ? '#fafafa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    h3: {
      color: mode === 'light' ? "#413e3e" : "#ebebe6",
    },
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
});

export const buildTheme = (mode) => createTheme(getDesignTokens(mode));
