import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/organisms/Header'

const Layout = () => {
  return (
    <div className="min-h-screen bg-netflix-bg">
      <Header />
      <main className="pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout