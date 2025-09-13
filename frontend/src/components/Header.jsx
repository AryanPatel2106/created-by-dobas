import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package, Users, BarChart3, FileText, MessageSquare, Search, ShieldCheck, UserCog, LogIn, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo.jsx';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `
    sticky top-0 z-50 transition-all duration-300
    ${isScrolled ? 'bg-white/80 shadow-md backdrop-blur-lg' : 'bg-transparent'}
  `;

  const renderAdminNav = () => (
    <>
      <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
        <ShieldCheck size={16} />
        <span>Admin Mode</span>
      </div>
      <Link to="/admin" className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <UserCog size={20} />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <LogOut size={20} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </>
  );

  const renderCustomerNav = () => (
    <>
      <Link to="/about-us" className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <span className="font-semibold">About Us</span>
      </Link>
      <Link to="/search" className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <Search size={20} />
        <span className="hidden sm:inline">Search</span>
      </Link>
      <Link to="/loyalty" className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <Star size={20} />
        <span className="hidden sm:inline">Rewards</span>
      </Link>
      <Link to="/cart" className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <ShoppingCart size={20} />
        <span className="hidden sm:inline">Cart</span>
      </Link>
      {user ? (
        <>
          <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
            <User size={20} />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <span className="text-gray-700 px-4 hidden sm:inline">Hello, {user.given_name}</span>
          <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
            <LogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
      ) : (
        <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
          <LogIn size={20} />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
      )}
    </>
  );

  return (
    <header className={headerClasses}>
      <nav className="container mx-auto px-6 py-2 flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {user && user.isAdmin ? renderAdminNav() : renderCustomerNav()}
        </div>
      </nav>
    </header>
  );
};

export default Header;