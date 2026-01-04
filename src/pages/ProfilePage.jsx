import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Alert, Card, CardContent,
  Grid, FormControlLabel, Checkbox, Link, CircularProgress, Divider, useTheme, Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateUserProfile,
  signOut
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useProfile } from '../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import LightLogo from '../assets/green_basket_light.png';
import DarkLogo from '../assets/green_basket_dark.png';

const ProfilePage = () => {
  const { profile, loading: profileLoading, user } = useProfile();
  const navigate = useNavigate();
  const theme = useTheme();

  const ADMIN_EMAIL = 'admin@greenbasket.com';

  const isAdminEmail = (email) => !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();


  const isEditMode = !!user && !!profile;

  const [isSignup, setIsSignup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', business: '', phone: '',
    address: '', gst: '', termsAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode && profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || user?.email || '',
        business: profile.business || '',
        phone: profile.phone || '',
        address: profile.address || '',
        gst: profile.gst || '',
        termsAccepted: true 
      });
    }
  }, [isEditMode, profile, user]);

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
          await updateUserProfile(user, { displayName: form.name });

          await updateDoc(doc(db, 'customers', user.uid), {
            ...form,
            updatedAt: new Date(),
          });

          setSuccess('Profile updated successfully!');
        }
      } else if (isSignup) {
        // SIGN UP (CREATE ACCOUNT)
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const createdUser = userCredential.user;

        await setDoc(doc(db, 'customers', createdUser.uid), {
          ...form,
          uid: createdUser.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // After signup, normal user → go to order page
        navigate('/order');
      } else {
        // LOGIN
        const userCredential = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const loggedInUser = userCredential.user;

        // Decide where to go based on email (or claims later)
        if (isAdminEmail(loggedInUser.email)) {
          setIsAdmin(true);
          navigate('/admin');
        } else {
          navigate('/order');
        }
      }
    } catch (err) {
      setError(
        isEditMode
          ? 'Failed to update profile'
          : isSignup
            ? err.code === 'auth/email-already-in-use'
              ? 'Email already registered'
              : err.message
            : err.code === 'auth/wrong-password'
              ? 'Invalid email/password'
              : err.message
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
    <Box sx={{ minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Card sx={{ p: { xs: 2, md: 4 }, borderRadius: 1, boxShadow: 1 }}>
          <CardContent sx={{ p: 0 }}>
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

            {/* Auth mode header */}
            <Stack alignItems="center" sx={{ mb: 2 }}>
              {/* <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
                {isEditMode
                  ? 'My Profile'
                  : isSignup
                    ? 'Join Green Basket'
                    : 'Welcome to Green Basket'}
              </Typography> */}
              <Box
                component="img"
                sx={{
                  height: { xs: 200, sm: 200, md: 250 },
                  width: { xs: 200, sm: 200, md: 250 },
                  display: 'block',
                  borderRadius: 13, // Add some spacing to the right of the logo
                }}
                alt="Green Basket Logo"
                src={theme.palette.mode === 'dark' ? DarkLogo : LightLogo} // Use the imported image variable
              />
              {isEditMode && (
                <Typography
                  variant="body-lg"
                  sx={{ m: 2, color: 'success.main' }}
                >
                  Update your business details
                  <Divider sx={{ my: 1, bgcolor: 'primary.main', height: 2 }} />
                </Typography>
              )}
            </Stack>

            {/* Show link to switch between login and signup (only when not editing) */}
            {!isEditMode && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                {isSignup ? (
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => {
                        setIsSignup(false);
                        setError('');
                      }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    Don&apos;t have an account?{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => {
                        setIsSignup(true);
                        setError('');
                      }}
                    >
                      Create account
                    </Link>
                  </Typography>
                )}
              </Box>
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
                <Typography variant="h6" sx={{ mt: 2, color: 'success.main' }}>
                  Business Details
                  <Divider sx={{ my: 1, bgcolor: 'primary.main', height: 2 }} />
                </Typography>


                <Grid container columns={12} sx={{ width: "100%" }} spacing={2}>
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
              {(isAdmin) ?
                <Grid item>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/admin"
                  >
                    Go to Admin Dashboard
                  </Button>
                </Grid>
                :
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
}
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
