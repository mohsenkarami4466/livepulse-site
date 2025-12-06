import React from 'react'
import Header from '../Header/Header'
import BottomNavigation from '../BottomNavigation/BottomNavigation'
import './Layout.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}

export default Layout

