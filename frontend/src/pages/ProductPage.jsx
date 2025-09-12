import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCheckout } from '../context/CheckoutContext.jsx';
import { ShoppingBag, ArrowLeft, X, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  
  // State for the new review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { initiateCheckout } = useCheckout();

  const fetchProduct = async () => {
    setLoading(true);
    const { data } = await api.get(`/api/products/${productId}`);
    setProduct(data);
    setLoading(false);
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
        alert(error.response?.data?.message || 'Error submitting review');
    }
  };
  
  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found.</div>;
  
  const hasUserReviewed = product.reviews.find(r => r.user === user?.email);

  return (
    <>
      <AnimatePresence>
        {isModalOpen && <CustomizationModal product={product} onConfirm={handleConfirm} onCancel={() => setIsModalOpen(false)} />}
      </AnimatePresence>
      
      <div className="py-12">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Products
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="rounded-xl overflow-hidden shadow-xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="mb-4">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            <p className="text-4xl font-semibold text-gray-700 mb-6">₹{product.price}</p>
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            <div className="bg-white/70 p-6 rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-gray-700">Status:</span>
                <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button onClick={() => handleActionClick('cart')} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-lg text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105" disabled={product.countInStock === 0}><ShoppingBag />Add To Cart</button>
                <button onClick={() => handleActionClick('buyNow')} className="w-full flex items-center justify-center gap-3 bg-[var(--theme-pink)] text-gray-800 font-bold py-4 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg" disabled={product.countInStock === 0}><Zap />Buy Now</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- REVIEWS SECTION --- */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                {product.reviews.length === 0 && <div className="bg-white p-4 rounded-lg border text-gray-600">No reviews yet.</div>}
                <div className="space-y-6">
                    {product.reviews.map(review => (
                        <div key={review._id} className="bg-white p-6 rounded-lg border">
                            <div className="flex items-center justify-between">
                                <strong className="text-gray-800">{review.name}</strong>
                                <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <Rating value={review.rating} />
                            <p className="mt-2 text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Write a Review</h2>
                {user ? (
                    hasUserReviewed ? (
                        <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 text-blue-800">You have already submitted a review for this product.</div>
                    ) : (
                        <form onSubmit={reviewSubmitHandler} className="bg-white p-6 rounded-lg border">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                                <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2" required>
                                    <option value="">Select...</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Comment</label>
                                <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all">Submit Review</button>
                        </form>
                    )
                ) : (
                    <div className="bg-gray-100 p-4 rounded-lg border">
                        Please <Link to="/login" className="text-blue-600 font-semibold hover:underline">sign in</Link> to write a review.
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;