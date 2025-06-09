import React from 'react'
import Hero from '../Hero'
import RecentWork from '../RecentWork'
import Contact from '../Contact'
import Tech from '../Tech'
import { StarsCanvas } from '../canvas'
import AboutMe from '../AboutMe'




const Home = () => {
  return (
    <main >
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
        <Hero />
      </div>
      <AboutMe />
      <RecentWork />
      <Tech />
      <div className='relative z-0'>
        <Contact />
        <StarsCanvas />
      </div>
     
    </main>
  )
}

export default Home
