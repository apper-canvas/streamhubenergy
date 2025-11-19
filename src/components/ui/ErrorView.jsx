import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorView = ({ error, onRetry, type = 'page' }) => {
  if (type === 'inline') {
    return (
      <div className="bg-netflix-surface/50 border border-red-500/20 rounded-lg p-6 text-center">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-netflix-red mx-auto mb-3" />
        <h3 className="text-netflix-white font-inter font-semibold mb-2">Something went wrong</h3>
        <p className="text-gray-400 font-inter text-sm mb-4">{error || "Failed to load content"}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="text-netflix-red border-netflix-red hover:bg-netflix-red hover:text-white">
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-netflix-bg flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-netflix-red to-netflix-red-dark rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Zap" className="h-10 w-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-8 h-8 bg-netflix-red rounded-full flex items-center justify-center">
              <ApperIcon name="X" className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bebas text-netflix-white tracking-wide">OOPS! SOMETHING WENT WRONG</h2>
          <p className="text-gray-400 font-inter leading-relaxed">
            {error || "We're having trouble loading your content right now. Please check your connection and try again."}
          </p>
        </div>

        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full bg-netflix-red hover:bg-netflix-red-dark">
              <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
            <ApperIcon name="Home" className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 font-inter">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorView