import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-netflix-bg flex items-center justify-center px-4">
      <motion.div
        className="text-center space-y-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Animation */}
        <motion.div
          className="relative"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-[8rem] md:text-[12rem] font-bebas text-netflix-red leading-none tracking-wider">
            404
          </div>
          <motion.div
            className="absolute inset-0 text-[8rem] md:text-[12rem] font-bebas text-netflix-red/20 leading-none tracking-wider"
            animate={{ 
              x: [0, 2, -2, 0],
              y: [0, -1, 1, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            404
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-5xl font-bebas text-netflix-white tracking-wide">
            PAGE NOT FOUND
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-inter leading-relaxed">
            Looks like this page went missing from our catalog. The content you're looking for might have been moved, removed, or never existed.
          </p>
        </motion.div>

        {/* TV Static Effect */}
        <motion.div
          className="relative w-32 h-24 mx-auto bg-netflix-surface rounded-lg overflow-hidden border-4 border-gray-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 opacity-20">
            <motion.div
              className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          <div className="absolute inset-2 flex items-center justify-center">
            <ApperIcon name="Tv" className="h-8 w-8 text-gray-500" />
          </div>
          
          {/* Static noise effect */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 2'%3E%3Cpath fill='white' fill-opacity='0.2' d='M0 0h1v1H0V0zm1 1h1v1H1V1z'/%3E%3C/svg%3E")`,
              backgroundSize: '2px 2px'
            }}
            animate={{ 
              backgroundPosition: ['0px 0px', '4px 4px']
            }}
            transition={{ 
              duration: 0.1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="bg-netflix-red hover:bg-netflix-red-dark px-8 py-4 text-lg font-semibold"
          >
            <ApperIcon name="Home" className="h-5 w-5 mr-2" />
            Back to Home
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/search')}
            className="border-netflix-white/40 text-netflix-white hover:border-netflix-white px-8 py-4 text-lg"
          >
            <ApperIcon name="Search" className="h-5 w-5 mr-2" />
            Search Content
          </Button>
        </motion.div>

        {/* Help Links */}
        <motion.div
          className="pt-8 space-y-3 border-t border-netflix-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <p className="text-sm text-gray-500 font-inter">
            Need help finding something specific?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <button 
              onClick={() => navigate('/')}
              className="text-netflix-red hover:text-netflix-red-dark font-inter font-medium transition-colors duration-200"
            >
              Browse Popular Content
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => navigate('/my-list')}
              className="text-netflix-red hover:text-netflix-red-dark font-inter font-medium transition-colors duration-200"
            >
              Check My List
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound