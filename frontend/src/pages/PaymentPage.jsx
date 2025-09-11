import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../context/CheckoutContext';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { checkoutItems } = useCheckout();
    const [status, setStatus] = useState('idle');

    if (checkoutItems.length === 0 && status !== 'success') {
       navigate('/');
       return null;
    }
    
    const totalAmount = checkoutItems.reduce((acc, item) => acc + item.price, 0);
    const upiUri = `upi://pay?pa=your-upi-id@okhdfcbank&pn=Created%20by%20dobas&am=${totalAmount.toFixed(2)}&cu=INR&tn=OrderPayment`;
    
    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => {
                navigate('/order-confirmation');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const handleSimulatePayment = () => {
        setStatus('verifying');
        setTimeout(() => {
            setStatus('success');
        }, 3000);
    };

    return (
        <div className="max-w-md mx-auto text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-xl border relative overflow-hidden">
                <AnimatePresence>
                    {status === 'idle' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <h1 className="font-playfair text-3xl font-bold mb-2 text-gray-800">Scan to Pay</h1>
                            <p className="text-gray-600 mb-6">Complete your payment using any UPI app.</p>
                            <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '8px' }}>
                                <QRCode value={upiUri} size={200} />
                            </div>
                            <div className="my-6 text-gray-500">OR</div>
                            <button onClick={handleSimulatePayment} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                                Simulate Successful Payment
                            </button>
                        </motion.div>
                    )}

                    {status === 'verifying' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-semibold text-gray-700">Verifying Payment...</h2>
                            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--theme-pink)] mt-4"></div>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-20">
                            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
                            <p className="text-gray-600 mt-2">Redirecting you to the confirmation page...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PaymentPage;