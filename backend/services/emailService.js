import nodemailer from 'nodemailer';

// Email service configuration
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to your preferred email service
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderData) {
    const { user, orderItems, shippingAddress, totalPrice, orderId } = orderData;
    
    const orderItemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong>
          ${item.customization ? `<br><small>For: ${item.customization.forWhom || 'Custom order'}</small>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Created by Dobas</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          <p style="color: #555; margin: 10px 0 0 0; font-size: 16px;">Your handmade gift is being prepared with love</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <h2 style="color: #333; border-bottom: 2px solid #ff9a9e; padding-bottom: 10px;">Order Details</h2>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${user.name}</p>
          </div>

          <h3 style="color: #333; margin-top: 30px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
              <tr style="background: #f9f9f9; font-weight: bold;">
                <td style="padding: 15px; border-top: 2px solid #ddd;">Total Amount</td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #ddd; font-size: 18px; color: #ff6b6b;">₹${totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <h3 style="color: #333; margin-top: 30px;">Shipping Address</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p><strong>${shippingAddress.fullName}</strong></p>
            <p>${shippingAddress.address}</p>
            <p>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}</p>
            ${shippingAddress.phone ? `<p>Phone: ${shippingAddress.phone}</p>` : ''}
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 30px 0; text-align: center;">
            <h3 style="color: #2e7d32; margin: 0 0 10px 0;">What happens next?</h3>
            <p style="margin: 5px 0; color: #555;">📋 We'll review your customization details</p>
            <p style="margin: 5px 0; color: #555;">🎨 Our artisans will start crafting your item</p>
            <p style="margin: 5px 0; color: #555;">📦 We'll notify you when it's ready to ship</p>
            <p style="margin: 5px 0; color: #555;">🚚 Expected delivery: 5-10 business days</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://created-by-dobas.shop/order/${orderId}" 
               style="background: #ff9a9e; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Track Your Order
            </a>
          </div>

          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
            <p>Questions about your order? Reply to this email or contact us at:</p>
            <p><strong>Email:</strong> support@created-by-dobas.shop</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            
            <div style="margin-top: 20px;">
              <p style="font-size: 14px;">Follow us for updates and new creations:</p>
              <a href="#" style="color: #ff9a9e; text-decoration: none; margin: 0 10px;">Instagram</a>
              <a href="#" style="color: #ff9a9e; text-decoration: none; margin: 0 10px;">Facebook</a>
            </div>
          </div>
        </div>
        
        <div style="background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">© 2024 Created by Dobas. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">Handmade with ❤️ in Gujarat, India</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'Created by Dobas <noreply@created-by-dobas.shop>',
      to: user.email,
      subject: `Order Confirmation #${orderId} - Created by Dobas`,
      html: emailHtml
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${user.email}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send order status update email
  async sendOrderStatusUpdate(orderData, newStatus) {
    const { user, orderId } = orderData;
    
    const statusMessages = {
      'processing': {
        subject: 'Your Order is Being Processed',
        title: 'Order Processing Started',
        message: 'Great news! We\'ve started working on your custom order. Our artisans are carefully crafting your item.',
        icon: '🎨'
      },
      'shipped': {
        subject: 'Your Order Has Shipped',
        title: 'Order Shipped',
        message: 'Your order is on its way! You should receive it within 2-3 business days.',
        icon: '📦'
      },
      'delivered': {
        subject: 'Your Order Has Been Delivered',
        title: 'Order Delivered',
        message: 'Your order has been delivered! We hope you love your handmade gift.',
        icon: '🎉'
      }
    };

    const status = statusMessages[newStatus] || statusMessages['processing'];

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${status.subject} - Created by Dobas</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <div style="font-size: 48px; margin-bottom: 10px;">${status.icon}</div>
          <h1 style="color: #333; margin: 0; font-size: 28px;">${status.title}</h1>
          <p style="color: #555; margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="font-size: 18px; color: #333; text-align: center; margin-bottom: 30px;">${status.message}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://created-by-dobas.shop/order/${orderId}" 
               style="background: #ff9a9e; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              View Order Details
            </a>
          </div>

          ${newStatus === 'delivered' ? `
          <div style="background: #e8f5e8; padding: 20px; border-radius: 5px; margin: 30px 0; text-align: center;">
            <h3 style="color: #2e7d32; margin: 0 0 15px 0;">Love your order?</h3>
            <p style="margin: 10px 0; color: #555;">We'd love to hear about your experience!</p>
            <a href="https://created-by-dobas.shop/leave-review" 
               style="background: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block; margin-top: 10px;">
              Leave a Review
            </a>
          </div>
          ` : ''}
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
            <p>Questions? Contact us at support@created-by-dobas.shop</p>
          </div>
        </div>
        
        <div style="background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">© 2024 Created by Dobas. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'Created by Dobas <noreply@created-by-dobas.shop>',
      to: user.email,
      subject: `${status.subject} #${orderId} - Created by Dobas`,
      html: emailHtml
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Status update email sent to ${user.email} for order ${orderId}`);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending status update email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email for new customers
  async sendWelcomeEmail(userData) {
    const { name, email } = userData;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Created by Dobas</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">Welcome to Created by Dobas!</h1>
          <p style="color: #555; margin: 10px 0 0 0; font-size: 16px;">Where every gift tells a story</p>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <h2 style="color: #333;">Hi ${name}! 👋</h2>
          
          <p>Thank you for joining our community of gift lovers! We're excited to help you create meaningful, personalized gifts for your loved ones.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What makes us special?</h3>
            <ul style="color: #555; padding-left: 20px;">
              <li>🎨 Handcrafted items made with love</li>
              <li>✨ Personalized customization for every order</li>
              <li>📦 Careful packaging and timely delivery</li>
              <li>💝 Perfect for any occasion</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://created-by-dobas.shop" 
               style="background: #ff9a9e; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Start Shopping
            </a>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 5px; margin: 30px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Special Welcome Offer! 🎉</h3>
            <p style="margin: 10px 0; color: #555;">Use code <strong>WELCOME10</strong> for 10% off your first order!</p>
            <p style="margin: 0; color: #777; font-size: 14px;">*Valid for orders above ₹500. Expires in 30 days.</p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
            <p>Follow us for daily inspiration and new arrivals:</p>
            <div style="margin-top: 15px;">
              <a href="#" style="color: #ff9a9e; text-decoration: none; margin: 0 10px;">Instagram</a>
              <a href="#" style="color: #ff9a9e; text-decoration: none; margin: 0 10px;">Facebook</a>
              <a href="#" style="color: #ff9a9e; text-decoration: none; margin: 0 10px;">Pinterest</a>
            </div>
          </div>
        </div>
        
        <div style="background: #333; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">© 2024 Created by Dobas. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">Handmade with ❤️ in Gujarat, India</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'Created by Dobas <noreply@created-by-dobas.shop>',
      to: email,
      subject: 'Welcome to Created by Dobas - Your Journey Begins! 🎨',
      html: emailHtml
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
