import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, Users, MessageSquareQuote, Settings } from 'lucide-react';

const AdminDashboardPage = () => {
  return (
    <div className="py-12">
      <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-12 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Link to="/admin/productlist" className="block p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <Package size={40} className="text-[var(--theme-pink)]" />
            <div>
              <h2 className="font-bold text-2xl text-gray-800">Manage Products</h2>
              <p className="text-gray-600">Add, edit, and delete creations.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/orderlist" className="block p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <ClipboardList size={40} className="text-[var(--theme-teal)]" />
            <div>
              <h2 className="font-bold text-2xl text-gray-800">View Orders</h2>
              <p className="text-gray-600">Review and manage customer orders.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/about-us/edit" className="block p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <Users size={40} className="text-[var(--theme-yellow)]" />
            <div>
              <h2 className="font-bold text-2xl text-gray-800">Edit 'About Us' Page</h2>
              <p className="text-gray-600">Update team profiles and intro.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/testimonials" className="block p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <MessageSquareQuote size={40} className="text-green-500" />
            <div>
              <h2 className="font-bold text-2xl text-gray-800">Manage Testimonials</h2>
              <p className="text-gray-600">Approve customer reviews.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/settings" className="block p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-2 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <Settings size={40} className="text-gray-500" />
            <div>
              <h2 className="font-bold text-2xl text-gray-800">Site Settings</h2>
              <p className="text-gray-600">Edit contact info and footer text.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;