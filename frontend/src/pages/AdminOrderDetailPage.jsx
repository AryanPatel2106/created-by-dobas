import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const AdminOrderDetailPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data);
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <Link to="/admin/orderlist" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
          <ArrowLeft size={20} />
          Back to Order List
      </Link>
      <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-6">Order #{order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Information</h2>
            <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Items</h2>
            {order.orderItems.map((item, index) => (
              <div key={index} className="border-b py-4 last:border-b-0">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <div className="text-sm text-gray-600 pl-4 mt-2 border-l-2 ml-2">
                  <p><strong>For:</strong> {item.customization.forWhom || 'N/A'}</p>
                  <p><strong>Relationship:</strong> {item.customization.relation || 'N/A'}</p>
                  <p><strong>Details:</strong> {item.customization.description || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p className="font-bold text-lg mt-4"><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;