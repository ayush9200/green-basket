// src/components/Footer.jsx
import React from 'react';
import {
  Box,
  Typography,
  Link as MuiLink,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LightLogo from '../assets/LightCropped.png'; //'./assets/LightCropped';
import DarkLogo from '../assets/DarkCropper.png';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      component="footer"
      elevation={8}
      sx={{
        mt: 8,  // ← Increased spacing from content
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === 'dark' ? '#353434' : '#fefefe',
        // REMOVED: position: 'sticky', bottom: 0, zIndex: 1000
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        {/* Brand & Copyright */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
           <Box
          component="img"
          sx={{
            height: 150, 
            marginRight: 2, // Add some spacing to the right of the logo
          }}
          alt="Green Basket Logo"
          src={theme.palette.mode === 'dark' ? DarkLogo : LightLogo} // Use the imported image variable
        />

          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Fresh farm to business
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2.5 },
          }}
        >
          <MuiLink
            component={Link}
            to="/about"
            variant="body2"
            color="text.primary"
            sx={{
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
                transform: 'translateY(-1px)',
              },
            }}
          >
            About
          </MuiLink>
          <MuiLink
            component={Link}
            to="/contact"
            variant="body2"
            color="text.primary"
            sx={{
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
                transform: 'translateY(-1px)',
              },
            }}
          >
            Contact
          </MuiLink>
          <MuiLink
            href="tel:+919876543210"
            variant="body2"
            color="text.primary"
            sx={{
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <PhoneIcon fontSize="small" />
            +91 98765 43210
          </MuiLink>
        </Box>

        {/* Contact Info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 1,
          }}
        >
          <MuiLink
            href="mailto:help@Green Basket.com"
            variant="body2"
            color="text.primary"
            sx={{
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <EmailIcon fontSize="small" />
            help@green-basket.com
          </MuiLink>
          <Typography variant="body2" color="text.secondary">
            Haryana Market Association
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Footer;
