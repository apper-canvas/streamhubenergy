import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-netflix-white/20 bg-netflix-surface/50 backdrop-blur-sm px-4 py-3 text-base text-netflix-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-netflix-red transition-all duration-200 font-inter",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input