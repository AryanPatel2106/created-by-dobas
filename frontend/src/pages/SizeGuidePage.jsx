import React from 'react';
import { motion } from 'framer-motion';

const SizeGuidePage = () => {
  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-gray-800 mb-8">
          Size Guide & Specifications
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Cards</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Pop-Up Birthday Cards</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Closed:</strong> 15cm x 20cm</li>
                    <li><strong>Open:</strong> 30cm x 20cm</li>
                    <li><strong>Pop-up height:</strong> 8cm</li>
                    <li><strong>Material:</strong> 300gsm premium cardstock</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Baby Milestone Cards</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Each card:</strong> 10cm x 15cm</li>
                    <li><strong>Thickness:</strong> 4mm wooden base</li>
                    <li><strong>Set includes:</strong> 12 cards</li>
                    <li><strong>Gift box:</strong> 18cm x 22cm x 5cm</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Frames & Display Items</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Wedding Frames</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Frame size:</strong> 20cm x 25cm</li>
                    <li><strong>Photo opening:</strong> 13cm x 18cm (5x7 inches)</li>
                    <li><strong>Frame depth:</strong> 2cm</li>
                    <li><strong>Material:</strong> Premium oak wood</li>
                    <li><strong>Stand:</strong> Easel back included</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Shadow Boxes</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>External:</strong> 30cm x 40cm x 8cm</li>
                    <li><strong>Internal display:</strong> 28cm x 38cm x 6cm</li>
                    <li><strong>Glass:</strong> 3mm premium glass front</li>
                    <li><strong>Interior:</strong> Velvet-lined backing</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Journals & Stationery</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Leather Journals</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Size:</strong> 14cm x 21cm (A5)</li>
                    <li><strong>Pages:</strong> 200 pages (100 sheets)</li>
                    <li><strong>Paper:</strong> 80gsm cream paper</li>
                    <li><strong>Cover:</strong> Genuine leather, 2mm thick</li>
                    <li><strong>Binding:</strong> Coptic stitch binding</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Family Tree Art</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Standard:</strong> 40cm x 50cm</li>
                    <li><strong>Large:</strong> 50cm x 70cm</li>
                    <li><strong>Material:</strong> Canvas print</li>
                    <li><strong>Frame:</strong> Optional wooden frame (+3cm border)</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg border mb-8">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Customization Guidelines</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Text Limitations</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Cards:</strong> Up to 50 characters</li>
                    <li><strong>Frames:</strong> Up to 100 characters</li>
                    <li><strong>Journals:</strong> Up to 30 characters</li>
                    <li><strong>Family Tree:</strong> Up to 20 names</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Font Options</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><strong>Script:</strong> Elegant cursive fonts</li>
                    <li><strong>Print:</strong> Clean, readable fonts</li>
                    <li><strong>Decorative:</strong> Ornate, special occasion fonts</li>
                    <li><strong>Size range:</strong> 8pt to 24pt</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white p-8 rounded-lg shadow-lg border">
              <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Care Instructions</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Paper Products</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>Keep away from direct sunlight</li>
                    <li>Store in dry conditions</li>
                    <li>Handle with clean, dry hands</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Wood Items</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>Dust with soft, dry cloth</li>
                    <li>Avoid water and harsh chemicals</li>
                    <li>Polish occasionally with wood care products</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Leather Products</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>Condition leather annually</li>
                    <li>Keep away from heat sources</li>
                    <li>Clean with leather-specific products</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default SizeGuidePage;
