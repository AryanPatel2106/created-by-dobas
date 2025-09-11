import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationPage = () => {
  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20"
    >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 font-playfair text-green-600">Thank You!</h1>
        <p className="text-xl text-gray-700 mb-8">Your order has been placed successfully.</p>
        <Link to="/" className="inline-block bg-[var(--theme-pink)] text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg">
            Continue Shopping
        </Link>
    </motion.div>
  );
};

export default OrderConfirmationPage;