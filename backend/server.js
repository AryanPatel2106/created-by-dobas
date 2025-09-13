import path from 'path';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aboutUsRoutes from './routes/aboutUsRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';

// The dotenv config is now only needed for local development, 
// Render will provide the variables in production.
if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

// --- API ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/about-us', aboutUsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api', searchRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// Backend API only - frontend served separately by Vercel
app.get('/', (req, res) => {
  res.json({ 
    message: 'Created by Dobas API is running!',
    version: '1.0.0',
    endpoints: ['/api/products', '/api/orders', '/api/users', '/api/reviews', '/api/blog', '/api/search', '/api/loyalty']
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Backend server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));