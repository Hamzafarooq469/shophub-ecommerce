import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaUser, FaHome, FaSignInAlt, FaUserPlus, FaCog, FaBoxes } from 'react-icons/fa';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentUser = useSelector((state) => state.user.currentUser);
  const guestCart = useSelector((state) => state.guestCart.cart);
  
  // Calculate cart count
  const cartCount = currentUser ? 0 : guestCart.length; // For logged in users, we'll need to fetch from API

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaBoxes className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">ShopHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FaHome className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={handleGoToCart}
              className="relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              <FaShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Authentication */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaUser className="h-4 w-4" />
                  <span>Hello, {currentUser.name}</span>
                </div>
                
                {/* Admin Links */}
                {currentUser.isAdmin && (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/admin/createProduct"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                    >
                      <FaCog className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </div>
                )}
                
                <Link
                  to="/signOut"
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signIn"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <FaSignInAlt className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signUp"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <FaUserPlus className="h-4 w-4 inline mr-1" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHome className="h-4 w-4 inline mr-2" />
              Home
            </Link>
            
            <button
              onClick={() => {
                handleGoToCart();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              <FaShoppingCart className="h-4 w-4 inline mr-2" />
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>

            {currentUser ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-500">
                  Hello, {currentUser.name}
                </div>
                {currentUser.isAdmin && (
                  <Link
                    to="/admin/createProduct"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaCog className="h-4 w-4 inline mr-2" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/signOut"
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signIn"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaSignInAlt className="h-4 w-4 inline mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/signUp"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUserPlus className="h-4 w-4 inline mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
