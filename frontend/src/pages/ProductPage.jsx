import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, Package, Truck, Shield, ArrowLeft, X, ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCheckout } from '../context/CheckoutContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EnhancedCustomizationModal from '../components/EnhancedCustomizationModal';
import ReviewsSection from '../components/ReviewsSection';
import Rating from '../components/Rating';

const CustomizationModal = ({ product, onConfirm, onCancel }) => {
  // This component's code remains exactly the same as before
  const [forWhom, setForWhom] = useState('');
  const [relation, setRelation] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = () => {
    const customizationDetails = { forWhom, relation, description };
    onConfirm(customizationDetails);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-playfair text-3xl font-bold text-gray-800">Customize Your Item</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-800 transition-colors"><X size={28} /></button>
        </div>
        <p className="text-gray-600 mb-6">Provide the details below for your personalized "{product.name}".</p>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-600 mb-2">For whom is this gift? (e.g., Mom, John)</label><input type="text" value={forWhom} onChange={e => setForWhom(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" /></div>
          <div><label className="block text-sm font-medium text-gray-600 mb-2">What's your relationship? (e.g., Son, Friend)</label><input type="text" value={relation} onChange={e => setRelation(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" /></div>
          <div><label className="block text-sm font-medium text-gray-600 mb-2">Describe your custom request (colors, names, special message)</label><textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]"></textarea></div>
        </div>
        <button onClick={handleSubmit} className="mt-8 w-full flex items-center justify-center gap-3 bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg">Confirm & Add to Cart</button>
      </motion.div>
    </motion.div>
  );
};

const ProductPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  
  // State for the new review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { initiateCheckout } = useCheckout();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/api/products/${productId}`);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleActionClick = (type) => {
    if (!user) {
      navigate('/login');
    } else {
      setActionType(type);
      setIsModalOpen(true);
    }
  };

  const handleConfirm = (customizationDetails) => {
    if (actionType === 'cart') {
      addToCart(product, customizationDetails);
      alert(`${product.name} has been added to your cart!`);
    } else if (actionType === 'buyNow') {
      initiateCheckout([{...product, customization: customizationDetails, cartItemId: `${product._id}-${Date.now()}`}]);
    }
    setIsModalOpen(false);
  };

  const reviewSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        setReviewLoading(true);
        setReviewError(null);
        await api.post(`/api/products/${productId}/reviews`, {
            rating,
            comment,
            user: { name: user.name, email: user.email }
        });
        alert('Review Submitted!');
        setRating(0);
        setComment('');
        fetchProduct(); // Re-fetch product to show the new review
    } catch (error) {
        console.error('Failed to submit review:', error);
        setReviewError(error.response?.data?.message || 'Error submitting review');
    } finally {
        setReviewLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="py-16 md:py-24">
        <LoadingSpinner text="Loading product..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 md:py-24 max-w-md mx-auto">
        <ErrorMessage message={error} onRetry={fetchProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 md:py-24 text-center">
        <p className="text-red-500 text-lg">Product not found.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to Products
        </Link>
      </div>
    );
  }
  
  const hasUserReviewed = product.reviews.find(r => r.user === user?.email);

  return (
    <>
      <AnimatePresence>
        {isModalOpen && <EnhancedCustomizationModal product={product} onConfirm={handleConfirm} onCancel={() => setIsModalOpen(false)} />}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-6 sm:mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Products
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7 }} 
            className="rounded-xl overflow-hidden shadow-xl md:sticky md:top-24"
          >
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 md:mt-0"
          >
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
            <div className="mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <p className="text-3xl font-semibold text-gray-700 mb-5">₹{product.price}</p>
            <p className="text-gray-600 mb-6 leading-relaxed text-base">{product.description}</p>
            <div className="bg-white/70 p-5 rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-5">
                <span className="text-base font-medium text-gray-700">Status:</span>
                <span className={`font-bold text-base ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleActionClick('cart')} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg text-base hover:bg-gray-50 transition-all duration-300 transform hover:scale-105" disabled={product.countInStock === 0}><ShoppingBag />Add To Cart</button>
                <button onClick={() => handleActionClick('buyNow')} className="w-full flex items-center justify-center gap-3 bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-base hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg" disabled={product.countInStock === 0}><Zap />Buy Now</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- ENHANCED REVIEWS SECTION --- */}
        <div className="mt-12 sm:mt-16">
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Customer Reviews</h2>
          <ReviewsSection 
            productId={product._id} 
            reviews={product.reviews} 
            onReviewAdded={(newReview) => {
              setProduct(prev => ({
                ...prev,
                reviews: [newReview, ...prev.reviews]
              }));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProductPage;