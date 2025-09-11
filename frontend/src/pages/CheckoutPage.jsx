import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../context/CheckoutContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { MapPin } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { checkoutItems } = useCheckout();
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

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

  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price, 0);

  const placeOrderHandler = async (paymentMethod) => {
    if (state.toLowerCase().trim() !== 'gujarat') {
      alert('Sorry, delivery is currently only available in Gujarat. Please enter a valid address to proceed.');
      return;
    }

    try {
      await axios.post('/api/orders', {
        user: { name: user.name, email: user.email },
        orderItems: checkoutItems.map(item => ({
            name: item.name, price: item.price, image: item.image, customization: item.customization
        })),
        shippingAddress: { fullName, address, city, state, postalCode },
        totalPrice: subtotal,
        paymentMethod: paymentMethod,
      });

      if (paymentMethod === 'Pay Online') {
        navigate('/payment');
      } else {
        alert('Your order has been placed! Payment will be collected upon delivery.');
        navigate('/order-confirmation');
      }
    } catch (error) {
      alert('There was an error placing your order. Please try again.');
      console.error(error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    placeOrderHandler('Pay Online');
  };

  const payOnDeliveryHandler = (e) => {
    e.preventDefault();
    if (!fullName || !address || !city || !state || !postalCode) {
        alert("Please fill out all shipping details before proceeding.");
        return;
    }
    placeOrderHandler('Pay on Delivery');
  };

  const handleDetectLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            setAddress(`${addr.road || ''}, ${addr.suburb || ''}`);
            setCity('Chennai');
            setState(addr.state || '');
            setPostalCode(addr.postcode || '');
          }
        } catch (error) {
          setLocationError('Could not fetch address. Please enter manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError('Unable to retrieve your location. Please enable location permissions.');
        setLocationLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-playfair text-3xl font-bold mb-6 text-gray-800">Shipping Details</h1>
        <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-lg border">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input type="text" id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" required />
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="address" className="text-gray-700 font-semibold">Address</label>
                <button type="button" onClick={handleDetectLocation} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--theme-pink)] transition-colors">
                  <MapPin size={16} />
                  <span>{locationLoading ? 'Detecting...' : 'Detect Location'}</span>
                </button>
              </div>
              <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" required />
              {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">City</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" required />
              </div>
              <div>
                <label htmlFor="state" className="block text-gray-700 font-semibold mb-2">State</label>
                <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Gujarat" className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" required />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-gray-700 font-semibold mb-2">Postal Code</label>
                <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-lg text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" required />
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <button type="submit" className="w-full bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                Proceed to Pay Online
              </button>
              <button onClick={payOnDeliveryHandler} type="button" className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                Pay on Delivery
              </button>
            </div>
        </form>
      </div>
      <div>
        <h2 className="font-playfair text-3xl font-bold mb-6 text-gray-800">Order Summary</h2>
        <div className="bg-white p-6 rounded-lg border shadow-lg">
          {checkoutItems.map(item => (
            <div key={item.cartItemId} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-dashed text-xl">
            <span className="text-gray-800 font-bold">Total</span>
            <span className="font-bold text-gray-800">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;