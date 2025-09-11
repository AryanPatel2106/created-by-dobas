 import React, { useState } from 'react';
import axios from 'axios';

const ProductCreateForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Gifts');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = { name, price, image, category, countInStock, description };
      const { data } = await axios.post('/api/products', newProduct);
      
      alert(`Success! Product "${data.name}" has been created.`);
      // Clear the form
      setName('');
      setPrice(0);
      setImage('');
      setCategory('Gifts');
      setCountInStock(0);
      setDescription('');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Check console for details.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border w-full max-w-2xl mx-auto">
      <h2 className="font-playfair text-3xl font-bold text-center mb-8 text-gray-800">Add a New Creation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Count In Stock</label>
              <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Image URL</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://..." className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]">
                <option value="Gifts">Gifts</option>
                <option value="Cards">Cards</option>
            </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
          <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]"></textarea>
        </div>
        <button type="submit" className="w-full bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductCreateForm;
