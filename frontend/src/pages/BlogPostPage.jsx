import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowLeft, Heart, Share2, Eye, Tag, MessageCircle, ThumbsUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  // Mock blog post data - in production, this would come from your CMS or database
  const mockPost = {
    _id: '1',
    title: 'The Art of Handmade Gift Giving: Why Personal Touch Matters',
    slug: 'art-of-handmade-gift-giving',
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="lead">In a world increasingly dominated by mass-produced items and digital interactions, the art of handmade gift giving stands as a beacon of authenticity and personal connection. There's something profoundly meaningful about receiving a gift that someone has crafted with their own hands, infused with time, thought, and genuine care.</p>

        <h2>The Emotional Impact of Handmade Gifts</h2>
        <p>When we give a handmade gift, we're not just giving an object – we're giving a piece of ourselves. The time spent selecting materials, the hours devoted to crafting, and the attention to detail all communicate a message that no store-bought item can convey: "You matter enough for me to invest my most precious resource – my time – in creating something just for you."</p>

        <blockquote>
          "The best gifts are those that come from the heart, crafted with love, and given with intention."
        </blockquote>

        <h2>Creating Lasting Memories</h2>
        <p>Handmade gifts have a unique ability to create lasting memories. Unlike mass-produced items that might be forgotten or replaced, a handmade gift carries with it the story of its creation. Every time the recipient looks at or uses the gift, they're reminded not just of the occasion, but of the love and effort that went into making it.</p>

        <h3>The Psychology Behind Personal Touch</h3>
        <p>Research in psychology shows that personalized gifts activate different emotional responses in our brains compared to generic presents. When we receive something made specifically for us, it triggers feelings of:</p>
        <ul>
          <li><strong>Validation:</strong> Someone took the time to think about our preferences and personality</li>
          <li><strong>Connection:</strong> The gift creates a tangible bond between giver and receiver</li>
          <li><strong>Uniqueness:</strong> We feel special knowing this gift exists only for us</li>
          <li><strong>Gratitude:</strong> The visible effort invested makes us more appreciative</li>
        </ul>

        <h2>The Art of Personalization</h2>
        <p>Personalization goes beyond simply adding a name or date to an item. True personalization involves understanding the recipient's personality, interests, memories, and dreams. It's about creating something that reflects who they are and celebrates your relationship with them.</p>

        <h3>Ideas for Personal Touches</h3>
        <p>Here are some ways to add meaningful personalization to your handmade gifts:</p>
        <ol>
          <li><strong>Memory Integration:</strong> Incorporate shared memories, inside jokes, or significant dates</li>
          <li><strong>Color Psychology:</strong> Use colors that have special meaning or that you know they love</li>
          <li><strong>Texture and Materials:</strong> Choose materials that appeal to their senses</li>
          <li><strong>Functional Beauty:</strong> Create something they'll actually use and enjoy daily</li>
          <li><strong>Future Aspirations:</strong> Design something that supports their goals or dreams</li>
        </ol>

        <h2>The Ripple Effect of Handmade Giving</h2>
        <p>When you give a handmade gift, you're not just impacting the recipient – you're contributing to a larger cultural shift toward valuing craftsmanship, sustainability, and human connection. You're supporting the idea that things made with care and intention have more value than things made quickly and cheaply.</p>

        <h2>Getting Started with Handmade Gifts</h2>
        <p>If you're new to creating handmade gifts, start small and focus on the intention behind your creation rather than perfection. Some beginner-friendly ideas include:</p>
        <ul>
          <li>Personalized photo albums or scrapbooks</li>
          <li>Hand-written letters or poems in beautiful frames</li>
          <li>Custom recipe collections for food lovers</li>
          <li>Painted or decorated picture frames</li>
          <li>Handmade candles with personalized scents</li>
        </ul>

        <h2>Conclusion</h2>
        <p>In our fast-paced world, taking the time to create something by hand is itself a gift – both to the recipient and to yourself. The process of making something with your hands is meditative, fulfilling, and connects you to generations of craftspeople who understood that the best gifts come from the heart.</p>

        <p>Remember, it's not about creating something perfect or professional-looking. It's about creating something that comes from a place of love and carries with it the irreplaceable value of human touch and personal intention.</p>
      </div>
    `,
    author: 'Sarah Johnson',
    authorBio: 'Sarah is a craft enthusiast and gift-giving expert with over 10 years of experience in creating personalized handmade items.',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    publishDate: '2024-01-15',
    category: 'Gift Ideas',
    tags: ['handmade', 'gifts', 'emotions', 'memories', 'personalization'],
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=600&fit=crop',
    readTime: 5,
    views: 1250,
    likes: 89
  };

  const mockRelatedPosts = [
    {
      _id: '2',
      title: 'Customization Ideas for Your Perfect Wedding Cards',
      slug: 'wedding-card-customization-ideas',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=200&fit=crop',
      category: 'Wedding',
      readTime: 7
    },
    {
      _id: '3',
      title: 'Creating Memory Boxes: Preserving Life\'s Special Moments',
      slug: 'creating-memory-boxes',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
      category: 'DIY',
      readTime: 6
    },
    {
      _id: '4',
      title: 'Seasonal Gift Ideas: Handmade Presents for Every Occasion',
      slug: 'seasonal-handmade-gift-ideas',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=200&fit=crop',
      category: 'Gift Ideas',
      readTime: 4
    }
  ];

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, fetch post by slug from API
        setPost(mockPost);
        setRelatedPosts(mockRelatedPosts);
        setLikes(mockPost.likes);
      } catch (error) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading blog post..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error || 'Blog post not found'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <span className="bg-[var(--theme-pink)] text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-playfair text-3xl md:text-5xl font-bold mb-6"
            >
              {post.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views} views</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--theme-pink)] hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-[var(--theme-pink)] prose-blockquote:border-l-[var(--theme-pink)] prose-blockquote:bg-pink-50 prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[var(--theme-pink)] hover:text-gray-800 transition-colors cursor-pointer"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Author Bio */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-start gap-4">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{post.author}</h3>
                      <p className="text-gray-600 mt-1">{post.authorBio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Social Actions */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Engage</h3>
              <div className="space-y-3">
                <button
                  onClick={handleLike}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
                    liked
                      ? 'bg-red-100 text-red-600 border border-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{likes} Likes</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <Link
                  to="/blog#comments"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comments</span>
                </Link>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Posts</h3>
              <div className="space-y-4">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost._id}
                    to={`/blog/${relatedPost.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 group-hover:text-[var(--theme-pink)] transition-colors text-sm leading-tight">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span>{relatedPost.category}</span>
                          <span>•</span>
                          <span>{relatedPost.readTime} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
