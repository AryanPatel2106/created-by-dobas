import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminOrderListPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="py-12">
      <Link to="/admin" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>
      <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-8">All Customer Orders</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">DATE</th>
              <th className="p-4 font-semibold">CUSTOMER</th>
              <th className="p-4 font-semibold">TOTAL</th>
              <th className="p-4 font-semibold">PAYMENT</th>
              <th className="p-4 font-semibold">DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{order.user.name}</td>
                <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                <td className="p-4">{order.paymentMethod}</td>
                <td className="p-4">
                  <Link to={`/admin/order/${order._id}`} className="text-blue-600 font-semibold hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderListPage;