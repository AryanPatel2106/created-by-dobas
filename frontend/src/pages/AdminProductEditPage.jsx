import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';

const AdminProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Gifts');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = { name, price, image, category, countInStock, description };
      await axios.put(`/api/products/${productId}`, updatedProduct);
      alert('Product updated successfully!');
      navigate('/admin/productlist');
    } catch (error) {
      alert('Failed to update product');
    }
  };

  if (loading) return <div className="text-center py-20">Loading product editor...</div>;

  return (
    <div className="py-12 max-w-2xl mx-auto">
        <Link to="/admin/productlist" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
            Back to Product List
        </Link>
        <div className="bg-white p-8 rounded-lg shadow-lg border">
            <h2 className="font-playfair text-3xl font-bold text-center mb-8 text-gray-800">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Product Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Price (₹)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Count In Stock</label>
                        <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                </div>
                
                <ImageUpload value={image} onChange={setImage} />

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2">
                        <option value="Gifts">Gifts</option>
                        <option value="Cards">Cards</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                    <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2"></textarea>
                </div>
                <button type="submit" className="w-full bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all">
                    Update Product
                </button>
            </form>
        </div>
    </div>
  );
};

export default AdminProductEditPage;