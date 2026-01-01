// src/pages/OrderPage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, Link as RouterLink } from 'react-router-dom';  

const WHATSAPP_NUMBER = '+15551867262'; // Replace with actual number

const OrderPage = () => {
  const { cart, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { profile, loading: profileLoading, user } = useProfile();
  const [status, setStatus] = React.useState(null);

if (!profile) {
  return (
    <Alert severity="warning">
      Please <Link component={RouterLink} to="/profile">create/login to your profile</Link> 
      to place orders.
    </Alert>
  );
}

if (profileLoading) {
  return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
}

if (!user || !profile) {
  return (
    <Alert severity="warning" action={
      <Button component={RouterLink} to="/profile" variant="contained">
        Login/Signup
      </Button>
    }>
      Please login to place orders
    </Alert>
  );
}

  const handleChangeQty = (item, value) => {
    const num = Number(value) || 0;
    const min = Number(item.minOrder || 10);
    const clamped = Math.max(num, min);
    const delta = clamped - item.quantity;
    if (delta !== 0) updateQuantity(item.sku, delta);
  };

  const handlePlaceOrder = async () => {
    setStatus(null);
    if (!profile) {
      setStatus('profile-missing');
      return;
    }
    if (!cart.length) {
      setStatus('cart-empty');
      return;
    }

    try {
      const orderPayload = {
        items: cart,
        totalAmount,
        profile,
        createdAt: serverTimestamp(),
        status: 'pending',
        source: 'web-app',
      };
      await addDoc(collection(db, 'orders'), orderPayload);

      const lines = cart.map(
        (item) =>
          `${item.name}: ${item.quantity}${item.unit || 'kg'} @ ₹${
            item.pricePerKg
          }/${item.unit || 'kg'}`
      );
      const message = encodeURIComponent(
        `New wholesale order:\n\nBusiness: ${profile.business}\nContact: ${profile.name}\nPhone: ${profile.phone}\nAddress: ${profile.address}\n\nItems:\n${lines.join(
          '\n'
        )}\n\nTotal: ₹${totalAmount}\n\nPlease confirm availability and delivery slot.`
      );
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, '_blank');
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  };

  const hasProfile = !!profile;

  return (
    <Box>
      <Typography variant="h3" sx={{ m: 2 , p:2, fontWeight: 800,}}>
        Your cart
      </Typography>

      {!hasProfile && (
        <Alert sx={{ m: 2 }} severity="warning">
          Please create your profile first so orders include your business and address details (Profile page).
        </Alert>
      )}

      {!cart.length && (
        <Alert sx={{ m: 2 }} severity="info">Your cart is empty. Add items from the homepage.</Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          {cart.map((item) => (
            <Card key={item.sku} sx={{ mb: 2 }}>
              <Grid container>
                <Grid item xs={4} sm={3}>
                  {item.imageUrl && (
                    <CardMedia
                      component="img"
                      sx={{ height: 120, width: 120, objectFit: 'cover' }}
                      image={item.imageUrl}
                      alt={item.name}
                    />
                  )}
                </Grid>
                <Grid item xs={8} sm={9}>
                  <CardContent>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹ {item.pricePerKg} / {item.unit || 'kg'}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Quantity (kg)"
                        type="number"
                        size="small"
                        sx={{ width: 120 }}
                        inputProps={{ min: item.minOrder || 10, step: 5 }}
                        value={item.quantity}
                        onChange={(e) =>
                          handleChangeQty(item, e.target.value)
                        }
                      />
                      <Typography variant="body2">
                        Line total: ₹{item.pricePerKg * item.quantity}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.sku)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, position: 'sticky', top: 80 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Order summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2">
              Items: {cart.length}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
              Total: ₹{totalAmount}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Final pricing may adjust slightly based on daily mandi rates and exact weight.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handlePlaceOrder}
              disabled={!cart.length}
            >
              Place order via WhatsApp
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              You will be redirected to WhatsApp to confirm the order with our team.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {status === 'success' && (
        <Alert sx={{ mt: 2 }} severity="success">
          Order saved and WhatsApp opened. Please complete the chat there.
        </Alert>
      )}
      {status === 'error' && (
        <Alert sx={{ mt: 2 }} severity="error">
          Could not save order. Please try again.
        </Alert>
      )}
      {status === 'profile-missing' && (
        <Alert sx={{ mt: 2 }} severity="warning">
          Profile missing. Please fill your details on the Profile page before placing an order.
        </Alert>
      )}
      {status === 'cart-empty' && (
        <Alert sx={{ mt: 2 }} severity="info">
          Cart is empty. Add items from the homepage first.
        </Alert>
      )}
    </Box>
  );
};

export default OrderPage;
