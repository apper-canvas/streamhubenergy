import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Card = forwardRef(({ className, children, hover = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-netflix-surface border border-netflix-white/10 shadow-card transition-all duration-300",
        hover && "hover:shadow-card-hover hover:scale-[1.02] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pb-4", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card