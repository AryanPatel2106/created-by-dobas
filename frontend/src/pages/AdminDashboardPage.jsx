import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ClipboardList, Users, MessageSquareQuote, Settings } from 'lucide-react';

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-800 mb-12 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        <Link to="/admin/productlist" className="block p-6 sm:p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-1 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <Package size={32} sm:size={40} className="text-[var(--theme-pink)]" />
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-gray-800">Manage Products</h2>
              <p className="text-gray-600 text-sm sm:text-base">Add, edit, and delete creations.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/orderlist" className="block p-6 sm:p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-1 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <ClipboardList size={32} sm:size={40} className="text-[var(--theme-teal)]" />
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-gray-800">View Orders</h2>
              <p className="text-gray-600 text-sm sm:text-base">Review and manage customer orders.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/about-us/edit" className="block p-6 sm:p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-1 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <Users size={32} sm:size={40} className="text-[var(--theme-yellow)]" />
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-gray-800">Edit 'About Us'</h2>
              <p className="text-gray-600 text-sm sm:text-base">Update team profiles and intro.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/testimonials" className="block p-6 sm:p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-1 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <MessageSquareQuote size={32} sm:size={40} className="text-green-500" />
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-gray-800">Manage Testimonials</h2>
              <p className="text-gray-600 text-sm sm:text-base">Approve customer reviews.</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/settings" className="block p-6 sm:p-8 bg-white rounded-lg shadow-lg border hover:-translate-y-1 hover:shadow-xl transition-transform duration-300">
          <div className="flex items-center gap-4">
            <Settings size={32} sm:size={40} className="text-gray-500" />
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-gray-800">Site Settings</h2>
              <p className="text-gray-600 text-sm sm:text-base">Edit contact info and footer text.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;