import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Badge,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import { useCart } from './context/CartContext';
import Footer from './components/Footer';
import InventoryPage from './pages/Inventory';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useProfile } from './context/ProfileContext';
import HeaderLogoLight from './assets/logo_light_header.png';
import HeaderLogoLight2 from './assets/logo_light_header_2.png';
import HeaderLogoDark from './assets/logo_dark_header.png';

import AdminDashboard from './components/AdminDashboard';

const App = ({ mode, toggleMode }) => {
  const { cart } = useCart();
  const { user, profile } = useProfile();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Hamburger menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/profile');
    handleMenuClose(); // close menu if open
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      
      {/* Responsive AppBar */}
      {/* bgcolor: (mode) => mode === 'light' ? 'background.default' : '#232a36' 
      // (mode === 'light') ? 'linear-gradient(to right, #f2f4f0 5%, #2e7e33 95%)' : 'linear-gradient(to right, #242a36 40%, #3c3b3b) 60%', 
      */}
      <AppBar position="sticky">
        <Toolbar sx={{ alignItems: 'center', background: 
          (mode === 'light') ? 'linear-gradient(to right, #f2f4f0 100px, #2e7e33 25%)' : 'linear-gradient(to right, #242a36 40%, #3c3b3b) 60%', }}>

          {/* Logo - always left, responsive size */}
          <IconButton
            edge="start"
            component={RouterLink}
            to="/"
            sx={{ mr: 1, p: 0 }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: 52, sm: 56, md: 64 },
                cursor: 'pointer',
              }}
              alt="Green Basket"
              src={mode === 'light' ? HeaderLogoLight : HeaderLogoDark}
            />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* DESKTOP: Full Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button color="inherit" component={RouterLink} to="/about">About</Button>
              <Button color="inherit" component={RouterLink} to="/inventory">Inventory</Button>
              <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
            </Box>
          )}

          {/* User Actions - Always Visible */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 0, md: 2 } }}>
            {user ? (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/profile"
                  sx={{ 
                    display: { xs: 'none', sm: 'block' } // hide greeting on tiny screens
                  }}
                >
                  Hi, {profile?.name || 'User'}
                </Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button color="inherit" component={RouterLink} to="/profile">
                Login
              </Button>
            )}

            {/* Cart Icon - Always Visible for Logged-in Users */}
            {user && (
              <IconButton color="inherit" onClick={() => navigate('/order')}>
                <Badge badgeContent={itemCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}

            {/* Theme Toggle - Always Visible */}
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {/* MOBILE ONLY: Hamburger Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Dropdown */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ mt: '0.5rem' }}
        PaperProps={{
          sx: { width: 220 }
        }}
      >
        <MenuItem onClick={handleMenuClose} component={RouterLink} to="/about">
          About
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={RouterLink} to="/inventory">
          Inventory
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={RouterLink} to="/contact">
          Contact
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default App;
