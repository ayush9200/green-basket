import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { buildTheme } from './theme';
import { CartProvider } from './context/CartContext';
import { ProfileProvider } from './context/ProfileContext';

const Root = () => {
  const [mode, setMode] = React.useState(
    localStorage.getItem('color-mode') || 'light'
  );

  const theme = React.useMemo(() => buildTheme(mode), [mode]);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('color-mode', next);
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <CartProvider>
          <ProfileProvider>
            <App mode={mode} toggleMode={toggleMode} />
          </ProfileProvider>
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
