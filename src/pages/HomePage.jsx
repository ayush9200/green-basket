// src/pages/HomePage.jsx
import React from 'react';
import useGoogleSheets from 'use-google-sheets';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Container,
  Paper,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, {
  stepConnectorClasses
} from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';

const HomePage = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart } = useCart();

  const [carouselIndex, setCarouselIndex] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '' });
  const [quantities, setQuantities] = React.useState({});

  const { data, loading, error } = useGoogleSheets({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    sheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID,
    sheetsOptions: [{ id: 'Inventory' }],
  });

  const rows = !loading && !error ? data[0]?.data || [] : [];

  const { user } = useProfile();
  const navigate = useNavigate();

  React.useEffect(() => {
    const id = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const handlePrevSlide = () => setCarouselIndex((prev) => prev === 0 ? carouselItems.length - 1 : prev - 1);
  const handleNextSlide = () => setCarouselIndex((prev) => (prev + 1) % carouselItems.length);

  const handleQtyChange = (key, value) => {
    const num = Number(value) || 10;
    const clamped = Math.min(Math.max(num, 10), 50000);
    setQuantities((prev) => ({ ...prev, [key]: clamped }));
  };

  const handleAddToCart = (row) => {
    if (!user) {
      navigate('/profile');
      return;
    }

    const key = row.sku || row.name;
    const qty = quantities[key] ?? 10;
    const product = {
      sku: key,
      name: row.name,
      pricePerKg: Number(row.pricePerKg || row.price || 0),
      unit: row.unit || 'kg',
      minOrder: 10,
      imageUrl: row.imageUrl,
      stock: row.stock,
      quantity: qty,
    };
    addToCart(product);
    setSnackbar({ open: true, message: `${product.name} (${qty}kg) added to cart!` });
  };
  const QunatConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.primary.main,
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }));

  // Custom step icon
  const QunatStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.success.main,
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#784af4',
    }),
    '& .QunatStepIcon-completedIcon': {
      color: '#784af4',
    },
    '& .QunatStepIcon-circle': {
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }));

  function QunatStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QunatStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Box sx={{ fontSize: 18 }}>✓</Box>
        ) : active ? (
          <Box sx={{ fontSize: 18 }}>●</Box>
        ) : (
          <Box className="QunatStepIcon-circle" sx={{ mt: 2 }} />
        )}
      </QunatStepIconRoot>
    );
  }

  const currentSlide = carouselItems[carouselIndex];
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '50vh', md: '70vh' },
          minHeight: 300,
          borderRadius: 0,
          overflow: 'hidden',
          mb: 0,
        }}
      >
        <Box
          component="img"
          src={currentSlide.image}
          alt={currentSlide.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.4)',
            position: 'absolute',
            inset: 0,
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 3, md: 8 },
            pt: { xs: 12, md: 20 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 2,
              color: 'common.white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {currentSlide.title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.3rem', md: '2rem' },
              mb: 4,
              color: 'common.white',
              maxWidth: 600,
              lineHeight: 1.3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {currentSlide.subtitle}
          </Typography>
          <Button
            component={RouterLink}
            to="/inventory"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 50,
              boxShadow: 2,
              bgcolor: 'secondary.main',
              '&:hover': {
                boxShadow: 20,
                transform: 'translateY(-4px)',
                bgcolor: 'secondary.dark',
              },
            }}
            startIcon={<ShoppingCartIcon />}
          >
            Explore Inventory
          </Button>
        </Box>

        {/* Carousel Controls */}
        <IconButton
          onClick={handlePrevSlide}
          sx={{
            position: 'absolute',
            left: 24,
            top: '50%',
            display: 'none',
            transform: 'translateY(-50%)',
            width: 56,
            height: 56,
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <ChevronLeftIcon sx={{ color: 'white', fontSize: 28 }} />
        </IconButton>
        <IconButton
          onClick={handleNextSlide}
          sx={{
            position: 'absolute',
            right: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 56,
            height: 56,
            display: 'none',
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <ChevronRightIcon sx={{ color: 'white', fontSize: 28 }} />
        </IconButton>

        {/* Dots */}
        <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
          {carouselItems.map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: idx === carouselIndex ? 24 : 12,
                height: 12,
                borderRadius: 999,
                bgcolor: idx === carouselIndex ? 'secondary.main' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 2. FULL WIDTH INVENTORY CAROUSEL */}
      <Box sx={{ py: 8, px: 2, overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ mb: 1, textAlign: 'center', fontWeight: 800 }}>
            Fresh Inventory
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, textAlign: 'center', color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Scroll through today's top picks. View full catalog below.
          </Typography>
        </Container>
        <Box sx={{
          px: { xs: 2, md: 0 },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-track': { bgcolor: 'grey.200' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 4 },
        }}>
          <Box sx={{
            display: 'flex',
            gap: 3,
            minWidth: 'max-content',
            px: 2,
            py: 2,
            animation: 'scroll 60s linear infinite', // LOOPING ANIMATION
          }}>
            {[...rows.slice(0, 10)].map((row, idx) => (
              (row.featured === "Yes" || row.featured === "yes") &&
              <Card
                key={`${row.sku || row.name}-${idx}`}
                variant='outlined'
                sx={{
                  width: { xs: 260, sm: 280, md: 300, lg: 320 }, // uniform width
                  height: "100%",
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  elevation: 4,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    backgroundColor:  theme.palette.mode === 'dark' ? "#507350ff" : "#e0ece1ff",
                  },
                }}
              >
                {row.imageUrl && (
                  <CardMedia
                    component="img"
                    sx={{
                      aspectRatio: 1,           // square → perfect uniformity
                      height: { xs: 200, sm: 220, md: 240 },
                      width: '100%',
                      objectFit: 'cover',       // crops consistently
                    }}
                    image={row.imageUrl}
                    alt={row.name}
                  />
                )}
                <Box sx={{
                  p: { xs: 1.5, sm: 2, md: 2.5 }, // tighter on mobile
                  flexGrow: 1,                    // content fills remaining space
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                      {row.name}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                      }}
                    >
                      ₹{row.pricePerKg || row.price}/kg
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                      }}
                    >
                      Min Order: {row.minOrder || 10} kg
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 2 }}
                    onClick={() => handleAddToCart(row)}
                  >
                    Quick Add
                  </Button>
                </Box>
              </Card>

            ))}
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            component={RouterLink}
            to="/inventory"
            variant="contained"
            size="large"
            sx={{
              px: 8,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 50,
            }}
          >
            View Full Inventory →
          </Button>
        </Container>
      </Box>

      {/* 3. FULL WIDTH TRUSTED PARTNERS */}
      <Box sx={{ py: 8, px: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ mb: 1, textAlign: 'center', fontWeight: 800 }}>
            Trusted Partners
          </Typography>
        </Container>
        <Box sx={{
          px: { xs: 2, md: 0 },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
        }}>
          <Box sx={{ display: 'flex', gap: 4, minWidth: 'max-content', px: 4, py: 4 }}>
            {partners.map((partner, idx) => (
              <Paper
                key={idx}
                sx={{
                  minWidth: 300,
                  height: 200,
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? "#fefefeff" : "white",
                  boxShadow: 2,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    variant: 'outlined',
                    //backgroundColor: "#e0ece1ff"
                    backgroundColor:  theme.palette.mode === 'dark' ? "#81c784" : "#e0ece1ff",
                  }
                }}
              >
                <Box sx={{ fontSize: 64, mb: 2 }}>{partner.logo}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#413e3e" }}>
                  {partner.name}
                </Typography>
                <Typography variant="body2" color={theme.palette.mode === 'dark' ? "#413e3e" : "text.secondary"} textAlign="center">
                  {partner.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      <Container sx={{ py: 12 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={12} sx={{ pl: 2 }} alignItems="center">
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 800, lineHeight: 1.2 }}>
              What Makes Us Different
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.6 }}>
              We cut out the middleman completely. Direct farm partnerships mean:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5, flexShrink: 0 }}>
                  1
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Direct from Farmers</Typography>
                  <Typography>No brokers, no delays, maximum freshness</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5, flexShrink: 0 }}>
                  2
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Unbeatable Rates</Typography>
                  <Typography>20-30% lower than traditional wholesale</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5, flexShrink: 0 }}>
                  3
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Daily Fresh Guarantee</Typography>
                  <Typography>Harvested same day, delivered next morning</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1591586116988-62fe65164f8d?q=80&w=3110&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              sx={{
                width: '100%',
                height: 450,
                objectFit: 'cover',
                borderRadius: 100
              }}
            />
          </Grid> */}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>
            How Green Basket works
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Simple 5-step process from farm to your door
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 900, mx: 'auto', alignItems: "center", }}>
          <Stepper
            activeStep={-1}
            alternativeLabel
            orientation={isSm ? "vertical" : "horizontal"}
            connector={<QunatConnector />}
            sx={{
              pt: 4,
              pb: 6,
              alignItems: "center",
              '& .MuiStepLabel-iconContainer': {
                transform: 'scale(1.2)',
              }
            }}
          >
            <Step sx={{ alignItems: "center", }}>
              <StepLabel StepIconComponent={QunatStepIcon}>
                <Stack orientation={isSm ? "vertical" : "horizontal"} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    Fill Profile
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Save business details once
                  </Typography>
                  <Button component={RouterLink} to="/profile" size="small" variant="contained"
                    sx={{ mt: 1, px: 2, borderRadius: 10 }}
                  >
                    Profile →
                  </Button>
                </Stack>
              </StepLabel>
            </Step>

            <Step>
              <StepLabel StepIconComponent={QunatStepIcon}>
                <Stack orientation={isSm ? "vertical" : "horizontal"} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    Add Items
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Browse fresh inventory
                  </Typography>
                  <Button component={RouterLink} to="/inventory" size="small" variant="contained"
                    sx={{ mt: 1, px: 2, borderRadius: 10 }}
                  >
                    Browse →
                  </Button>
                </Stack>
              </StepLabel>
            </Step>

            <Step>
              <StepLabel StepIconComponent={QunatStepIcon}>
                <Stack orientation={isSm ? "vertical" : "horizontal"} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    Place Order
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Review cart & send
                  </Typography>
                  <Button component={RouterLink} to="/order" size="small" variant="contained"
                    sx={{ mt: 1, px: 2, borderRadius: 10 }}
                  >
                    Cart →
                  </Button>
                </Stack>
              </StepLabel>
            </Step>

            <Step>
              <StepLabel StepIconComponent={QunatStepIcon}>
                <Stack orientation={isSm ? "vertical" : "horizontal"} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    Team Confirms
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Via Email
                  </Typography>
                  <Chip label="Within 30 mins" color="success" size="medium" sx={{ mt: 1 }} />
                </Stack>
              </StepLabel>
            </Step>

            <Step>
              <StepLabel StepIconComponent={QunatStepIcon}>
                <Stack orientation={isSm ? "vertical" : "horizontal"} sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    Delivered + Invoice
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Paytm/PhonePe payment
                  </Typography>
                  <Chip label="Same Day" color="success" size="medium" sx={{ mt: 1 }} />
                </Stack>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Container>


      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false })}>
        <Alert severity="success" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

const carouselItems = [
  { image: 'https://images.unsplash.com/photo-1485637701894-09ad422f6de6?q=80&w=3236&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'FARM FRESH DAILY', subtitle: 'Direct from Delhi/NCR farms to your business' },
  { image: 'https://images.unsplash.com/photo-1650012048722-c81295ccbe79?q=80&w=3274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'WHOLESALE PRICES', subtitle: 'Best rates guaranteed - no middlemen' },
  { image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'QUALITY FIRST', subtitle: 'Same-day harvest, next-day delivery' },
];

const partners = [
  { name: 'Fresh Mart Chain', description: 'Leading retail chain across Delhi/NCR', logo: '🏪' },
  { name: 'Hotel Suppliers Co.', description: 'Supplying to 50+ restaurants', logo: '🍽️' },
  { name: 'Organic Foods Ltd.', description: 'Premium organic produce distributor', logo: '🌱' },
  { name: 'City Grocers', description: 'Wholesale to local kirana stores', logo: '🏬' },
  { name: 'Spice Route Hotels', description: 'Luxury hotel chain partner', logo: '🏨' },
];

export default HomePage;
