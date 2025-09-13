import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building, Wallet, Shield, MapPin, Truck } from 'lucide-react';

const EnhancedCheckoutForm = ({ 
  checkoutItems, 
  user, 
  onPlaceOrder, 
  loading = false 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    
    // Payment Information
    paymentMethod: '',
    
    // Card Details (if card payment)
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // UPI Details (if UPI payment)
    upiId: '',
    
    // Special Instructions
    deliveryInstructions: '',
    giftMessage: ''
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks supported'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, Amazon Pay'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: Truck,
      description: 'Pay when you receive',
      fee: 50
    }
  ];

  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price, 0);
  const shippingFee = 100;
  const codFee = formData.paymentMethod === 'cod' ? 50 : 0;
  const total = subtotal + shippingFee + codFee;

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
      
      // Gujarat delivery validation
      if (formData.state.toLowerCase().trim() !== 'gujarat') {
        newErrors.state = 'Delivery is currently only available in Gujarat';
      }
    }
    
    if (step === 2) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method';
      
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
      }
      
      if (formData.paymentMethod === 'upi') {
        if (!formData.upiId.trim()) newErrors.upiId = 'UPI ID is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onPlaceOrder(formData);
    }
  };

  const renderShippingForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-[var(--theme-pink)]" />
        <h3 className="text-xl font-semibold text-gray-800">Shipping Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          rows="3"
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Enter your complete address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.city ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="City"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => updateFormData('state', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.state ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Gujarat"
          />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          <p className="text-xs text-gray-500 mt-1">Currently delivering only in Gujarat</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => updateFormData('postalCode', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.postalCode ? 'border-red-300' : 'border-gray-300'}`}
            placeholder="Postal Code"
          />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Instructions (Optional)
        </label>
        <textarea
          rows="2"
          value={formData.deliveryInstructions}
          onChange={(e) => updateFormData('deliveryInstructions', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
          placeholder="Any special delivery instructions..."
        />
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-[var(--theme-pink)]" />
        <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => updateFormData('paymentMethod', method.id)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                formData.paymentMethod === method.id
                  ? 'border-[var(--theme-pink)] bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-gray-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{method.name}</p>
                      {method.popular && (
                        <span className="px-2 py-1 text-xs bg-[var(--theme-pink)] text-gray-800 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                {method.fee && (
                  <p className="text-sm text-gray-600">+₹{method.fee}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}

      {/* Card Payment Details */}
      {formData.paymentMethod === 'card' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-medium text-gray-800">Card Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => updateFormData('cardNumber', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => updateFormData('expiryDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="MM/YY"
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => updateFormData('cvv', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.cvv ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="123"
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name *
            </label>
            <input
              type="text"
              value={formData.cardholderName}
              onChange={(e) => updateFormData('cardholderName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.cardholderName ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Name as on card"
            />
            {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
          </div>
        </motion.div>
      )}

      {/* UPI Payment Details */}
      {formData.paymentMethod === 'upi' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-medium text-gray-800">UPI Details</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID *
            </label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => updateFormData('upiId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent ${errors.upiId ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="yourname@paytm"
            />
            {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
          </div>
        </motion.div>
      )}

      {/* Gift Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gift Message (Optional)
        </label>
        <textarea
          rows="3"
          value={formData.giftMessage}
          onChange={(e) => updateFormData('giftMessage', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
          placeholder="Add a personal message for the recipient..."
        />
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        {checkoutItems.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.name}</p>
              {item.customization && (
                <p className="text-sm text-gray-600">
                  For: {item.customization.forWhom || 'Custom order'}
                </p>
              )}
            </div>
            <p className="font-medium text-gray-800">₹{item.price}</p>
          </div>
        ))}
      </div>

      <hr className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>₹{shippingFee}</span>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>COD Fee</span>
            <span>₹{codFee}</span>
          </div>
        )}
        <hr className="my-2" />
        <div className="flex justify-between text-lg font-semibold text-gray-800">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step 
                  ? 'bg-[var(--theme-pink)] text-gray-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              <span className={`ml-2 ${currentStep >= step ? 'text-gray-800' : 'text-gray-500'}`}>
                {step === 1 ? 'Shipping' : 'Payment'}
              </span>
              {step < 2 && (
                <div className={`w-16 h-0.5 ml-4 ${
                  currentStep > step ? 'bg-[var(--theme-pink)]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {currentStep === 1 && renderShippingForm()}
            {currentStep === 2 && renderPaymentForm()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {currentStep < 2 ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-[var(--theme-pink)] text-gray-800 font-semibold rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all"
                >
                  Continue to Payment
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-[var(--theme-pink)] text-gray-800 font-semibold rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckoutForm;
