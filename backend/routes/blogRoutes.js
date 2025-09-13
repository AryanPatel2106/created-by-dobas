import express from 'express';
const router = express.Router();

// In-memory blog storage (should be in database in production)
const blogPosts = new Map();
const blogCategories = new Map();

// Initialize with some sample data
const samplePosts = [
  {
    _id: '1',
    title: 'The Art of Handmade Gift Giving: Why Personal Touch Matters',
    slug: 'art-of-handmade-gift-giving',
    excerpt: 'Discover the emotional impact of handmade gifts and how they create lasting memories that store-bought items simply cannot match.',
    content: 'Full blog content here...',
    author: 'Sarah Johnson',
    authorBio: 'Sarah is a craft enthusiast and gift-giving expert with over 10 years of experience.',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    publishDate: '2024-01-15',
    category: 'Gift Ideas',
    tags: ['handmade', 'gifts', 'emotions', 'memories'],
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
    readTime: 5,
    views: 1250,
    likes: 89,
    featured: true,
    published: true
  },
  {
    _id: '2',
    title: 'Customization Ideas for Your Perfect Wedding Cards',
    slug: 'wedding-card-customization-ideas',
    excerpt: 'Explore creative ways to personalize your wedding invitations that reflect your unique love story and style.',
    content: 'Full blog content here...',
    author: 'Michael Chen',
    authorBio: 'Michael specializes in wedding stationery and custom design.',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    publishDate: '2024-01-12',
    category: 'Wedding',
    tags: ['wedding', 'cards', 'customization', 'design'],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop',
    readTime: 7,
    views: 980,
    likes: 67,
    featured: false,
    published: true
  }
];

const sampleCategories = [
  { name: 'Gift Ideas', count: 15, description: 'Creative ideas for meaningful gifts' },
  { name: 'Wedding', count: 8, description: 'Wedding-related crafts and ideas' },
  { name: 'DIY', count: 12, description: 'Do-it-yourself tutorials and guides' },
  { name: 'Family', count: 6, description: 'Family-focused projects and memories' },
  { name: 'Design', count: 10, description: 'Design tips and inspiration' },
  { name: 'Tutorials', count: 7, description: 'Step-by-step craft tutorials' }
];

// Initialize data
samplePosts.forEach(post => blogPosts.set(post._id, post));
sampleCategories.forEach(category => blogCategories.set(category.name, category));

// GET all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, limit } = req.query;
    let posts = Array.from(blogPosts.values()).filter(post => post.published);

    // Apply filters
    if (category && category !== 'all') {
      posts = posts.filter(post => post.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (featured === 'true') {
      posts = posts.filter(post => post.featured);
    }

    // Sort by publish date (newest first)
    posts.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

    // Apply limit
    if (limit) {
      posts = posts.slice(0, parseInt(limit));
    }

    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Failed to fetch blog posts', error: error.message });
  }
});

// GET single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = Array.from(blogPosts.values()).find(p => p.slug === slug && p.published);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view count
    post.views = (post.views || 0) + 1;
    blogPosts.set(post._id, post);

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Failed to fetch blog post', error: error.message });
  }
});

// GET blog categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = Array.from(blogCategories.values());
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

// POST like a blog post
router.post('/:slug/like', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = Array.from(blogPosts.values()).find(p => p.slug === slug);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    post.likes = (post.likes || 0) + 1;
    blogPosts.set(post._id, post);

    res.json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking blog post:', error);
    res.status(500).json({ message: 'Failed to like blog post', error: error.message });
  }
});

// GET related posts
router.get('/:slug/related', async (req, res) => {
  try {
    const { slug } = req.params;
    const currentPost = Array.from(blogPosts.values()).find(p => p.slug === slug);

    if (!currentPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Find related posts by category and tags
    let relatedPosts = Array.from(blogPosts.values())
      .filter(post => 
        post.published && 
        post._id !== currentPost._id &&
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, 3);

    res.json(relatedPosts);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    res.status(500).json({ message: 'Failed to fetch related posts', error: error.message });
  }
});

// Admin routes for blog management

// CREATE new blog post (admin only)
router.post('/admin/posts', async (req, res) => {
  try {
    const postData = req.body;
    const postId = Date.now().toString();
    
    const newPost = {
      _id: postId,
      ...postData,
      publishDate: postData.publishDate || new Date().toISOString(),
      views: 0,
      likes: 0,
      published: postData.published || false
    };

    blogPosts.set(postId, newPost);
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Failed to create blog post', error: error.message });
  }
});

// UPDATE blog post (admin only)
router.put('/admin/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!blogPosts.has(id)) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const existingPost = blogPosts.get(id);
    const updatedPost = { ...existingPost, ...updateData };
    
    blogPosts.set(id, updatedPost);
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Failed to update blog post', error: error.message });
  }
});

// DELETE blog post (admin only)
router.delete('/admin/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!blogPosts.has(id)) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    blogPosts.delete(id);
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Failed to delete blog post', error: error.message });
  }
});

// GET all posts for admin (including unpublished)
router.get('/admin/posts/all', async (req, res) => {
  try {
    const posts = Array.from(blogPosts.values())
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

export default router;
