import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Pages
import Home from '../pages/Home/Home'
import News from '../pages/News/News'
import Globe from '../pages/Globe/Globe'
import Tutorial from '../pages/Tutorial/Tutorial'
import Relax from '../pages/Relax/Relax'
import Tools from '../pages/Tools/Tools'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/globe" element={<Globe />} />
      <Route path="/tutorial" element={<Tutorial />} />
      <Route path="/relax" element={<Relax />} />
      <Route path="/tools" element={<Tools />} />
    </Routes>
  )
}

export default AppRouter

