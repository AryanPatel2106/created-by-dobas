import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutContext = createContext();

export const useCheckout = () => {
  return useContext(CheckoutContext);
};

export const CheckoutProvider = ({ children }) => {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const navigate = useNavigate();

  const initiateCheckout = (items) => {
    setCheckoutItems(items);
    navigate('/checkout');
  };

  const value = {
    checkoutItems,
    initiateCheckout,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};