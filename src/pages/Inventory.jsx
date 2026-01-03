import React, { useState, useCallback, useEffect } from 'react';
import useGoogleSheets from 'use-google-sheets';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Chip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    Container,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useCart } from '../context/CartContext';

const InventoryPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { addToCart } = useCart();

    const [quantities, setQuantities] = useState({});
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const pageSize = 15;
    const [visibleCount, setVisibleCount] = useState(pageSize);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const { data, loading, error } = useGoogleSheets({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        sheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID,
        sheetsOptions: [{ id: 'Inventory' }],
    });

    const rows = !loading && !error ? data[0]?.data || [] : [];

    const filteredRows = rows.filter((row) => {
        const matchesSearch = row.name?.toLowerCase().includes(search.toLowerCase());
        const indianNameSearch = row.indianName?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || row.category === filter;
        const hasStock = row.stock ? Number(row.stock) > 0 : true;
        return (matchesSearch || indianNameSearch) && matchesFilter && hasStock;
    });

    useEffect(() => {
        setVisibleCount(pageSize);
    }, [search, filter]);

    const displayedRows = filteredRows.slice(0, visibleCount);


    const handleQtyChange = useCallback((key, value) => {
        const num = Number(value) || 10;
        const clamped = Math.min(Math.max(num, 10), 50000);
        setQuantities((prev) => ({ ...prev, [key]: clamped }));
    }, []);

    const handleAddToCart = (row) => {
        const key = row.sku || row.name;
        const qty = quantities[key] ?? 10;
        const product = {
            sku: key,
            name: row.name,
            indianName: row.indianName,
            pricePerKg: Number(row.pricePerKg || row.price || 0),
            unit: row.unit || 'kg',
            minOrder: 10,
            imageUrl: row.imageUrl,
            stock: row.stock,
            quantity: qty,
        };
        addToCart(product);
        setSnackbar({ open: true, message: `${product.name} (${qty}kg) added!` });
    };

    const categories = ['All', ...new Set(rows.map(row => row.category).filter(Boolean))];

    return (
        <Box sx={{ p: 1 }}>
            <Paper variant='outlined' sx={{ py: 4, mb: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" color='success' sx={{ mb: 1 }}>
                        Full Inventory
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                        {filteredRows.length} items available today
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            label="Search products"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            size="small"
                            sx={{ minWidth: 250 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Category</InputLabel>
                            <Select value={filter} label="Category" onChange={(e) => setFilter(e.target.value)}>
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Button startIcon={<FilterListIcon />}>Sort</Button>
                            <Button variant="contained" startIcon={<ShoppingCartIcon />}>
                                View Cart ({Object.values(quantities).reduce((a, b) => a + (b || 0), 0)}kg)
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            <Paper variant='outlined' sx={{ p: 2 }}>
                <Container>
                    {loading ? (
                        <Typography>Loading inventory...</Typography>
                    ) : error ? (
                        <Alert severity="error">Could not load inventory</Alert>
                    ) : filteredRows.length === 0 ? (
                        <Typography>No products match your filters</Typography>
                    ) : (
                        <>
                            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                                {displayedRows.map((row) => (
                                    (row.active === "Yes" || row.active === "yes") && (
                                        <Grid
                                            item
                                            xs={6}
                                            sm={4}
                                            md={4}
                                            lg={3}
                                            xl={2.4}
                                            key={row.sku || row.name}
                                            sx={{
                                                // Prevents overflow, allows full-width feel
                                                minWidth: 0,
                                                padding: { xs: 0.5, sm: 0.75, md: 1 }
                                            }}
                                        >
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    boxShadow: 2,
                                                    // Wider cards that fill space better
                                                    width: {
                                                        xs: 'calc(80vw - 8px)',  // nearly full width on mobile
                                                        sm: 250,
                                                        md: 280,
                                                        lg: 320,
                                                        xl: 340
                                                    },
                                                    '&:hover': {
                                                        boxShadow: 1,
                                                        transform: 'translateY(-8px)',
                                                        backgroundColor: "#e0ece1ff"
                                                    },
                                                }}
                                            >
                                                {/* Image - same as before */}
                                                <CardMedia
                                                    component="img"
                                                    image={row.imageUrl || "https://placehold.co/300x300/e0e0e0/636363?text=No+Image"}
                                                    alt={row.name}
                                                    sx={{
                                                        aspectRatio: 1,
                                                        height: { xs: 140, sm: 170, md: 200, lg: 220 },
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <CardContent sx={{
                                                    flexGrow: 1,
                                                    p: { xs: 1.5, sm: 2, md: 2.5 }, // tighter on mobile
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Box sx={{ mb: { xs: 1, md: 2 } }}>
                                                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                                                            {row.name}
                                                        </Typography>
                                                        {row.category && (
                                                            <Chip label={row.category} size="small" sx={{ mb: 1 }} color="success" />
                                                        )}
                                                        <Chip
                                                            label={row.indianName}
                                                            size="small"
                                                            sx={{ mb: 1.5, fontWeight: 800 }}
                                                            variant='outlined'
                                                            color="success"
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ mb: 1, lineHeight: 1.4 }}
                                                        >
                                                            {row.description || 'Fresh from local farms'}
                                                        </Typography>
                                                        <Typography
                                                            variant="h4"
                                                            sx={{
                                                                mb: 2,
                                                                color: 'primary.main',
                                                                fontWeight: 800,
                                                                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                                                            }}
                                                        >
                                                            ₹{row.pricePerKg || row.price}
                                                            <Typography component="span" variant="h6">/kg</Typography>
                                                        </Typography>
                                                        {row.stock && (
                                                            <Chip
                                                                label={`Stock: ${row.stock}kg`}
                                                                size="small"
                                                                color={Number(row.stock) > 50 ? 'success' : 'warning'}
                                                                sx={{ mb: { xs: 1, md: 2 } }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <TextField
                                                        label="Quantity"
                                                        type="number"
                                                        size="small"
                                                        fullWidth
                                                        inputProps={{ min: 10, max: 50000, step: 5 }}
                                                        value={quantities[row.sku || row.name] ?? 10}
                                                        onChange={(e) => handleQtyChange(row.sku || row.name, e.target.value)}
                                                        sx={{ mb: 1.5 }}
                                                    />
                                                    <CardActions sx={{ p: 0, mt: 'auto' }}>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            size="large"
                                                            startIcon={<ShoppingCartIcon />}
                                                            onClick={() => handleAddToCart(row)}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </CardActions>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', mt: 3 }}>
                                <Typography sx={{ mx: 1 }}>
                                    Showing {filteredRows.length === 0 ? 0 : 1} - {Math.min(visibleCount, filteredRows.length)} of {filteredRows.length}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size='small'
                                    onClick={() => setVisibleCount((c) => Math.min(c + pageSize, filteredRows.length))}
                                    disabled={visibleCount >= filteredRows.length}
                                >
                                    Load more
                                </Button>
                                {visibleCount > pageSize && (
                                    <Button variant="text" size='small' onClick={() => setVisibleCount(pageSize)}>
                                        Show less
                                    </Button>
                                )}
                            </Box>
                        </>
                    )}

                    <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false })}>
                        <Alert severity="success" sx={{ width: '100%' }}>{snackbar.message}</Alert>
                    </Snackbar>
                </Container>
            </Paper>
        </Box>
    );
};

export default InventoryPage;
