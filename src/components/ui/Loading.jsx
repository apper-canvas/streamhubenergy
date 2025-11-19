import React from 'react'

const Loading = ({ type = 'page' }) => {
  if (type === 'hero') {
    return (
      <div className="relative w-full h-[70vh] bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-bg via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 p-8 lg:p-16 space-y-4 w-full max-w-2xl">
            <div className="h-12 bg-gray-600 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="flex space-x-4 pt-4">
              <div className="h-12 w-32 bg-gray-600 rounded animate-pulse"></div>
              <div className="h-12 w-40 bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'content-row') {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-64 h-36 bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className="w-64 h-36 bg-gray-700 rounded-lg animate-pulse flex-shrink-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg"></div>
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    )
  }

  // Default page loading
  return (
    <div className="min-h-screen bg-netflix-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-netflix-red/20 rounded-full mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-inter font-semibold text-netflix-white">Loading StreamHub</h2>
          <p className="text-gray-400 font-inter">Preparing your entertainment...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading