import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package, Users, BarChart3, FileText, MessageSquare, Search, ShieldCheck, UserCog, LogIn, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo.jsx';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `
    sticky top-0 z-50 transition-all duration-300
    ${isScrolled || isMenuOpen ? 'bg-white/80 shadow-md backdrop-blur-lg' : 'bg-transparent'}
  `;

  const closeMenu = () => setIsMenuOpen(false);

  const renderAdminNav = () => (
    <>
      <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
        <ShieldCheck size={16} />
        <span>Admin Mode</span>
      </div>
      <Link to="/admin" onClick={closeMenu} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <UserCog size={20} />
        <span>Dashboard</span>
      </Link>
      <button onClick={() => { logout(); closeMenu(); }} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </>
  );

  const renderCustomerNav = () => (
    <>
      <Link to="/about-us" onClick={closeMenu} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <span className="font-semibold">About Us</span>
      </Link>
      <Link to="/search" onClick={closeMenu} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <Search size={20} />
        <span>Search</span>
      </Link>
      <Link to="/loyalty" onClick={closeMenu} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <Star size={20} />
        <span>Rewards</span>
      </Link>
      <Link to="/cart" onClick={closeMenu} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
        <ShoppingCart size={20} />
        <span>Cart</span>
      </Link>
      {user ? (
        <>
          <Link to="/profile" onClick={closeMenu} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
            <User size={20} />
            <span>Profile</span>
          </Link>
          <span className="text-gray-700 px-4 py-2">Hello, {user.given_name}</span>
          <button onClick={() => { logout(); closeMenu(); }} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <Link to="/login" onClick={closeMenu} className="flex items-center gap-2 text-gray-600 hover:text-[var(--theme-pink)] transition-colors px-4 py-2 rounded-lg">
          <LogIn size={20} />
          <span>Sign In</span>
        </Link>
      )}
    </>
  );

  return (
    <header className={headerClasses}>
      <nav className="container mx-auto px-6 py-2 flex justify-between items-center">
        <Link to="/" onClick={closeMenu}>
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {user && user.isAdmin ? renderAdminNav() : renderCustomerNav()}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-[var(--theme-pink)]">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-lg">
          <div className="container mx-auto px-6 py-4 flex flex-col items-start gap-2">
            {user && user.isAdmin ? renderAdminNav() : renderCustomerNav()}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;