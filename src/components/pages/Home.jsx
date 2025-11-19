import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import contentService from '@/services/api/contentService'
import watchProgressService from '@/services/api/watchProgressService'
import myListService from '@/services/api/myListService'
import HeroBanner from '@/components/organisms/HeroBanner'
import ContentRow from '@/components/organisms/ContentRow'
import VideoPlayer from '@/components/organisms/VideoPlayer'
import ContentModal from '@/components/organisms/ContentModal'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'

const Home = () => {
  // Content state
  const [featuredContent, setFeaturedContent] = useState([])
  const [trendingContent, setTrendingContent] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [actionContent, setActionContent] = useState([])
  const [dramaContent, setDramaContent] = useState([])
  const [comedyContent, setComedyContent] = useState([])
  const [continueWatching, setContinueWatching] = useState([])
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedContent, setSelectedContent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [myList, setMyList] = useState([])
  const [watchProgress, setWatchProgress] = useState({})

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      setError("")

      const [
        allContent,
        trending,
        newContent,
        action,
        drama,
        comedy,
        continueWatchingData,
        myListData,
        progressData
      ] = await Promise.all([
        contentService.getAll(),
        contentService.getTrending(),
        contentService.getNewReleases(),
        contentService.getByGenre('Action'),
        contentService.getByGenre('Drama'),
        contentService.getByGenre('Comedy'),
        watchProgressService.getContinueWatching(),
        myListService.getMyList(),
        watchProgressService.getAll()
      ])

      // Set featured content (top 3 trending)
      setFeaturedContent(trending.slice(0, 3))
      setTrendingContent(trending)
      setNewReleases(newContent)
      setActionContent(action)
      setDramaContent(drama)
      setComedyContent(comedy)
      setMyList(myListData.contentIds)

      // Process continue watching
      const continueWatchingContent = await Promise.all(
        continueWatchingData.map(async (progress) => {
          const content = await contentService.getById(progress.contentId)
          return { ...content, progress: progress.progress }
        })
      )
      setContinueWatching(continueWatchingContent.filter(Boolean))

      // Process watch progress
      const progressMap = {}
      progressData.forEach(progress => {
        progressMap[progress.contentId] = progress.progress
      })
      setWatchProgress(progressMap)

    } catch (err) {
      setError(err.message || "Failed to load content")
      console.error('Error loading home data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (content) => {
    setSelectedContent(content)
    setIsPlayerOpen(true)
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

  const handleContentClick = (content) => {
    setSelectedContent(content)
    setIsModalOpen(true)
  }

  if (loading) return <Loading type="page" />
  if (error) return <ErrorView error={error} onRetry={loadHomeData} />

  return (
    <div className="min-h-screen bg-netflix-bg">
      {/* Hero Banner */}
      <HeroBanner
        content={featuredContent}
        onPlay={handlePlay}
        onAddToList={handleAddToList}
inMyList={featuredContent.length > 0 && myList.includes(featuredContent[0]?.Id?.toString())}
      />

      {/* Content Rows */}
      <div className="space-y-8 pb-8">
        {continueWatching.length > 0 && (
          <ContentRow
            title="Continue Watching"
            content={continueWatching}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            myList={myList}
            watchProgress={watchProgress}
          />
        )}

        <ContentRow
          title="Trending Now"
          content={trendingContent}
          onPlay={handleContentClick}
          onAddToList={handleAddToList}
          myList={myList}
          watchProgress={watchProgress}
        />

        <ContentRow
          title="New Releases"
          content={newReleases}
          onPlay={handleContentClick}
          onAddToList={handleAddToList}
          myList={myList}
          watchProgress={watchProgress}
        />

        <ContentRow
          title="Action & Adventure"
          content={actionContent}
          onPlay={handleContentClick}
          onAddToList={handleAddToList}
          myList={myList}
          watchProgress={watchProgress}
        />

        <ContentRow
          title="Drama Series"
          content={dramaContent}
          onPlay={handleContentClick}
          onAddToList={handleAddToList}
          myList={myList}
          watchProgress={watchProgress}
        />

        <ContentRow
          title="Comedy Shows"
          content={comedyContent}
          onPlay={handleContentClick}
          onAddToList={handleAddToList}
          myList={myList}
          watchProgress={watchProgress}
        />
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

export default Home