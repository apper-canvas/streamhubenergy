import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const ContentModal = ({ content, isOpen, onClose, onPlay, onAddToList, inMyList = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setImageLoaded(false)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!content || !isOpen) return null

  const handlePlay = () => {
    onPlay?.(content)
    onClose()
  }

  const handleAddToList = () => {
    onAddToList?.(content.Id)
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-4xl bg-netflix-surface rounded-lg overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 border border-netflix-white/20"
              >
                <ApperIcon name="X" className="h-5 w-5 text-netflix-white" />
              </Button>

              {/* Hero Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={content.backdrop}
                  alt={content.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Loading skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-surface via-netflix-surface/40 to-transparent" />

                {/* Content Over Image */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="rating">★ {content.rating}</Badge>
                      <Badge variant="secondary">{content.maturityRating}</Badge>
                      <Badge variant="outline">{content.releaseYear}</Badge>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bebas text-netflix-white leading-none tracking-wide">
                      {content.title}
                    </h1>

                    <div className="flex items-center space-x-6">
                      <Button
                        size="lg"
                        onClick={handlePlay}
                        className="bg-netflix-red hover:bg-netflix-red-dark px-8 py-3 text-lg font-bold"
                      >
                        <ApperIcon name="Play" className="h-5 w-5 mr-2" />
                        Play
                      </Button>

                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={handleAddToList}
                        className="px-6 py-3 border-netflix-white/40 hover:border-netflix-white"
                      >
                        <ApperIcon 
                          name={inMyList ? "Check" : "Plus"} 
                          className={`h-5 w-5 mr-2 ${inMyList ? 'text-netflix-red' : ''}`} 
                        />
                        {inMyList ? "In My List" : "Add to List"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-gray-300 font-inter">
                      <span className="text-lg font-semibold text-netflix-white">{formatDuration(content.duration)}</span>
                      <span>•</span>
                      <span className="capitalize text-netflix-red font-semibold">{content.type}</span>
                      <span>•</span>
                      <span>Directed by {content.director}</span>
                    </div>

                    {/* Synopsis */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-inter font-bold text-netflix-white">Synopsis</h3>
                      <p className="text-gray-300 font-inter leading-relaxed text-lg">
                        {content.synopsis}
                      </p>
                    </div>

                    {/* Cast */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-inter font-bold text-netflix-white">Cast</h3>
                      <div className="flex flex-wrap gap-2">
                        {content.cast.map((actor) => (
                          <Badge key={actor} variant="outline" className="text-sm py-1 px-3">
                            {actor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Genres */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-inter font-bold text-netflix-white">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {content.genre.map((genre) => (
                          <Badge key={genre} variant="default" className="text-sm">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4 text-sm font-inter">
                      <div className="space-y-2">
                        <span className="text-gray-400">Release Year:</span>
                        <p className="text-netflix-white font-semibold">{content.releaseYear}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-gray-400">Rating:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-netflix-white font-semibold">{content.rating}</span>
                          <span className="text-yellow-500">★★★★★</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-gray-400">Maturity Rating:</span>
                        <Badge variant="secondary" className="text-xs">
                          {content.maturityRating}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContentModal