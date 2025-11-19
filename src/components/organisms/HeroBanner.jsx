import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const HeroBanner = ({ content, onPlay, onAddToList, inMyList = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

useEffect(() => {
    if (Array.isArray(content) && content.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % content.length)
      }, 8000)
      return () => clearInterval(timer)
    }
  }, [content])

  // Early return after all hooks are called
  if (!content) return null

const currentContent = Array.isArray(content) ? content[currentIndex] : content

  const handlePlay = () => {
    onPlay?.(currentContent)
  }

  const handleAddToList = () => {
    onAddToList?.(currentContent.Id)
  }

  return (
    <motion.section
      className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
src={currentContent?.backdrop_c?.url || currentContent?.backdrop_c || '/placeholder-image.jpg'}
          alt={currentContent.title_c}
          className={`w-full h-full object-cover transition-all duration-1000 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-bg via-netflix-bg/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-bg/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            className="max-w-3xl space-y-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            key={currentContent.Id}
          >
            {/* Badges */}
            <div className="flex items-center space-x-3">
<Badge variant="rating">★ {currentContent?.rating_c || 'N/A'}</Badge>
              <Badge variant="secondary">{currentContent?.maturity_rating_c || 'Not Rated'}</Badge>
              <Badge variant="outline">{currentContent?.release_year_c || 'Unknown'}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas text-netflix-white leading-none tracking-wide">
{currentContent?.title_c || 'Untitled'}
            </h1>

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-lg text-gray-300 font-inter">
<span>{currentContent?.duration_c ? `${Math.floor(currentContent.duration_c / 60)}h ${currentContent.duration_c % 60}m` : 'Unknown duration'}</span>
              <span>•</span>
              <span className="capitalize">{currentContent?.type_c || 'Unknown'}</span>
<span>•</span>
              <span>
{(currentContent?.genre_c?.split(',') || []).slice(0, 3).map((genre, index) => (
                  <span key={`${genre}-${index}`} className="text-sm bg-netflix-white/20 px-2 py-1 rounded mr-1">
                    {genre?.trim() || 'Unknown'}
                  </span>
                ))}
              </span>
            </div>
            {/* Synopsis */}
            <p className="text-lg md:text-xl text-gray-200 font-inter leading-relaxed max-w-2xl line-clamp-3">
{currentContent?.synopsis_c || 'No description available.'}
            </p>

            {/* Cast */}
            <div className="text-gray-300 font-inter">
              <span className="text-netflix-white font-semibold">Starring: </span>
{(currentContent?.cast_c?.split(',') || []).slice(0, 3).map(actor => actor?.trim()).filter(Boolean).join(", ") || 'Cast information unavailable'}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={handlePlay}
                className="bg-netflix-red hover:bg-netflix-red-dark text-white px-12 py-4 text-xl font-bold shadow-2xl hover:shadow-netflix-red/30 transform hover:scale-105"
              >
                <ApperIcon name="Play" className="h-6 w-6 mr-3" />
                Play Now
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={handleAddToList}
                className="px-10 py-4 text-lg border-2 border-netflix-white/40 hover:border-netflix-white"
              >
                <ApperIcon 
                  name={inMyList ? "Check" : "Plus"} 
                  className={`h-5 w-5 mr-3 ${inMyList ? 'text-netflix-red' : ''}`} 
                />
                {inMyList ? "In My List" : "Add to List"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-netflix-white/60 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-1 h-3 bg-netflix-white/60 rounded-full mt-2" />
        </motion.div>
      </motion.div>

      {/* Content Indicators */}
      {Array.isArray(content) && content.length > 1 && (
        <div className="absolute bottom-8 right-8 flex space-x-2">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-netflix-red scale-125' 
                  : 'bg-netflix-white/40 hover:bg-netflix-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </motion.section>
  )
}

export default HeroBanner