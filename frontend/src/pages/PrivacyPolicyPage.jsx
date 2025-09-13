import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-gray-800 mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Information We Collect</h2>
              
              <h3 className="font-bold text-xl mb-4 text-gray-800">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                When you make a purchase or create an account, we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                <li>Name and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Email address and phone number</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Custom text and personalization details for your orders</li>
              </ul>

              <h3 className="font-bold text-xl mb-4 text-gray-800">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Website usage and navigation patterns</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">How We Use Your Information</h2>
              
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Order Processing:</strong> To fulfill your custom orders and communicate about your purchases</li>
                <li><strong>Customer Service:</strong> To respond to inquiries and provide support</li>
                <li><strong>Marketing:</strong> To send promotional emails (with your consent)</li>
                <li><strong>Website Improvement:</strong> To analyze usage and improve our services</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Information Sharing</h2>
              
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Service Providers:</strong> Payment processors, shipping companies, and email services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Data Security</h2>
              
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through trusted providers</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Your Rights</h2>
              
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correct:</strong> Update or correct inaccurate information</li>
                <li><strong>Delete:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Cookies</h2>
              
              <p className="text-gray-600 mb-4">
                We use cookies to enhance your browsing experience:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Marketing Cookies:</strong> Used for personalized advertising</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can manage cookie preferences through your browser settings.
              </p>
            </div>
          </section>

          <section>
            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
              
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or want to exercise your rights:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                  <p className="text-gray-600">privacy@created-by-dobas.shop</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Response Time</h4>
                  <p className="text-gray-600">Within 30 days</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;
