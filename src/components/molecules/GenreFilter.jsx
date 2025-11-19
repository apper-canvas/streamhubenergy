import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'

const GenreFilter = ({ genres, selectedGenre, onGenreSelect, className = "" }) => {
  const allGenres = ["All", ...genres]

  return (
    <motion.div
      className={`flex flex-wrap gap-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {allGenres.map((genre) => (
        <Button
          key={genre}
          variant={selectedGenre === genre ? "default" : "outline"}
          size="sm"
          onClick={() => onGenreSelect(genre)}
          className={`font-inter font-medium transition-all duration-200 ${
            selectedGenre === genre
              ? "bg-netflix-red hover:bg-netflix-red-dark shadow-lg"
              : "border-netflix-white/40 text-netflix-white hover:border-netflix-red hover:text-netflix-red"
          }`}
        >
          {genre}
        </Button>
      ))}
    </motion.div>
  )
}

export default GenreFilter