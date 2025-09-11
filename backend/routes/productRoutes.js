import express from 'express';
const router = express.Router();
import Product from '../models/productModel.js';

// GET all products
router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// GET one product by ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// --- ADD THIS NEW BLOCK FOR CREATING A REVIEW ---
// @desc    Create a new review
// @route   POST /api/products/:id/reviews
router.post('/:id/reviews', async (req, res) => {
    const { rating, comment, user } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === user.email.toString()
        );

        if (alreadyReviewed) {
            res.status(400).json({ message: 'Product already reviewed' });
            return;
        }

        const review = {
            name: user.name,
            rating: Number(rating),
            comment,
            user: user.email,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});
// ------------------------------------------------

// All other admin routes (POST, PUT, DELETE for products) remain the same
// POST (create) a new product
router.post('/', async (req, res) => {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = new Product({ name, price, description, image, category, countInStock, rating: 0, numReviews: 0, reviews: [] });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// PUT (update) a product
router.put('/:id', async (req, res) => {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.category = category;
        product.countInStock = countInStock;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});


export default router;