import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowRight, Search, Heart, Gift, BookOpen, Frame, Package, TreePine } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Product from '../components/Product';
import FloatingShapes from '../components/FloatingShapes';
import Rating from '../components/Rating';

const HeroSection = () => (
  <div className="relative text-center py-20 md:py-32 h-screen flex flex-col justify-center items-center overflow-hidden">
    <FloatingShapes />
    <div className="relative z-10">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-playfair text-5xl md:text-7xl font-extrabold text-gray-800 mb-6"
      >
        Gifts Crafted with Heart
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
      >
        Handcrafted with love, personalized just for you
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link 
          to="/product/1" 
          className="inline-flex items-center gap-2 bg-[var(--theme-pink)] text-gray-800 font-bold py-4 px-8 rounded-full hover:bg-[var(--theme-pink-hover)] transition-all transform hover:scale-105 shadow-lg"
        >
          Shop Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  </div>
);

const SearchSection = ({ searchTerm, setSearchTerm, handleSearch, handleCategoryClick }) => {
  const categories = [
    { id: 'cards', name: 'Greeting Cards', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { id: 'frames', name: 'Photo Frames', icon: Frame, color: 'bg-blue-100 text-blue-600' },
    { id: 'journals', name: 'Journals', icon: BookOpen, color: 'bg-green-100 text-green-600' },
    { id: 'shadow-boxes', name: 'Shadow Boxes', icon: Package, color: 'bg-purple-100 text-purple-600' },
    { id: 'family-trees', name: 'Family Trees', icon: TreePine, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'gifts', name: 'Custom Gifts', icon: Gift, color: 'bg-orange-100 text-orange-600' }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Your Perfect Gift</h2>
          <p className="text-gray-600 mb-8">Search our collection or browse by category</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for personalized gifts, cards, frames..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-[var(--theme-pink)] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-[var(--theme-pink)] text-gray-800 p-3 rounded-full hover:bg-[var(--theme-pink-hover)] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleCategoryClick(category.id)}
                className={`${category.color} p-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <IconComponent className="w-8 h-8 mx-auto mb-3" />
                <span className="text-sm font-semibold block">{category.name}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/testimonials');
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            setError('Failed to load testimonials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    if (loading) {
        return (
            <div className="py-24 bg-white/50">
                <div className="container mx-auto px-6">
                    <h2 className="font-playfair text-4xl font-bold text-center mb-12 text-gray-800">What Our Customers Say</h2>
                    <LoadingSpinner text="Loading testimonials..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-24 bg-white/50">
                <div className="container mx-auto px-6">
                    <h2 className="font-playfair text-4xl font-bold text-center mb-12 text-gray-800">What Our Customers Say</h2>
                    <ErrorMessage message={error} onRetry={fetchTestimonials} />
                </div>
            </div>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <div className="py-24 bg-white/50">
            <div className="container mx-auto px-6">
                <h2 className="font-playfair text-4xl font-bold text-center mb-12 text-gray-800">What Our Customers Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div 
                            key={testimonial._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white p-8 rounded-lg shadow-lg border"
                        >
                            <div className="flex items-center mb-4">
                                <img src={testimonial.user.picture} alt={testimonial.user.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                <div>
                                    <p className="font-bold text-gray-800">{testimonial.user.name}</p>
                                    <Rating value={testimonial.rating} />
                                </div>
                            </div>
                            <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${category}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div>
      <HeroSection />
      
      <SearchSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleCategoryClick={handleCategoryClick}
      />
      
      <div id="products" className="py-16">
        <h2 className="font-playfair text-4xl font-bold text-center mb-12 text-gray-800">Our Latest Creations</h2>
        
        {loading && <LoadingSpinner text="Loading products..." />}
        
        {error && (
          <div className="max-w-md mx-auto">
            <ErrorMessage message={error} onRetry={fetchProducts} />
          </div>
        )}
        
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
          </div>
        )}
        
        {!loading && !error && products.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <Product product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;