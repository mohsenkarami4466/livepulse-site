import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import AppRouter from './router/AppRouter'
import Layout from './components/Layout/Layout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App">
          <Layout>
            <AppRouter />
          </Layout>
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App

