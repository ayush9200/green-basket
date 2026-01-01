import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ContactPage = () => {
  const theme = useTheme();
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    business: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = React.useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await addDoc(collection(db, 'contactRequests'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setForm({ name: '', email: '', business: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <Box sx={{ mx: 'auto', p: 4 }}>
      <Typography variant="h3" sx={{ mb: 2, textAlign: 'left' }}>
        Contact us
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mb: 4,
          textAlign: 'left',
          color: 'text.secondary',
          mx: 'auto'
        }}
      >
        Get in touch for bulk orders, partnerships, or any questions about our fresh produce
      </Typography>

      <Grid container spacing={4}>
        {/* Left: Enhanced Form */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 1,
              bgcolor: 'background.paper',
              height: 'fit-content',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              Send us a message
            </Typography>

            <Divider sx={{ mb: 4, bgcolor: 'primary.main', height: 2 }} />

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Full name *"
                  name="name"
                  fullWidth
                  required
                  value={form.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: 'background.default',
                    }
                  }}
                />
                <TextField
                  label="Business name"
                  name="business"
                  fullWidth
                  value={form.business}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: 'background.default',
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Email *"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  value={form.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: 'background.default',
                    }
                  }}
                />
                <TextField
                  label="Phone / WhatsApp"
                  name="phone"
                  fullWidth
                  value={form.phone}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: 'background.default',
                    }
                  }}
                />
              </Box>

              <TextField
                label="Your message *"
                name="message"
                fullWidth
                required
                multiline
                minRows={5}
                value={form.message}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'background.default',
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  px: 6,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  alignSelf: 'flex-start',
                  boxShadow: 4,
                  '&:hover': {
                    boxShadow: 8,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Send Message
              </Button>
            </Box>

            {status === 'success' && (
              <Alert
                sx={{ mt: 3, borderRadius: 3 }}
                severity="success"
                variant="filled"
              >
                Thank you! We'll get back to you within 24 hours.
              </Alert>
            )}
            {status === 'error' && (
              <Alert
                sx={{ mt: 3, borderRadius: 3 }}
                severity="error"
                variant="filled"
              >
                Something went wrong. Please try again.
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 4 },
              height: 'fit-content',
              position: 'sticky',
              top: 100,
              borderRadius: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'text.primary'
              }}
            >
              Get in touch
            </Typography>

            <Divider sx={{ mb: 4, bgcolor: 'primary.main', height: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Phone */}
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  }
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PhoneIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Phone / WhatsApp
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'primary.main', fontWeight: 600 }}
                  >
                    +91 12121 43210
                  </Typography>
                </Box>
              </Paper>

              {/* Email */}
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  }
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmailIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1">
                    hello@Green Basket.com
                  </Typography>
                </Box>
              </Paper>

              {/* Location */}
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  }
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'success.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 0.5,
                  }}
                >
                  <LocationOnIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body1">
                    123 Market Yard Road<br />
                    Pune, Maharashtra 411001
                  </Typography>
                </Box>
              </Paper>

              {/* Hours */}
              <Paper
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 2,
                  }
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'warning.main',
                    color: 'white',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 0.5,
                  }}
                >
                  <ScheduleIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Business Hours
                  </Typography>
                  <Typography variant="body1">
                    Mon–Sat: 6:00 AM – 8:00 PM<br />
                    Sun: 6:00 AM – 2:00 PM
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactPage;
