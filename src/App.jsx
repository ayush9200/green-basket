import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Badge,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import { useCart } from './context/CartContext';
import Footer from './Components/Footer';
import InventoryPage from './pages/Inventory';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useProfile } from './context/ProfileContext';
import { Link as RouterLink } from 'react-router-dom'; 
import HeaderLogo from './assets/logo_header.png';
import { red } from '@mui/material/colors';

const App = ({ mode, toggleMode }) => {
  const { cart } = useCart();
  const { user, profile } = useProfile();
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/profile');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default',  display: 'flex', flexDirection: 'column' }}>
       <AppBar position="sticky">
        
        <Toolbar sx={{ alignItems: 'center' }}>
          <RouterLink to="/" style={{ display: 'inline-block', height: 64 }}>
            <Box
              component="img"
              sx={{
                height: 64,
                cursor: 'pointer',
              }}
              alt="Your Logo"
              src={HeaderLogo}
            />
          </RouterLink>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/about">About</Button>
            <Button color="inherit" component={RouterLink} to="/inventory">Inventory</Button>
            <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>

            {user ? (
              <>
                <Button color="inherit" component={RouterLink} to="/profile">
                  Hi, {profile?.name || 'User'}
                </Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button color="inherit" component={RouterLink} to="/profile">
                Login
              </Button>
            )}

            {/* Cart */}
            <IconButton color="inherit" onClick={() => navigate('/order')}>
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Theme Toggle */}
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
