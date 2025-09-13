import React from 'react';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-gray-800 mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing and using Created by Dobas ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Products and Services</h2>
              
              <h3 className="font-bold text-xl mb-4 text-gray-800">Custom Orders</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>All products are handcrafted to order and may vary slightly from images</li>
                <li>Processing times vary by product complexity (2-14 business days)</li>
                <li>Custom orders require approval of design before production begins</li>
                <li>Rush orders may be available for additional fees</li>
              </ul>

              <h3 className="font-bold text-xl mb-4 text-gray-800">Product Accuracy</h3>
              <p className="text-gray-600">
                We strive for accuracy in all product descriptions and images. However, as items are handmade, slight variations in color, texture, and appearance are normal and add to the unique character of each piece.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Orders and Payment</h2>
              
              <h3 className="font-bold text-xl mb-4 text-gray-800">Order Acceptance</h3>
              <p className="text-gray-600 mb-4">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
              </p>

              <h3 className="font-bold text-xl mb-4 text-gray-800">Pricing and Payment</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All prices are in Indian Rupees (₹) and include applicable taxes</li>
                <li>Payment is required at the time of order placement</li>
                <li>We accept major credit cards, debit cards, and digital payment methods</li>
                <li>Prices may change without notice, but confirmed orders honor the original price</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Intellectual Property</h2>
              
              <h3 className="font-bold text-xl mb-4 text-gray-800">Our Content</h3>
              <p className="text-gray-600 mb-4">
                All content on this website, including designs, text, graphics, and images, is owned by Created by Dobas and protected by copyright laws.
              </p>

              <h3 className="font-bold text-xl mb-4 text-gray-800">Customer Content</h3>
              <p className="text-gray-600">
                By providing custom text, images, or designs, you grant us permission to use this content solely for creating your ordered products. You retain ownership of your original content.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Limitation of Liability</h2>
              
              <p className="text-gray-600 mb-4">
                Created by Dobas shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
              
              <p className="text-gray-600">
                Our total liability shall not exceed the amount paid by you for the specific product or service that gave rise to the claim.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Prohibited Uses</h2>
              
              <p className="text-gray-600 mb-4">You may not use our service:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
              
              <p className="text-gray-600 mb-4">
                Questions about the Terms of Service should be sent to us at:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                  <p className="text-gray-600">legal@created-by-dobas.shop</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Website</h4>
                  <p className="text-gray-600">created-by-dobas.shop</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfServicePage;
