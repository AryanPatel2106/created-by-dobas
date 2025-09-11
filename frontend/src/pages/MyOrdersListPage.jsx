 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyOrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (user && user.email) {
        try {
          // Send the user's email to the backend to get their specific orders
          const { data } = await axios.post('/api/orders/myorders', { email: user.email });
          setOrders(data);
        } catch (error) {
          console.error("Could not fetch user's orders", error);
        }
      }
    };
    fetchMyOrders();
  }, [user]);

  return (
    <div className="py-12">
      <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white rounded-lg border">
          <p className="text-2xl text-gray-600">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold">DATE</th>
                <th className="p-4 font-semibold">TOTAL</th>
                <th className="p-4 font-semibold">PAYMENT METHOD</th>
                <th className="p-4 font-semibold">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">{order.paymentMethod}</td>
                  <td className="p-4">
                    <Link to={`/order/${order._id}`} className="text-blue-600 font-semibold hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersListPage;
