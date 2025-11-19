import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import contentService from '@/services/api/contentService'
import myListService from '@/services/api/myListService'
import watchProgressService from '@/services/api/watchProgressService'
import SearchBar from '@/components/molecules/SearchBar'
import GenreFilter from '@/components/molecules/GenreFilter'
import VideoCard from '@/components/molecules/VideoCard'
import VideoPlayer from '@/components/organisms/VideoPlayer'
import ContentModal from '@/components/organisms/ContentModal'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'

const Search = () => {
  // Content state
  const [allContent, setAllContent] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [trendingContent, setTrendingContent] = useState([])
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [availableGenres, setAvailableGenres] = useState([])
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedContent, setSelectedContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [myList, setMyList] = useState([])
  const [watchProgress, setWatchProgress] = useState({})

  useEffect(() => {
    loadSearchData()
  }, [])

  useEffect(() => {
    filterResults()
  }, [searchResults, selectedGenre])

  const loadSearchData = async () => {
    try {
      setLoading(true)
      setError("")

      const [
        content,
        trending,
        myListData,
        progressData
      ] = await Promise.all([
        contentService.getAll(),
        contentService.getTrending(),
        myListService.getMyList(),
        watchProgressService.getAll()
      ])

      setAllContent(content)
      setSearchResults(content)
      setTrendingContent(trending)
      setMyList(myListData.contentIds)

      // Extract unique genres
const genres = [...new Set(content.flatMap(item => item.genre_c?.split(',') || []))]
      setAvailableGenres(genres.sort())

      // Process watch progress
      const progressMap = {}
      progressData.forEach(progress => {
        progressMap[progress.contentId] = progress.progress
      })
      setWatchProgress(progressMap)

    } catch (err) {
      setError(err.message || "Failed to load search data")
      console.error('Error loading search data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults(allContent)
      return
    }

    try {
      const results = await contentService.search(query)
      setSearchResults(results)
    } catch (err) {
      console.error('Search error:', err)
      setSearchResults([])
    }
  }

  const filterResults = () => {
    let filtered = searchResults

    if (selectedGenre !== "All") {
filtered = filtered.filter(content => content.genre_c?.split(',').includes(selectedGenre))
    }

    setFilteredResults(filtered)
  }

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre)
  }

  const handlePlay = (content) => {
    setSelectedContent(content)
    setIsPlayerOpen(true)
  }

  const handleContentClick = (content) => {
    setSelectedContent(content)
    setIsModalOpen(true)
  }

  const handleAddToList = async (contentId) => {
    try {
      const isInList = myList.includes(contentId.toString())
      
      if (isInList) {
        await myListService.removeFromList(contentId)
        setMyList(prev => prev.filter(id => id !== contentId.toString()))
        toast.success("Removed from My List")
      } else {
        await myListService.addToList(contentId)
        setMyList(prev => [...prev, contentId.toString()])
        toast.success("Added to My List")
      }
    } catch (err) {
      toast.error("Failed to update My List")
      console.error('Error updating My List:', err)
    }
  }

  const handleProgressUpdate = async (contentId, progress) => {
    try {
      await watchProgressService.updateProgress(contentId, progress)
      setWatchProgress(prev => ({ ...prev, [contentId]: progress }))
    } catch (err) {
      console.error('Error updating progress:', err)
    }
  }

  if (loading) return <Loading type="page" />
  if (error) return <ErrorView error={error} onRetry={loadSearchData} />

  const showTrending = !searchQuery.trim() && selectedGenre === "All"
  const showResults = filteredResults.length > 0
  const showEmpty = !showTrending && !showResults

  return (
    <div className="min-h-screen bg-netflix-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Header */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bebas text-netflix-white tracking-wide">
            SEARCH & DISCOVER
          </h1>
          <p className="text-xl text-gray-400 font-inter max-w-2xl mx-auto">
            Find your next favorite movie or TV show from our extensive library
          </p>
        </motion.div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Genre Filters */}
        <GenreFilter
          genres={availableGenres}
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          className="justify-center"
        />

        {/* Search Results Counter */}
        {searchQuery && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 font-inter">
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found for "{searchQuery}"
              {selectedGenre !== "All" && ` in ${selectedGenre}`}
            </p>
          </motion.div>
        )}

        {/* Content Display */}
        {showTrending && (
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bebas text-netflix-white tracking-wide">
                TRENDING NOW
              </h2>
              <p className="text-gray-400 font-inter">
                Popular content everyone is watching
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingContent.map((content, index) => (
                <motion.div
key={content.Id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <VideoCard
                    content={content}
                    onPlay={handleContentClick}
                    onAddToList={handleAddToList}
                    inMyList={myList.includes(content.Id.toString())}
                    progress={watchProgress[content.Id] || 0}
                    className="w-full aspect-video"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {showResults && (
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResults.map((content, index) => (
                <motion.div
key={content.Id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <VideoCard
                    content={content}
                    onPlay={handleContentClick}
                    onAddToList={handleAddToList}
                    inMyList={myList.includes(content.Id.toString())}
                    progress={watchProgress[content.Id] || 0}
                    className="w-full aspect-video"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {showEmpty && (
          <Empty
            title="No Results Found"
            message="We couldn't find any content matching your search criteria. Try different keywords or browse our trending content."
            actionLabel="Browse Trending"
            onAction={() => {
              setSearchQuery("")
              setSelectedGenre("All")
            }}
            type="search"
          />
        )}
      </div>

      {/* Content Modal */}
      <ContentModal
        content={selectedContent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlay={handlePlay}
        onAddToList={handleAddToList}
        inMyList={selectedContent && myList.includes(selectedContent.Id?.toString())}
      />

      {/* Video Player */}
      {isPlayerOpen && selectedContent && (
        <VideoPlayer
          content={selectedContent}
          onClose={() => setIsPlayerOpen(false)}
          onProgressUpdate={handleProgressUpdate}
          initialProgress={watchProgress[selectedContent.Id] || 0}
        />
      )}
    </div>
  )
}

export default Search