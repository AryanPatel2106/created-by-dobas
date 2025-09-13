import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, ShoppingCart, Heart, Eye, Filter, Grid, List, Package } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import AdvancedSearch from '../components/AdvancedSearch';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply initial search from URL params
    const initialSearch = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || 'all';
    
    if (initialSearch || initialCategory !== 'all') {
      handleSearch({
        searchTerm: initialSearch,
        category: initialCategory,
        ...currentFilters
      });
    }
  }, [products, searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/api/products');
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchParams) => {
    setCurrentFilters(searchParams);
    setViewMode(searchParams.viewMode || 'grid');
    
    let filtered = [...products];

    // Apply search term filter
    if (searchParams.searchTerm) {
      const searchLower = searchParams.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.category && product.category.toLowerCase().includes(searchLower)) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Apply category filter
    if (searchParams.category && searchParams.category !== 'all') {
      filtered = filtered.filter(product => {
        const productCategory = product.category?.toLowerCase() || '';
        const searchCategory = searchParams.category.toLowerCase();
        
        // Handle category matching
        if (searchCategory === 'cards') {
          return productCategory.includes('card') || productCategory.includes('greeting');
        } else if (searchCategory === 'frames') {
          return productCategory.includes('frame') || productCategory.includes('photo');
        } else if (searchCategory === 'journals') {
          return productCategory.includes('journal') || productCategory.includes('book') || productCategory.includes('notebook');
        } else if (searchCategory === 'shadow-boxes') {
          return productCategory.includes('shadow') || productCategory.includes('box');
        } else if (searchCategory === 'family-trees') {
          return productCategory.includes('family') || productCategory.includes('tree');
        } else if (searchCategory === 'gifts') {
          return productCategory.includes('gift') || productCategory.includes('custom');
        }
        
        return productCategory.includes(searchCategory);
      });
    }

    // Apply price range filter
    if (searchParams.priceRange?.min || searchParams.priceRange?.max) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        const min = searchParams.priceRange.min ? parseFloat(searchParams.priceRange.min) : 0;
        const max = searchParams.priceRange.max ? parseFloat(searchParams.priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply rating filter
    if (searchParams.rating && searchParams.rating !== 'all') {
      filtered = filtered.filter(product => {
        const avgRating = getAverageRating(product.reviews || []);
        if (searchParams.rating === '5') return avgRating >= 4.5;
        if (searchParams.rating === '4+') return avgRating >= 4;
        if (searchParams.rating === '3+') return avgRating >= 3;
        if (searchParams.rating === '2+') return avgRating >= 2;
        return true;
      });
    }

    // Apply stock filter
    if (searchParams.inStock) {
      filtered = filtered.filter(product => product.countInStock > 0);
    }

    // Apply sale filter
    if (searchParams.onSale) {
      filtered = filtered.filter(product => product.salePrice && product.salePrice < product.price);
    }

    // Apply customizable filter
    if (searchParams.customizable) {
      filtered = filtered.filter(product => 
        product.customizable || 
        product.description?.toLowerCase().includes('custom') ||
        product.name?.toLowerCase().includes('custom')
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (searchParams.sortBy) {
        case 'price-low':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'rating':
          return getAverageRating(b.reviews || []) - getAverageRating(a.reviews || []);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProducts(filtered);

    // Update URL params
    const newSearchParams = new URLSearchParams();
    if (searchParams.searchTerm) {
      newSearchParams.set('q', searchParams.searchTerm);
    }
    if (searchParams.category && searchParams.category !== 'all') {
      newSearchParams.set('category', searchParams.category);
    }
    setSearchParams(newSearchParams);
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const ProductCard = ({ product }) => {
    const averageRating = getAverageRating(product.reviews || []);
    const isOnSale = product.salePrice && product.salePrice < product.price;

    if (viewMode === 'list') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="flex">
            <div className="w-48 h-48 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {isOnSale && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  SALE
                </span>
              )}
              {product.countInStock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold">OUT OF STOCK</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800 hover:text-[var(--theme-pink)] transition-colors">
                  <Link to={`/product/${product._id}`}>
                    {product.name}
                  </Link>
                </h3>
                <div className="text-right">
                  {isOnSale ? (
                    <div>
                      <span className="text-2xl font-bold text-red-600">${product.salePrice}</span>
                      <span className="text-lg text-gray-500 line-through ml-2">${product.price}</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(averageRating)}
                  <span className="text-sm text-gray-600">
                    ({product.reviews?.length || 0} reviews)
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{product.views || 0}</span>
                  </div>
                  <span className={`font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/product/${product._id}`}
                  className="flex-1 bg-[var(--theme-pink)] text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all text-center"
                >
                  View Details
                </Link>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Grid view
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              SALE
            </span>
          )}
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">OUT OF STOCK</span>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-[var(--theme-pink)] transition-colors">
            <Link to={`/product/${product._id}`}>
              {product.name}
            </Link>
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {renderStars(averageRating)}
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviews?.length || 0})
              </span>
            </div>
            <span className={`text-xs font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            {isOnSale ? (
              <div>
                <span className="text-xl font-bold text-red-600">${product.salePrice}</span>
                <span className="text-sm text-gray-500 line-through ml-1">${product.price}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-gray-800">${product.price}</span>
            )}
          </div>

          <Link
            to={`/product/${product._id}`}
            className="w-full bg-[var(--theme-pink)] text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all text-center block"
          >
            View Details
          </Link>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Products</h1>
          <p className="text-gray-600">
            Find the perfect handmade gift from our collection of personalized items
          </p>
        </motion.div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={fetchProducts} />
          </div>
        )}

        {/* Advanced Search Component */}
        <AdvancedSearch
          onSearch={handleSearch}
          initialFilters={{
            searchTerm: searchParams.get('q') || '',
            category: searchParams.get('category') || 'all'
          }}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Search Results
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              {currentFilters.searchTerm && (
                <span> for "{currentFilters.searchTerm}"</span>
              )}
            </p>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or browse our categories
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[var(--theme-pink)] text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
          }>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
