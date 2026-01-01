// src/pages/ProfilePage.jsx - EDIT + AUTH MODES
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Alert, Card, CardContent,
  Grid, FormControlLabel, Checkbox, Link, CircularProgress, ToggleButton, ToggleButtonGroup,
  Divider, Paper, useTheme,
  CardHeader,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile as updateUserProfile 
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { profile, loading: profileLoading, user } = useProfile();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // EDIT MODE - if user logged in
  const isEditMode = !!user && !!profile;
  
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({
    name: '', email: '', password: '', business: '', phone: '', 
    address: '', gst: '', termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load profile data into form when editing
  useEffect(() => {
    if (isEditMode && profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || user?.email || '',
        business: profile.business || '',
        phone: profile.phone || '',
        address: profile.address || '',
        gst: profile.gst || '',
        termsAccepted: true // Always checked for edit
      });
    }
  }, [isEditMode, profile, user]);

  // Auto-redirect unauthenticated users to login
  useEffect(() => {
    if (!profileLoading && !user && !isEditMode) {
      // Stay on page for login/signup
    }
  }, [profileLoading, user, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        // UPDATE PROFILE
        if (user) {
          // Update Firebase Auth display name
          await updateUserProfile(user, { displayName: form.name });
          
          // Update Firestore profile
          await updateDoc(doc(db, 'customers', user.uid), {
            ...form,
            updatedAt: new Date(),
          });
          
          setSuccess('Profile updated successfully!');
        }
      } else if (isSignup) {
        // CREATE NEW ACCOUNT
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        const user = userCredential.user;
        await setDoc(doc(db, 'customers', user.uid), {
          ...form, uid: user.uid, createdAt: new Date(), updatedAt: new Date()
        });
        navigate('/order');
      } else {
        // LOGIN
        await signInWithEmailAndPassword(auth, form.email, form.password);
        navigate('/order');
      }
    } catch (err) {
      setError(isEditMode 
        ? 'Failed to update profile' 
        : (isSignup 
          ? (err.code === 'auth/email-already-in-use' ? 'Email already registered' : err.message)
          : (err.code === 'auth/wrong-password' ? 'Invalid email/password' : err.message)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isEditMode 
    ? (form.name && form.business && form.phone && form.address)
    : (isSignup 
      ? (form.name && form.email && form.password && form.business && form.phone && form.address && form.termsAccepted)
      : (form.email && form.password)
    );

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh'}}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p:2}}>
        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 1, boxShadow: 1 }}>
          <CardContent sx={{ p: 0 }}>
            <Stack alignItems="center" sx={{ mb: 2 }}>
             <Typography variant="h4" sx={{ mb: 2, color: 'success.main'}}>
                    {isEditMode ? 'My Profile' : (isSignup ? 'Join Green Basket' : 'Welcome Back')}
                </Typography>
                {isEditMode && (
                    <Typography variant="body-lg" sx={{ mb: 2,color: 'success.main' }}>
                    Update your business details
                     <Divider sx={{ my: 1, bgcolor: 'primary.main', height: 2}} />
                    </Typography>
                )}
               
                </Stack>
                
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            {/* Toggle - HIDE for Edit Mode */}
            {!isEditMode && (
              <ToggleButtonGroup
                value={isSignup}
                exclusive
                onChange={(_, newValue) => {
                  setIsSignup(newValue);
                  setError('');
                }}
                sx={{ mb: 2, width: '100%' }}
                color="primary"
                variant="contained"
              >
                <ToggleButton value={true} sx={{ flex: 1, py: 2, borderRadius: 3 }}>
                  <Typography variant="h6" >Create Account</Typography>
                </ToggleButton>
                <ToggleButton value={false} sx={{ flex: 1, py: 2, borderRadius: 3 }}>
                  <Typography variant="h6" >Sign In</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required={!isEditMode}
                value={form.email}
                onChange={!isEditMode ? handleChange : undefined}
                disabled={isEditMode}
              />

              {/* Password - Hide for edit mode */}
              {!isEditMode && (
                <TextField
                  label="Password *"
                  name="password"
                  type="password"
                  fullWidth
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              )}

             {(isSignup || isEditMode) && (<>
             <Typography variant="h6" sx={{ mt:2, color: 'success.main'}}>
                Business Details
                <Divider sx={{ my: 1, bgcolor: 'primary.main', height: 2}} />
              </Typography>
               
              
              <Grid container columns={12} sx={{width:"100%"}} spacing={2}>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField 
                    label="Full Name *" 
                    name="name" 
                    fullWidth 
                    required
                    value={form.name} 
                    onChange={handleChange} 
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField 
                    label="Business Name *" 
                    name="business" 
                    fullWidth 
                    required 
                    value={form.business} 
                    onChange={handleChange} 
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField 
                    label="Phone/WhatsApp *" 
                    name="phone" 
                    fullWidth 
                    required 
                    value={form.phone} 
                    onChange={handleChange} 
                  />
                </Grid>
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField 
                    label="GST/Tax ID" 
                    name="gst" 
                    fullWidth 
                    value={form.gst} 
                    onChange={handleChange} 
                  />
                </Grid>
              </Grid>
              
              <TextField
                label="Delivery Address *"
                name="address"
                fullWidth
                required
                multiline
                minRows={3}
                value={form.address}
                onChange={handleChange}
                
              />
             </>)}
              

    
                {!isEditMode && isSignup && (
                    <FormControlLabel
                    control={<Checkbox name="termsAccepted" checked={form.termsAccepted} onChange={handleChange} required />}
                    label="I agree to Terms & Privacy Policy"
                    />
                )}
              

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || loading}
                sx={{
                  py: 2.5,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: 1,
                  '&:hover': { boxShadow: 8, transform: 'translateY(-2px)' },
                }}
              >
                {loading ? (
                  <CircularProgress size={28} color="inherit" />
                ) : (
                  isEditMode 
                    ? 'Update Profile' 
                    : (isSignup ? 'Create Account & Start' : 'Sign In')
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Edit Mode: Logout + Order buttons */}
        {isEditMode && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button 
                  variant="outlined" 
                  component={RouterLink} 
                  to="/order"
                  sx={{ px: 4 }}
                >
                  Go to Orders
                </Button>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  onClick={async () => {
                    await signOut(auth);
                    navigate('/');
                  }}
                  sx={{ px: 4 }}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
