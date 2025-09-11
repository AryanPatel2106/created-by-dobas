import express from 'express';
const router = express.Router();
import Testimonial from '../models/testimonialModel.js';

// @desc    Get all APPROVED testimonials for the homepage
// @route   GET /api/testimonials
router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true });
  res.json(testimonials);
});

// @desc    Get ALL testimonials (for admin)
// @route   GET /api/testimonials/all
router.get('/all', async (req, res) => {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
});

// @desc    Create a new testimonial
// @route   POST /api/testimonials
router.post('/', async (req, res) => {
  const { user, rating, comment } = req.body;

  const alreadySubmitted = await Testimonial.findOne({ 'user.email': user.email });
  if (alreadySubmitted) {
      res.status(400).json({ message: 'You have already submitted a testimonial.' });
      return;
  }

  const testimonial = new Testimonial({
    user,
    rating: Number(rating),
    comment,
  });

  const createdTestimonial = await testimonial.save();
  res.status(201).json(createdTestimonial);
});


// @desc    Approve a testimonial (admin only)
// @route   PUT /api/testimonials/:id/approve
router.put('/:id/approve', async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if(testimonial) {
        testimonial.isApproved = true;
        const updatedTestimonial = await testimonial.save();
        res.json(updatedTestimonial);
    } else {
        res.status(404).json({ message: 'Testimonial not found' });
    }
});


// @desc    Delete a testimonial (admin only)
// @route   DELETE /api/testimonials/:id
router.delete('/:id', async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
        await testimonial.deleteOne();
        res.json({ message: 'Testimonial removed' });
    } else {
        res.status(404).json({ message: 'Testimonial not found' });
    }
});

export default router;