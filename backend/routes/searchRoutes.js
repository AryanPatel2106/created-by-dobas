import express from 'express';
const router = express.Router();

// Mock product data for search functionality
const mockProducts = [
  {
    _id: '1',
    name: 'Personalized Birthday Card',
    description: 'Beautiful handmade birthday card with custom message and design',
    price: 15.99,
    salePrice: 12.99,
    category: 'Greeting Cards',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    countInStock: 25,
    customizable: true,
    tags: ['birthday', 'card', 'personalized', 'handmade'],
    reviews: [
      { rating: 5, comment: 'Amazing quality!', verified: true },
      { rating: 4, comment: 'Beautiful design', verified: true }
    ],
    views: 150,
    createdAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Custom Photo Frame',
    description: 'Elegant wooden photo frame with personalized engraving',
    price: 45.00,
    category: 'Photo Frames',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400',
    countInStock: 15,
    customizable: true,
    tags: ['frame', 'photo', 'wooden', 'engraved'],
    reviews: [
      { rating: 5, comment: 'Perfect gift!', verified: true },
      { rating: 5, comment: 'Excellent craftsmanship', verified: false }
    ],
    views: 89,
    createdAt: new Date('2024-01-20')
  },
  {
    _id: '3',
    name: 'Memory Journal',
    description: 'Handbound leather journal for capturing precious memories',
    price: 35.00,
    category: 'Journals & Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    countInStock: 0,
    customizable: true,
    tags: ['journal', 'leather', 'memory', 'handbound'],
    reviews: [
      { rating: 4, comment: 'Great quality leather', verified: true }
    ],
    views: 67,
    createdAt: new Date('2024-01-10')
  },
  {
    _id: '4',
    name: 'Wedding Shadow Box',
    description: 'Beautiful shadow box to display wedding memories and keepsakes',
    price: 85.00,
    salePrice: 75.00,
    category: 'Shadow Boxes',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400',
    countInStock: 8,
    customizable: true,
    tags: ['wedding', 'shadow box', 'memories', 'display'],
    reviews: [
      { rating: 5, comment: 'Absolutely stunning!', verified: true },
      { rating: 5, comment: 'Perfect for our wedding memories', verified: true },
      { rating: 4, comment: 'High quality materials', verified: false }
    ],
    views: 234,
    createdAt: new Date('2024-01-25')
  },
  {
    _id: '5',
    name: 'Family Tree Artwork',
    description: 'Custom family tree art with personalized names and dates',
    price: 65.00,
    category: 'Family Tree Art',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    countInStock: 12,
    customizable: true,
    tags: ['family tree', 'artwork', 'genealogy', 'custom'],
    reviews: [
      { rating: 5, comment: 'Beautiful family heirloom', verified: true },
      { rating: 4, comment: 'Great attention to detail', verified: true }
    ],
    views: 178,
    createdAt: new Date('2024-02-01')
  },
  {
    _id: '6',
    name: 'Anniversary Gift Set',
    description: 'Curated gift set with personalized items for anniversaries',
    price: 120.00,
    category: 'Custom Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
    countInStock: 5,
    customizable: true,
    tags: ['anniversary', 'gift set', 'romantic', 'personalized'],
    reviews: [
      { rating: 5, comment: 'Perfect anniversary gift!', verified: true }
    ],
    views: 95,
    createdAt: new Date('2024-02-05')
  }
];

// Advanced search endpoint
router.get('/search', async (req, res) => {
  try {
    const {
      q: searchTerm = '',
      category = 'all',
      minPrice,
      maxPrice,
      rating,
      inStock,
      onSale,
      customizable,
      sortBy = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    let filteredProducts = [...mockProducts];

    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const productCategory = product.category.toLowerCase();
        const searchCategory = category.toLowerCase();
        
        // Handle category matching
        if (searchCategory === 'cards') {
          return productCategory.includes('card') || productCategory.includes('greeting');
        } else if (searchCategory === 'frames') {
          return productCategory.includes('frame') || productCategory.includes('photo');
        } else if (searchCategory === 'journals') {
          return productCategory.includes('journal') || productCategory.includes('book');
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
    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.salePrice || product.price;
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply rating filter
    if (rating && rating !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const avgRating = getAverageRating(product.reviews || []);
        if (rating === '5') return avgRating >= 4.5;
        if (rating === '4+') return avgRating >= 4;
        if (rating === '3+') return avgRating >= 3;
        if (rating === '2+') return avgRating >= 2;
        return true;
      });
    }

    // Apply stock filter
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(product => product.countInStock > 0);
    }

    // Apply sale filter
    if (onSale === 'true') {
      filteredProducts = filteredProducts.filter(product => 
        product.salePrice && product.salePrice < product.price
      );
    }

    // Apply customizable filter
    if (customizable === 'true') {
      filteredProducts = filteredProducts.filter(product => product.customizable);
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      switch (sortBy) {
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

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Calculate pagination info
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      filters: {
        searchTerm,
        category,
        minPrice,
        maxPrice,
        rating,
        inStock: inStock === 'true',
        onSale: onSale === 'true',
        customizable: customizable === 'true',
        sortBy
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Failed to search products',
      error: error.message 
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q: searchTerm = '' } = req.query;
    
    if (!searchTerm || searchTerm.length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchLower = searchTerm.toLowerCase();
    const suggestions = new Set();

    // Add matching product names
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(searchLower)) {
        suggestions.add(product.name);
      }
      
      // Add matching tags
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(searchLower)) {
          suggestions.add(tag);
        }
      });
      
      // Add matching categories
      if (product.category.toLowerCase().includes(searchLower)) {
        suggestions.add(product.category);
      }
    });

    const suggestionArray = Array.from(suggestions).slice(0, 8);
    
    res.json({ suggestions: suggestionArray });
    
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      message: 'Failed to get suggestions',
      error: error.message 
    });
  }
});

// Get popular searches
router.get('/popular', async (req, res) => {
  try {
    const popularSearches = [
      'birthday cards',
      'wedding gifts',
      'photo frames',
      'custom journals',
      'family tree',
      'anniversary gifts',
      'personalized cards',
      'shadow boxes'
    ];
    
    res.json({ popular: popularSearches });
    
  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({ 
      message: 'Failed to get popular searches',
      error: error.message 
    });
  }
});

// Helper function to calculate average rating
function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

export default router;
