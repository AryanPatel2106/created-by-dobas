import path from 'path';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aboutUsRoutes from './routes/aboutUsRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
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

// --- DEPLOYMENT CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, '/frontend/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(rootDir, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}
// --- END DEPLOYMENT CONFIGURATION ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Backend server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));