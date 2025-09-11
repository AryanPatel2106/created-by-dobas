import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import { motion } from 'framer-motion';
import FloatingShapes from '../components/FloatingShapes';
import Rating from '../components/Rating'; // Import the Rating component

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
        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10"
      >
        Discover unique, handmade treasures for every celebration. Each piece tells a story.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <a href="#products" className="bg-[var(--theme-pink)] text-gray-800 font-bold py-3 px-8 rounded-full text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg">
          Explore Collection
        </a>
      </motion.div>
    </div>
  </div>
);

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => {
        const fetchTestimonials = async () => {
            const { data } = await axios.get('/api/testimonials');
            setTestimonials(data);
        };
        fetchTestimonials();
    }, []);

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
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

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
      <div id="products" className="py-16">
        <h2 className="font-playfair text-4xl font-bold text-center mb-12 text-gray-800">Our Latest Creations</h2>
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
      </div>
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;