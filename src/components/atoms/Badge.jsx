import React from 'react'
import { cn } from '@/utils/cn'

const Badge = ({ children, className, variant = "default" }) => {
  const variants = {
    default: "bg-netflix-red text-white",
    secondary: "bg-netflix-surface text-netflix-white border border-netflix-white/20",
    outline: "border border-netflix-white/40 text-netflix-white bg-transparent",
    rating: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold"
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold font-inter transition-all duration-200",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export default Badge