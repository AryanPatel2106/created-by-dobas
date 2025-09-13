import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api.js';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';
import { MapPin } from 'lucide-react';
import EnhancedCheckoutForm from '../components/EnhancedCheckoutForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { checkoutItems } = useCheckout();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (checkoutItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-gray-600">Nothing to check out.</h1>
        <button onClick={() => navigate('/')} className="mt-4 inline-block bg-[var(--theme-pink)] text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-[var(--theme-pink-hover)] transition-all">
            Go Shopping
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (formData) => {
    try {
      setLoading(true);
      setError('');

      const orderData = {
        user: { name: user.name, email: user.email },
        orderItems: checkoutItems.map(item => ({
          name: item.name, 
          price: item.price, 
          image: item.image, 
          customization: item.customization
        })),
        shippingAddress: formData.shippingInfo,
        paymentMethod: formData.paymentMethod,
        deliveryInstructions: formData.deliveryInstructions,
        giftMessage: formData.giftMessage
      };

      await api.post('/api/orders', orderData);
      
      if (formData.paymentMethod === 'card' || formData.paymentMethod === 'upi' || formData.paymentMethod === 'netbanking' || formData.paymentMethod === 'wallet') {
        navigate('/payment');
      } else {
        navigate('/order-confirmation');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <h1 className="font-playfair text-4xl font-bold text-center mb-8 text-gray-800">
        Checkout
      </h1>
      
      {error && (
        <div className="max-w-md mx-auto mb-6">
          <ErrorMessage message={error} onRetry={() => setError('')} />
        </div>
      )}
      
      <EnhancedCheckoutForm
        checkoutItems={checkoutItems}
        user={user}
        onPlaceOrder={handlePlaceOrder}
        loading={loading}
      />
    </div>
  );
};

export default CheckoutPage;