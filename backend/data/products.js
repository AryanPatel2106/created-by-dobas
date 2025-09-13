const products = [
  { 
    name: 'Personalized Pop-Up Birthday Card', 
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center', 
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=600&h=400&fit=crop&crop=center'
    ],
    description: 'An intricate, laser-cut pop-up card that can be personalized with a name and age. Each card is handcrafted with premium cardstock and features delicate paper engineering that creates a stunning 3D effect when opened. Perfect for making birthdays extra special with a personal touch.', 
    category: 'Cards', 
    price: 1299, 
    countInStock: 25, 
    rating: 4.8, 
    numReviews: 12,
    features: ['Laser-cut precision', 'Premium cardstock', 'Personalized text', 'Gift envelope included'],
    dimensions: '15cm x 20cm when closed',
    customizable: true,
    leadTime: '3-5 business days'
  },
  { 
    name: 'Custom Engraved Wedding Frame', 
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&h=400&fit=crop&crop=center', 
    images: [
      'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center'
    ],
    description: 'A beautiful wooden photo frame, engraved with the couple\'s names and wedding date. Crafted from premium oak wood with a smooth finish, this frame becomes a treasured keepsake that celebrates love stories. The precision laser engraving ensures your special details are permanently etched with elegance.', 
    category: 'Gifts', 
    price: 3999, 
    countInStock: 15, 
    rating: 5.0, 
    numReviews: 8,
    features: ['Premium oak wood', 'Laser engraving', 'Holds 5x7 photo', 'Easel back stand'],
    dimensions: '20cm x 25cm frame size',
    customizable: true,
    leadTime: '5-7 business days'
  },
  { 
    name: 'Anniversary Memory Shadow Box', 
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&crop=center', 
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=600&h=400&fit=crop&crop=center'
    ],
    description: 'A deep shadow box designed to hold mementos of a relationship. This elegant display case allows couples to showcase their most precious memories - ticket stubs, photos, love letters, and small keepsakes. The spacious interior and premium glass front create a museum-quality display for your love story.', 
    category: 'Gifts', 
    price: 5499, 
    countInStock: 7, 
    rating: 4.5, 
    numReviews: 10,
    features: ['Deep display case', 'Premium glass front', 'Velvet interior', 'Wall mounting hardware'],
    dimensions: '30cm x 40cm x 8cm deep',
    customizable: true,
    leadTime: '7-10 business days'
  },
  { 
    name: 'Hand-painted Baby Milestone Cards', 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center', 
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=600&h=400&fit=crop&crop=center'
    ],
    description: 'A set of 12 beautifully hand-painted wooden cards to celebrate a baby\'s first year. Each milestone card is individually painted with non-toxic, child-safe paints and features charming illustrations. Perfect for capturing those precious first-year moments in photos that will be treasured forever.', 
    category: 'Cards', 
    price: 2499, 
    countInStock: 30, 
    rating: 4.9, 
    numReviews: 15,
    features: ['12 milestone cards', 'Hand-painted designs', 'Non-toxic paints', 'Gift box included'],
    dimensions: '10cm x 15cm per card',
    customizable: false,
    leadTime: '2-3 business days'
  },
  {
    name: 'Personalized Leather Journal',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center'
    ],
    description: 'A premium leather-bound journal with personalized embossing. Perfect for writers, dreamers, and anyone who loves to capture their thoughts on paper. Made from genuine leather with cream-colored, acid-free pages.',
    category: 'Gifts',
    price: 2799,
    countInStock: 20,
    rating: 4.7,
    numReviews: 18,
    features: ['Genuine leather cover', 'Personalized embossing', '200 acid-free pages', 'Ribbon bookmark'],
    dimensions: '14cm x 21cm',
    customizable: true,
    leadTime: '4-6 business days'
  },
  {
    name: 'Custom Family Tree Wall Art',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop&crop=center'
    ],
    description: 'Beautiful family tree artwork customized with your family names and important dates. Printed on high-quality canvas and ready to hang, this piece becomes a centerpiece that celebrates your family heritage.',
    category: 'Gifts',
    price: 4299,
    countInStock: 12,
    rating: 4.9,
    numReviews: 22,
    features: ['High-quality canvas print', 'Custom family names', 'Ready to hang', 'Multiple size options'],
    dimensions: '40cm x 50cm (standard)',
    customizable: true,
    leadTime: '5-7 business days'
  }
];

export default products;