import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import myListService from "@/services/api/myListService";
import watchProgressService from "@/services/api/watchProgressService";
import contentService from "@/services/api/contentService";
import ApperIcon from "@/components/ApperIcon";
import VideoCard from "@/components/molecules/VideoCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import VideoPlayer from "@/components/organisms/VideoPlayer";
import ContentModal from "@/components/organisms/ContentModal";
import Button from "@/components/atoms/Button";

const MyList = () => {
  // Content state
  const [myListContent, setMyListContent] = useState([])
  const [filteredContent, setFilteredContent] = useState([])
  
  // Filter state
  const [sortBy, setSortBy] = useState("added") // added, title, rating, year
  const [filterType, setFilterType] = useState("all") // all, movie, series
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedContent, setSelectedContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [myListIds, setMyListIds] = useState([])
  const [watchProgress, setWatchProgress] = useState({})
  const [myListTimestamps, setMyListTimestamps] = useState({})

  useEffect(() => {
    loadMyListData()
  }, [])

  useEffect(() => {
    filterAndSortContent()
  }, [myListContent, sortBy, filterType])

  const loadMyListData = async () => {
    try {
      setLoading(true)
      setError("")

      const [myListData, progressData] = await Promise.all([
        myListService.getMyList(),
        watchProgressService.getAll()
      ])

      setMyListIds(myListData.contentIds)
      setMyListTimestamps(myListData.addedTimestamps)

      // Load content details for items in My List
      const contentPromises = myListData.contentIds.map(id => contentService.getById(id))
      const contentResults = await Promise.all(contentPromises)
      const validContent = contentResults.filter(Boolean)
      
      setMyListContent(validContent)

      // Process watch progress
      const progressMap = {}
      progressData.forEach(progress => {
        progressMap[progress.contentId] = progress.progress
      })
      setWatchProgress(progressMap)

    } catch (err) {
      setError(err.message || "Failed to load My List")
      console.error('Error loading My List:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortContent = () => {
    let filtered = [...myListContent]

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(content => content.type === filterType)
    }

// Sort content
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating)
        case "year":
          return b.releaseYear - a.releaseYear
        case "added":
        default:
          const timestampA = myListTimestamps[a.Id] || 0
          const timestampB = myListTimestamps[b.Id] || 0
          return timestampB - timestampA
      }
    })
setFilteredContent(filtered)
  }

  const handlePlay = (content) => {
    setSelectedContent(content)
    setIsPlayerOpen(true)
  }

  const handleContentClick = (content) => {
    setSelectedContent(content)
    setIsModalOpen(true)
  }

  const handleRemoveFromList = async (contentId) => {
    try {
      await myListService.removeFromList(contentId)
      setMyListIds(prev => prev.filter(id => id !== contentId.toString()))
setMyListContent(prev => prev.filter(content => content.Id !== contentId))
      toast.success("Removed from My List")
    } catch (err) {
      toast.error("Failed to remove from My List")
      console.error('Error removing from My List:', err)
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

  const clearMyList = async () => {
    if (window.confirm("Are you sure you want to clear your entire list? This action cannot be undone.")) {
      try {
        const promises = myListIds.map(id => myListService.removeFromList(id))
        await Promise.all(promises)
        
        setMyListContent([])
        setMyListIds([])
        toast.success("My List cleared")
      } catch (err) {
        toast.error("Failed to clear My List")
        console.error('Error clearing My List:', err)
      }
    }
  }

  if (loading) return <Loading type="page" />
  if (error) return <ErrorView error={error} onRetry={loadMyListData} />

  const isEmpty = filteredContent.length === 0

  return (
    <div className="min-h-screen bg-netflix-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bebas text-netflix-white tracking-wide">
              MY LIST
            </h1>
            <p className="text-xl text-gray-400 font-inter">
              {myListContent.length} title{myListContent.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>

          {myListContent.length > 0 && (
            <Button
              variant="outline"
              onClick={clearMyList}
              className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
            >
              <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
              Clear List
            </Button>
          )}
        </motion.div>

        {/* Filters and Sorting */}
        {myListContent.length > 0 && (
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-netflix-surface/50 backdrop-blur-sm rounded-lg p-4 border border-netflix-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-netflix-white font-inter font-medium">Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-netflix-surface border border-netflix-white/20 rounded-md px-3 py-1 text-netflix-white font-inter text-sm focus:outline-none focus:border-netflix-red"
                >
                  <option value="all">All</option>
                  <option value="movie">Movies</option>
                  <option value="series">TV Shows</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <span className="text-netflix-white font-inter font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-netflix-surface border border-netflix-white/20 rounded-md px-3 py-1 text-netflix-white font-inter text-sm focus:outline-none focus:border-netflix-red"
                >
                  <option value="added">Recently Added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="year">Year (Newest First)</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-400 font-inter">
              Showing {filteredContent.length} of {myListContent.length} titles
            </div>
          </motion.div>
        )}

{/* Content Grid */}
        {!isEmpty && (
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map((content, index) => (
                <motion.div
key={content.Id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative group"
                >
                  <VideoCard
                    content={content}
                    onPlay={handleContentClick}
                    onAddToList={() => handleRemoveFromList(content.Id)}
                    inMyList={true}
                    progress={watchProgress[content.Id] || 0}
                    className="w-full aspect-video"
                  />

                  {/* Quick Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
onClick={() => handleRemoveFromList(content.Id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-netflix-red border border-netflix-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <ApperIcon name="X" className="h-4 w-4 text-netflix-white" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty State */}
        {isEmpty && myListContent.length === 0 && (
          <Empty
            title="Your List is Empty"
            message="Start adding movies and TV shows to create your personal watchlist. Browse our catalog and save content for later viewing."
            actionLabel="Browse Content"
            onAction={() => window.location.href = '/'}
            icon="Bookmark"
          />
        )}

        {/* Filtered Empty State */}
        {isEmpty && myListContent.length > 0 && (
          <Empty
            title="No Results Found"
            message={`No ${filterType === 'all' ? 'content' : filterType === 'movie' ? 'movies' : 'TV shows'} found in your list with the current filters.`}
            actionLabel="Clear Filters"
            onAction={() => {
              setFilterType("all")
              setSortBy("added")
            }}
            type="inline"
          />
        )}
      </div>

      {/* Content Modal */}
      <ContentModal
        content={selectedContent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlay={handlePlay}
        onAddToList={(contentId) => handleRemoveFromList(contentId)}
        inMyList={true}
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

export default MyList