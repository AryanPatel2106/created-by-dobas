import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, Search, Tag, TrendingUp, Heart, Share2, Eye } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blog data - in production, this would come from your CMS or database
  const mockPosts = [
    {
      _id: '1',
      title: 'The Art of Handmade Gift Giving: Why Personal Touch Matters',
      slug: 'art-of-handmade-gift-giving',
      excerpt: 'Discover the emotional impact of handmade gifts and how they create lasting memories that store-bought items simply cannot match.',
      content: 'Full blog content here...',
      author: 'Sarah Johnson',
      publishDate: '2024-01-15',
      category: 'Gift Ideas',
      tags: ['handmade', 'gifts', 'emotions', 'memories'],
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      readTime: 5,
      views: 1250,
      likes: 89,
      featured: true
    },
    {
      _id: '2',
      title: 'Customization Ideas for Your Perfect Wedding Cards',
      slug: 'wedding-card-customization-ideas',
      excerpt: 'Explore creative ways to personalize your wedding invitations that reflect your unique love story and style.',
      content: 'Full blog content here...',
      author: 'Michael Chen',
      publishDate: '2024-01-12',
      category: 'Wedding',
      tags: ['wedding', 'cards', 'customization', 'design'],
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop',
      readTime: 7,
      views: 980,
      likes: 67
    },
    {
      _id: '3',
      title: 'Creating Memory Boxes: Preserving Life\'s Special Moments',
      slug: 'creating-memory-boxes',
      excerpt: 'Learn how to create beautiful shadow boxes that capture and preserve your most cherished memories for years to come.',
      content: 'Full blog content here...',
      author: 'Emma Davis',
      publishDate: '2024-01-10',
      category: 'DIY',
      tags: ['memory box', 'shadow box', 'memories', 'crafts'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      readTime: 6,
      views: 756,
      likes: 45
    },
    {
      _id: '4',
      title: 'Family Tree Art: Celebrating Your Heritage',
      slug: 'family-tree-art-heritage',
      excerpt: 'Discover different styles and approaches to creating stunning family tree artwork that honors your ancestry.',
      content: 'Full blog content here...',
      author: 'David Wilson',
      publishDate: '2024-01-08',
      category: 'Family',
      tags: ['family tree', 'heritage', 'art', 'genealogy'],
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=400&fit=crop',
      readTime: 8,
      views: 1100,
      likes: 78
    },
    {
      _id: '5',
      title: 'Seasonal Gift Ideas: Handmade Presents for Every Occasion',
      slug: 'seasonal-handmade-gift-ideas',
      excerpt: 'From birthdays to holidays, discover handmade gift ideas that are perfect for every season and celebration.',
      content: 'Full blog content here...',
      author: 'Lisa Rodriguez',
      publishDate: '2024-01-05',
      category: 'Gift Ideas',
      tags: ['seasonal', 'gifts', 'occasions', 'celebrations'],
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=400&fit=crop',
      readTime: 4,
      views: 892,
      likes: 56
    },
    {
      _id: '6',
      title: 'The Psychology of Color in Gift Design',
      slug: 'psychology-color-gift-design',
      excerpt: 'Understanding how colors evoke emotions and how to choose the perfect color palette for your personalized gifts.',
      content: 'Full blog content here...',
      author: 'Dr. Amanda Foster',
      publishDate: '2024-01-03',
      category: 'Design',
      tags: ['color psychology', 'design', 'emotions', 'gifts'],
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop',
      readTime: 9,
      views: 654,
      likes: 42
    }
  ];

  const mockCategories = [
    { name: 'Gift Ideas', count: 15 },
    { name: 'Wedding', count: 8 },
    { name: 'DIY', count: 12 },
    { name: 'Family', count: 6 },
    { name: 'Design', count: 10 },
    { name: 'Tutorials', count: 7 }
  ];

  useEffect(() => {
    // Simulate API call
    const loadBlogData = async () => {
      try {
        setLoading(true);
        // In production, replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPosts(mockPosts);
        setCategories(mockCategories);
        setFeaturedPost(mockPosts.find(post => post.featured));
      } catch (error) {
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  const getFilteredPosts = () => {
    let filtered = posts.filter(post => !post.featured);

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    return filtered;
  };

  const BlogCard = ({ post, featured = false }) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      <div className={`${featured ? 'lg:flex' : ''}`}>
        <div className={`${featured ? 'lg:w-1/2' : ''}`}>
          <img
            src={post.image}
            alt={post.title}
            className={`w-full object-cover ${featured ? 'h-64 lg:h-full' : 'h-48'}`}
          />
        </div>
        
        <div className={`p-6 ${featured ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
          <div className="flex items-center gap-4 mb-3">
            <span className="bg-[var(--theme-pink)] text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            {featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          <h2 className={`font-bold text-gray-800 mb-3 hover:text-[var(--theme-pink)] transition-colors ${
            featured ? 'text-2xl lg:text-3xl' : 'text-xl'
          }`}>
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>

          <p className={`text-gray-600 mb-4 ${featured ? 'text-lg' : ''}`}>
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
            </div>

            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-[var(--theme-pink)] font-semibold hover:gap-3 transition-all"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading blog posts..." />
      </div>
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover inspiration, tips, and stories about handmade gifts, personalization, and creating meaningful connections through thoughtful presents.
          </p>
        </motion.div>

        {error && (
          <div className="mb-8">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[var(--theme-pink)]" />
              Featured Post
            </h2>
            <BlogCard post={featuredPost} featured={true} />
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory === 'all' ? 'Latest Posts' : `${selectedCategory} Posts`}
            </h2>
            <span className="text-gray-600">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Posts Found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No blog posts available at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Categories Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === category.name
                      ? 'bg-[var(--theme-pink)] text-gray-800'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className="text-sm">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage;
