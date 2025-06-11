import React, { useEffect, useState } from 'react'
import { SectionWrapper } from '../hoc'
import { technologies } from './Constants'
import { BallCanvas } from './canvas'

const Tech = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const handleMediaQueryChange = (event) => {
      setIsSmallScreen(event.matches)
    }

    // Set initial value
    setIsSmallScreen(mediaQuery.matches)

    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  const displayedTechnologies = isSmallScreen
    ? technologies.slice(0, 6)
    : technologies

  return (
    <section className='md:px-28' id='tech'>
      <h2 className="text-center text-3xl font-bold mb-10 text-[#915EFF]">
        Technologies I Use
      </h2>

      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {displayedTechnologies.map((technology) => (
          <div className='w-36 h-36 flex flex-col items-center' key={technology.name}>
            <BallCanvas icon={technology.icon} />
            <p className='text-center mt-2 text-sm text-white'>{technology.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SectionWrapper(Tech, '')
