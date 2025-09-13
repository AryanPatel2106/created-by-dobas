import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        customization: {
          forWhom: { type: String },
          relation: { type: String },
          description: { type: String },
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String },
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true, default: 0.0 },
    deliveryInstructions: { type: String },
    giftMessage: { type: String },
    status: { 
      type: String, 
      required: true, 
      default: 'pending',
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;