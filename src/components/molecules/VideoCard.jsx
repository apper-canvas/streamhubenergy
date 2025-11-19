import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const VideoCard = ({ content, onPlay, onAddToList, inMyList = false, progress = 0, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handlePlay = (e) => {
    e.stopPropagation()
    onPlay?.(content)
  }

  const handleAddToList = (e) => {
    e.stopPropagation()
    onAddToList?.(content.Id)
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <motion.div
      className={`relative group cursor-pointer flex-shrink-0 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      {/* Main Image */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-netflix-surface">
        <img
          src={content.thumbnail}
          alt={content.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          } ${isHovered ? 'brightness-110' : 'brightness-100'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-netflix-white/30">
            <div 
              className="h-full bg-netflix-red transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="rating" className="text-xs">
            ★ {content.rating}
          </Badge>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs">
            {formatDuration(content.duration)}
          </Badge>
        </div>

        {/* Hover Content */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-netflix-white font-inter font-bold text-lg leading-tight line-clamp-2">
              {content.title}
            </h3>

            {/* Metadata */}
            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <span>{content.releaseYear}</span>
              <span>•</span>
              <span className="uppercase text-xs font-semibold">{content.maturityRating}</span>
              <span>•</span>
              <span className="capitalize">{content.type}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1">
              {content.genre.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs py-0.5 px-2">
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              <Button
                size="sm"
                onClick={handlePlay}
                className="flex-1 bg-netflix-red hover:bg-netflix-red-dark"
              >
                <ApperIcon name="Play" className="h-4 w-4 mr-1" />
                Play
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleAddToList}
                className="w-10 h-8 border-netflix-white/40 hover:border-netflix-white"
              >
                <ApperIcon 
                  name={inMyList ? "Check" : "Plus"} 
                  className={`h-4 w-4 ${inMyList ? 'text-netflix-red' : 'text-netflix-white'}`} 
                />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Play Button Overlay (visible when not hovered) */}
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-netflix-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Play" className="h-6 w-6 text-netflix-white ml-1" />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default VideoCard