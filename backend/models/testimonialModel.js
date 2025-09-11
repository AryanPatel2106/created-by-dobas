import mongoose from 'mongoose';

const testimonialSchema = mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      picture: { type: String }, // To store the user's Google profile picture
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, required: true, default: false }, // Admins must approve testimonials
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;