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
import BasketLogoLight from '../assets/green_basket_light.png';
import BasketLogoDark from '../assets/green_basket_dark.png';

const Footer = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      component="footer"
      sx={{
        mt: 8,
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === 'light' ? '#fefefe' : '#313030',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'grid',
          // 3 columns md+ | 2 columns sm/mobile
          gridTemplateColumns: {
            xs: '1fr 1fr',  // 2 cols mobile: logo | all links
            sm: '1fr 1fr',  // 2 cols sm: logo | all links  
            md: '2fr 1fr 1fr',  // 3 cols desktop: logo | quick links | contact
          },
          rowGap: 3,
          columnGap: 3,
          alignItems: 'flex-start',
        }}
      >
        {/* Column 1: Brand + copyright (always left) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            component="img"
            alt="Green Basket Logo"
            src={theme.palette.mode === 'light' ? BasketLogoLight : BasketLogoDark}
            sx={{
              height: { xs: 200, sm: 200, md: 250 },
              width: { xs: 200, sm: 200, md: 250 },
              display: 'block',
               borderRadius: 13,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Fresh farm to business
          </Typography>
        </Box>

        {/* Column 2: All Links (Quick + Contact combined on mobile/sm) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Quick Links section */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1 }}
              color="text.primary"
            >
              Quick links
            </Typography>
            <MuiLink
              component={Link}
              to="/about"
              variant="body2"
              color="text.primary"
              sx={{
                fontWeight: 500,
                display: 'block',
                transition: 'all 0.2s ease',
                mb: 0.5,
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
                display: 'block',
                transition: 'all 0.2s ease',
                mb: 0.5,
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Contact
            </MuiLink>
            <MuiLink
              component={Link}
              to="/inventory"
              variant="body2"
              color="text.primary"
              sx={{
                fontWeight: 500,
                display: 'block',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Inventory
            </MuiLink>
          </Box>

          {/* Contact section - only shows on md+ (3rd column on desktop) */}
          {isSmDown && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1 }}
                color="text.primary"
              >
                Contact
              </Typography>
              <MuiLink
                href="tel:+919876543210"
                variant="body2"
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  display: 'block',
                  mb: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <PhoneIcon fontSize="small" sx={{ mr: 0.75, verticalAlign: 'middle' }} />
                +91 98765 43210
              </MuiLink>
              <MuiLink
                href="mailto:help@green-basket.com"
                variant="body2"
                color="text.primary"
                sx={{
                  fontWeight: 500,
                  display: 'block',
                  mb: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <EmailIcon fontSize="small" sx={{ mr: 0.75, verticalAlign: 'middle' }} />
                help@green-basket.com
              </MuiLink>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                <LocationOnIcon fontSize="small" color="action" sx={{ mt: '2px' }} />
                <Box>
                  <Typography variant="body2" color="text.primary">
                    Haryana Market Association
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wholesale vegetable hub, Haryana
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Column 3: Contact (only visible md+) */}
        {!isSmDown && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1 }}
              color="text.primary"
            >
              Contact
            </Typography>
            <MuiLink
              href="tel:+919876543210"
              variant="body2"
              color="text.primary"
              sx={{
                fontWeight: 500,
                display: 'block',
                mb: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <PhoneIcon fontSize="small" sx={{ mr: 0.75, verticalAlign: 'middle' }} />
              +91 98765 43210
            </MuiLink>
            <MuiLink
              href="mailto:help@green-basket.com"
              variant="body2"
              color="text.primary"
              sx={{
                fontWeight: 500,
                display: 'block',
                mb: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <EmailIcon fontSize="small" sx={{ mr: 0.75, verticalAlign: 'middle' }} />
              help@green-basket.com
            </MuiLink>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
              <LocationOnIcon fontSize="small" color="action" sx={{ mt: '2px' }} />
              <Box>
                <Typography variant="body2" color="text.primary">
                  Haryana Market Association
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Wholesale vegetable hub, Haryana
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Mobile bottom center text */}
      {isSmDown && (
        <Box
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Green Basket • Wholesale vegetable e-commerce
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Footer;
