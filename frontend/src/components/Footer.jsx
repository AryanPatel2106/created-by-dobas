import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Instagram, Youtube, Linkedin } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/site-settings');
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch site settings", error);
      }
    };
    fetchSettings();
  }, []);

  if (!settings) return null; // Don't render footer until settings are loaded

  return (
    <footer className="bg-white/50 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About Store */}
          <div className="flex flex-col">
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">About the Store</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {settings.aboutStore}
            </p>
            <div className="flex gap-4">
                <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--theme-pink)] transition-colors"><Instagram /></a>
                <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--theme-pink)] transition-colors"><Youtube /></a>
                <a href={settings.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[var(--theme-pink)] transition-colors"><Linkedin /></a>
            </div>
          </div>
          
          {/* Column 2: Shop Links */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">Shop</h3>
            <ul className="text-gray-600 space-y-2">
              <li><Link to="/" className="hover:text-[var(--theme-pink)] transition-colors">All Products</Link></li>
              <li><a href="#" className="hover:text-[var(--theme-pink)] transition-colors">Gifts</a></li>
              <li><a href="#" className="hover:text-[var(--theme-pink)] transition-colors">Cards</a></li>
            </ul>
          </div>

          {/* Column 3: Important Links */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">Links</h3>
            <ul className="text-gray-600 space-y-2">
              <li><Link to="/" className="hover:text-[var(--theme-pink)] transition-colors">Home</Link></li>
              <li><Link to="/about-us" className="hover:text-[var(--theme-pink)] transition-colors">About Us</Link></li>
              {user && user.isAdmin && (
                <li><Link to="/admin" className="hover:text-[var(--theme-pink)] transition-colors">Admin Dashboard</Link></li>
              )}
               {user && !user.isAdmin && (
                <li><Link to="/my-orders" className="hover:text-[var(--theme-pink)] transition-colors">My Orders</Link></li>
              )}
              <li><Link to="/leave-review" className="hover:text-[var(--theme-pink)] transition-colors">Leave a Review</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">Contact Us</h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>{settings.email}</li>
              <li>{settings.phone}</li>
              <li>{settings.address}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Created by dobas. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;