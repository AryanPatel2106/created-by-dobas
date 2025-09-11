import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, customizationDetails) => {
    const newItem = {
      ...product,
      customization: customizationDetails,
      cartItemId: `${product._id}-${Date.now()}`
    };
    setCartItems(prevItems => [...prevItems, newItem]);
  };

  const value = {
    cartItems,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};