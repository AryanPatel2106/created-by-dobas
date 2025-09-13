import React from 'react';
import { motion } from 'framer-motion';

const ShippingPolicyPage = () => {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-gray-800 mb-8">
          Shipping & Returns
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Shipping Information</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Processing Time</h3>
              <p className="text-gray-600 mb-4">
                All items are handcrafted to order. Processing times vary by product:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Cards:</strong> 2-5 business days</li>
                <li><strong>Frames & Shadow Boxes:</strong> 5-10 business days</li>
                <li><strong>Custom Engravings:</strong> 7-14 business days</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Shipping Options</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Standard Shipping (5-7 days)</h4>
                  <p className="text-gray-600">₹99 - Free on orders over ₹2,000</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Express Shipping (2-3 days)</h4>
                  <p className="text-gray-600">₹199 - Available for most items</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <h3 className="font-bold text-xl mb-4 text-gray-800">International Shipping</h3>
              <p className="text-gray-600 mb-4">
                We currently ship to select international destinations. Shipping costs and delivery times vary by location.
              </p>
              <p className="text-gray-600">
                International orders may be subject to customs duties and taxes, which are the responsibility of the customer.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Return Policy</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h3 className="font-bold text-xl mb-4 text-gray-800">30-Day Return Window</h3>
              <p className="text-gray-600 mb-4">
                We want you to love your handcrafted items. If you're not completely satisfied, you may return non-personalized items within 30 days of delivery.
              </p>
              <p className="text-gray-600 font-semibold">
                Note: Personalized and custom items cannot be returned unless there is a defect or error on our part.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Return Process</h3>
              <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                <li>Contact us at returns@created-by-dobas.shop within 30 days</li>
                <li>Provide your order number and reason for return</li>
                <li>We'll provide a return authorization and shipping label</li>
                <li>Pack items securely in original packaging</li>
                <li>Refund will be processed within 5-7 business days after we receive the item</li>
              </ol>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Damaged or Defective Items</h3>
              <p className="text-gray-600 mb-4">
                If your item arrives damaged or has a defect, please contact us immediately with photos. We'll arrange for a replacement or full refund at no cost to you.
              </p>
              <p className="text-gray-600">
                <strong>Contact:</strong> support@created-by-dobas.shop or call +91-XXXX-XXXX-XX
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <p className="text-gray-600 mb-4">
                Have questions about shipping or returns? We're here to help!
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                  <p className="text-gray-600">support@created-by-dobas.shop</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Response Time</h4>
                  <p className="text-gray-600">Within 24 hours</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default ShippingPolicyPage;
