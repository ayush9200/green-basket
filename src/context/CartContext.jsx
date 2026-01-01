import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.sku === product.sku);
      const minOrder = Number(product.minOrder || 10); // fallback
      if (existing) {
        return prev.map((item) =>
          item.sku === product.sku
            ? { ...item, quantity: item.quantity + minOrder }
            : item
        );
      }
      return [...prev, { ...product, quantity: minOrder }];
    });
  };

  const updateQuantity = (sku, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.sku !== sku) return item;
        const minOrder = Number(item.minOrder || 10);
        const nextQty = item.quantity + delta;
        return nextQty >= minOrder ? { ...item, quantity: nextQty } : item;
      })
    );
  };

  const removeFromCart = (sku) => {
    setCart((prev) => prev.filter((item) => item.sku !== sku));
  };

  const totalAmount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.pricePerKg || 0) * Number(item.quantity || 0),
        0
      ),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
