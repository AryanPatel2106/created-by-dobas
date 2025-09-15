import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useCheckout } from '../context/CheckoutContext.jsx';

const CartPage = () => {
  const { cartItems } = useCart();
  const { initiateCheckout } = useCheckout();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  const handleProceedToCheckout = () => {
    initiateCheckout(cartItems);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-gray-800 text-center sm:text-left">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white rounded-lg border">
          <p className="text-xl sm:text-2xl text-gray-600 mb-6">Your cart is empty.</p>
          <Link 
            to="/" 
            className="inline-block bg-[var(--theme-pink)] text-gray-800 font-bold py-3 px-8 rounded-full text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg border space-y-4">
            {cartItems.map(item => (
              <div key={item.cartItemId} className="flex flex-col sm:flex-row items-start border-b border-gray-200 py-6 last:border-b-0">
                <img src={item.image} alt={item.name} className="w-full sm:w-28 h-auto sm:h-28 object-cover rounded-md mb-4 sm:mb-0" />
                <div className="flex-grow sm:ml-6">
                  <Link to={`/product/${item._id}`} className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-[var(--theme-pink)] transition-colors">{item.name}</Link>
                  <div className="text-sm text-gray-500 mt-2 space-y-1">
                    <p><span className="font-semibold text-gray-700">For:</span> {item.customization.forWhom || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Relationship:</span> {item.customization.relation || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Details:</span> {item.customization.description || 'N/A'}</p>
                  </div>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-gray-800 mt-4 sm:mt-0 sm:ml-4">₹{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-lg border h-fit sticky top-28">
            <h2 className="text-2xl font-semibold border-b border-gray-200 pb-4 mb-4 text-gray-800">Order Summary</h2>
            <div className="flex justify-between items-center py-4 text-lg sm:text-xl">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-800">₹{subtotal}</span>
            </div>
            <button onClick={handleProceedToCheckout} className="w-full mt-4 block text-center bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;