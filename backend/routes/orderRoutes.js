import express from 'express';
const router = express.Router();
import Order from '../models/orderModel.js';
import emailService from '../services/emailService.js';

// CREATE a new order
router.post('/', async (req, res) => {
  try {
    const { user, orderItems, shippingAddress, paymentMethod, totalPrice, deliveryInstructions, giftMessage } = req.body;
    
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({ 
      user, 
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      totalPrice,
      deliveryInstructions,
      giftMessage
    });
    
    const createdOrder = await order.save();

    // Send order confirmation email
    try {
      await emailService.sendOrderConfirmation({
        user,
        orderItems,
        shippingAddress,
        totalPrice,
        orderId: createdOrder._id
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
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
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
});

// UPDATE order status (for admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const oldStatus = order.status;
        order.status = status;
        order.updatedAt = Date.now();
        
        const updatedOrder = await order.save();

        // Send status update email if status changed
        if (oldStatus !== status && ['processing', 'shipped', 'delivered'].includes(status)) {
            try {
                await emailService.sendOrderStatusUpdate({
                    user: order.user,
                    orderId: order._id
                }, status);
            } catch (emailError) {
                console.error('Failed to send status update email:', emailError);
            }
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
});

export default router;