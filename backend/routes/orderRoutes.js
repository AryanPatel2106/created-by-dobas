import express from 'express';
const router = express.Router();
import Order from '../models/orderModel.js';

// CREATE a new order
router.post('/', async (req, res) => {
  const { user, orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({ user, orderItems, shippingAddress, paymentMethod, totalPrice });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// --- ADD THIS NEW BLOCK ---
// @desc    Get logged in user's orders
// @route   POST /api/orders/myorders
router.post('/myorders', async (req, res) => {
    const { email } = req.body;
    // Find all orders where the nested user email matches the email sent from the frontend
    const orders = await Order.find({ 'user.email': email }).sort({ createdAt: -1 });
    if (orders) {
        res.json(orders);
    } else {
        res.status(404).json({ message: 'No orders found for this user' });
    }
});
// -------------------------

// GET all orders (for admin)
router.get('/', async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
});

// GET order by ID (for admin OR user)
router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

export default router;