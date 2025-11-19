import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ onSearch, placeholder = "Search movies and TV shows...", className = "" }) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch?.(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery("")
    onSearch?.("")
  }

  return (
    <motion.div
      className={`relative max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <ApperIcon 
            name="Search" 
            className={`h-5 w-5 transition-colors duration-200 ${
              isFocused ? 'text-netflix-red' : 'text-gray-400'
            }`} 
          />
        </div>

        {/* Input Field */}
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`pl-12 pr-12 h-14 text-lg bg-netflix-surface/80 backdrop-blur-md border-netflix-white/20 focus:border-netflix-red transition-all duration-300 ${
            isFocused ? 'shadow-lg shadow-netflix-red/20' : ''
          }`}
        />

        {/* Clear Button */}
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-netflix-white/10 transition-colors duration-200"
          >
            <ApperIcon name="X" className="h-4 w-4 text-gray-400 hover:text-netflix-white" />
          </motion.button>
        )}
      </div>

      {/* Search Suggestions or Loading */}
      {isFocused && query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 w-full bg-netflix-surface/95 backdrop-blur-md border border-netflix-white/10 rounded-lg shadow-xl z-50"
        >
          <div className="p-3 text-sm text-gray-400 font-inter">
            Searching for "{query}"...
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default SearchBar