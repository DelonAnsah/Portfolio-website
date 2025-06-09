import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SinglePost from './components/SinglePost'
import Navbar from './components/Navbar'
import Home from './components/pages/Home'
import Footer from './components/Footer'
import Post from './components/pages/Post'
import Projects from './components/pages/Projects'
import Games from './components/pages/Games'
import GameDetail from './components/GameDetail'
import ScrollToTop from './components/ScrollToTop'


const App = () => {
  return (
    <div className='relative z-0 bg-primary'>
      <Navbar />
      <main className=''>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/post/:slug' element={<SinglePost />} />
          <Route path='/post' element={<Post />} />
          <Route path='/project' element={<Projects />} />
          <Route path='/games' element={<Games />} />
          <Route path='/games/:gameId' element={<GameDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
