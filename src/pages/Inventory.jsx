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
    const [page, setPage] = useState(0);
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
                        <Grid container spacing={4}>
                            {displayedRows.map((row) => (
                                (row.active === "Yes" || row.active === "yes") && (
                                    <Grid item xs={6} sm={6} md={3} key={row.sku || row.name}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                boxShadow: 2,
                                                '&:hover': {
                                                    boxShadow: 1,
                                                    transform: 'translateY(-8px)',
                                                    variant: 'outlined',
                                                    backgroundColor: "#e0ece1ff"

                                                },
                                            }}
                                        >
                                            {row.imageUrl ? (
                                                <CardMedia
                                                    component="img"
                                                    image={row.imageUrl}
                                                    alt={row.name}
                                                    loading="eager"
                                                    decoding="async"
                                                    sx={{ width: 350, height: 220, objectFit: 'cover', display: 'block' }}
                                                />
                                            ) : (
                                                <CardMedia
                                                    component="img"
                                                    image={"https://placehold.co/300x300/e0e0e0/636363?text=No+Image"}
                                                    alt={row.name}
                                                    loading="eager"
                                                    decoding="async"
                                                    sx={{ width: 350, height: 220, objectFit: 'cover', display: 'block' }}
                                                />
                                            )}
                                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                                                    {row.name}
                                                </Typography>
                                                {row.category && (
                                                    <Chip label={row.category} size="small" sx={{ mb: 1.5 }} color="success" />
                                                )}
                                                &nbsp;<Chip label={row.indianName} size="small" sx={{ mb: 1.5, fontWeight: 800 }} variant='outlined' color="success" />
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4 }}>
                                                    {row.description || 'Fresh from local farms'}
                                                </Typography>
                                                <Typography variant="h4" sx={{ mb: 2, color: 'primary.main', fontWeight: 800 }}>
                                                    ₹{row.pricePerKg || row.price}
                                                    <Typography component="span" variant="h6">/kg</Typography>
                                                </Typography>
                                                {row.stock && (
                                                    <Chip
                                                        label={`Stock: ${row.stock}kg`}
                                                        size="small"
                                                        color={Number(row.stock) > 50 ? 'success' : 'warning'}
                                                        sx={{ mb: 2 }}
                                                    />
                                                )}
                                                <Box sx={{ mb: 1 }}>
                                                    <TextField
                                                        label="Quantity"
                                                        type="number"
                                                        size="small"
                                                        fullWidth
                                                        inputProps={{ min: 10, max: 50000, step: 5 }}
                                                        value={quantities[row.sku || row.name] ?? 10}
                                                        onChange={(e) => handleQtyChange(row.sku || row.name, e.target.value)}
                                                    />
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ p: 2, pt: 0 }}>
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
