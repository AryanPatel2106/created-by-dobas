 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get('/api/products');
    setProducts(data);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts(); // Refresh the list after deleting
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-playfair text-4xl font-bold text-gray-800">Manage Products</h1>
        <Link to="/admin/product/create" className="bg-[var(--theme-pink)] text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-[var(--theme-pink-hover)] transition-colors">
          + Add Product
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">NAME</th>
              <th className="p-4 font-semibold">PRICE</th>
              <th className="p-4 font-semibold">STOCK</th>
              <th className="p-4 font-semibold">CATEGORY</th>
              <th className="p-4 font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-4">{product.name}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.countInStock}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4 flex gap-4">
                  <Link to={`/admin/product/${product._id}/edit`}>
                    <Edit className="text-gray-500 hover:text-blue-500 cursor-pointer" />
                  </Link>
                  <button onClick={() => deleteHandler(product._id)}>
                    <Trash2 className="text-gray-500 hover:text-red-500 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductListPage;