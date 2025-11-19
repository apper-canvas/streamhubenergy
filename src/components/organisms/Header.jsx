import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector(state => state.user)
  const { logout } = useAuth()
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'Search', path: '/search', icon: 'Search' },
    { name: 'My List', path: '/my-list', icon: 'Bookmark' }
  ]

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-netflix-bg/95 backdrop-blur-md shadow-xl border-b border-netflix-white/10' 
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-netflix-red to-netflix-red-dark rounded-lg flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Play" className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bebas text-netflix-white tracking-wider group-hover:text-netflix-red transition-colors duration-200">
                STREAMHUB
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative font-inter font-medium transition-all duration-200 hover:text-netflix-red ${
                    isActivePath(item.path) ? 'text-netflix-red' : 'text-netflix-white'
                  }`}
                >
                  {item.name}
                  {isActivePath(item.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-netflix-red rounded-full"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

{/* User Actions Container */}

          <div className="flex items-center space-x-4">
            {/* User Actions */}
            {isAuthenticated ? (
<div className="flex items-center space-x-4">
                <span className="text-netflix-white text-sm">
                  Welcome, {user?.firstName || user?.name || 'User'}
                </span>
                <button
                  onClick={() => {
                    const bUrl = "https://test-billing.apper.io/?token=" + localStorage.getItem("jwt_token");
                    window.open(bUrl, "_blank");
                  }}
                  className="text-netflix-white hover:text-netflix-red transition-colors duration-200 flex items-center space-x-1 text-sm font-medium"
                >
                  <ApperIcon name="CreditCard" className="h-4 w-4" />
                  <span>Billing</span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-netflix-white hover:text-netflix-red"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-netflix-white hover:text-netflix-red">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-netflix-red hover:bg-netflix-red-dark text-netflix-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </Button>
          </div>
        </div>
{navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block text-netflix-white hover:text-gray-300 transition-colors ${
                  isActivePath(item.path) ? 'font-semibold' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-50 bg-netflix-bg/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </Button>

            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-4 text-2xl font-inter font-semibold transition-colors duration-200 ${
                  isActivePath(item.path) ? 'text-netflix-red' : 'text-netflix-white hover:text-netflix-red'
                }`}
              >
                <ApperIcon name={item.icon} className="h-8 w-8" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  )
}

export default Header