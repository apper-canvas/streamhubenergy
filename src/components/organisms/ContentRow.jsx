import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import VideoCard from '@/components/molecules/VideoCard'
import Button from '@/components/atoms/Button'

const ContentRow = ({ 
  title, 
  content, 
  onPlay, 
  onAddToList, 
  myList = [], 
  watchProgress = {},
  onSeeAll,
  className = "" 
}) => {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  if (!content || content.length === 0) return null

  return (
    <motion.section
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl md:text-3xl font-bebas text-netflix-white tracking-wide">
            {title}
          </h2>
          <div className="h-px w-12 bg-gradient-to-r from-netflix-red to-transparent" />
        </div>
        
        {onSeeAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSeeAll}
            className="text-netflix-red hover:text-netflix-red-dark font-inter font-semibold"
          >
            See All
            <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Content Scrollable Row */}
      <div className="relative group">
        {/* Left Scroll Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-netflix-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ApperIcon name="ChevronLeft" className="h-6 w-6 text-netflix-white" />
        </Button>

        {/* Right Scroll Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-netflix-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ApperIcon name="ChevronRight" className="h-6 w-6 text-netflix-white" />
        </Button>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide content-row px-4 sm:px-6 lg:px-8 py-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {content.map((item, index) => (
            <motion.div
              key={item.Id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{ scrollSnapAlign: 'start' }}
            >
              <VideoCard
                content={item}
                onPlay={onPlay}
                onAddToList={onAddToList}
                inMyList={myList.includes(item.Id.toString())}
                progress={watchProgress[item.Id] || 0}
                className="w-64 md:w-72 lg:w-80"
              />
            </motion.div>
          ))}
        </div>

        {/* Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-netflix-bg to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-netflix-bg to-transparent pointer-events-none" />
      </div>
    </motion.section>
  )
}

export default ContentRow