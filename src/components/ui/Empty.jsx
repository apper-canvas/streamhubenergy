import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "Nothing to see here", 
  message = "It looks like there's no content available at the moment.", 
  actionLabel = "Browse Content", 
  onAction,
  type = 'page',
  icon = 'Film' 
}) => {
  if (type === 'inline') {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-netflix-white font-inter font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 font-inter text-sm mb-4 max-w-sm mx-auto">{message}</p>
        {onAction && (
          <Button variant="outline" size="sm" onClick={onAction} className="text-netflix-red border-netflix-red hover:bg-netflix-red hover:text-white">
            {actionLabel}
          </Button>
        )}
      </div>
    )
  }

  if (type === 'search') {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-netflix-red/20 to-netflix-red-dark/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Search" className="h-10 w-10 text-netflix-red" />
        </div>
        <h3 className="text-xl font-bebas text-netflix-white tracking-wide mb-3">NO RESULTS FOUND</h3>
        <p className="text-gray-400 font-inter max-w-md mx-auto mb-6">
          We couldn't find any content matching your search. Try different keywords or browse our categories.
        </p>
        <div className="space-y-3">
          {onAction && (
            <Button onClick={onAction} className="bg-netflix-red hover:bg-netflix-red-dark">
              <ApperIcon name="Home" className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Default page empty state
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-netflix-red/20 to-netflix-red-dark/20 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name={icon} className="h-12 w-12 text-netflix-red" />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
              <ApperIcon name="Plus" className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bebas text-netflix-white tracking-wide">{title.toUpperCase()}</h2>
          <p className="text-gray-400 font-inter leading-relaxed">{message}</p>
        </div>

        {onAction && (
          <Button onClick={onAction} className="bg-netflix-red hover:bg-netflix-red-dark">
            <ApperIcon name="Play" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}

        <div className="pt-4">
          <p className="text-xs text-gray-500 font-inter">
            Discover amazing movies and TV shows waiting for you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Empty