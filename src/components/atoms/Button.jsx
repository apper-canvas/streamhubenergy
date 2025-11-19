import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import ApperIcon from '@/components/ApperIcon'

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  loading = false,
  icon,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-netflix-red hover:bg-netflix-red-dark text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
    outline: "border-2 border-netflix-white text-netflix-white hover:bg-netflix-white hover:text-netflix-bg transition-all duration-200",
    ghost: "text-netflix-white hover:bg-netflix-white/10 transition-all duration-200",
    secondary: "bg-netflix-surface hover:bg-netflix-surface/80 text-netflix-white border border-netflix-white/20 transition-all duration-200"
  }

  const sizes = {
    default: "h-12 px-6 text-base font-medium",
    sm: "h-10 px-4 text-sm font-medium",
    lg: "h-14 px-8 text-lg font-semibold",
    icon: "h-10 w-10"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-inter disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-all duration-150",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
      ) : icon ? (
        <ApperIcon name={icon} className="h-4 w-4 mr-2" />
      ) : null}
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button