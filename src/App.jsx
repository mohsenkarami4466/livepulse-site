import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import Layout from './components/Layout/Layout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Layout>
          <AppRouter />
        </Layout>
      </div>
    </BrowserRouter>
  )
}

export default App

