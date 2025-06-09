import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CountUp } from 'countup.js';
import { fadeIn } from '../Utils/motion';
import { styles } from '../styles';


const StatsSection = ({ projectData, tags }) => {
  const controls = useAnimation();
  const [inView, setInView] = useState(false);

  // Check when stats section comes into view
 const onScroll = () => {
  const statsSection = document.getElementById('stats-section');
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom >= 0) {
    console.log("Stats section is in view!");
    setInView(true); // Set to true when stats section is in view
  } else {
    setInView(false); // Optionally, you can reset to false when out of view
  }
};


  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

useEffect(() => {
  if (inView) {
    console.log("Stats section is in view, starting CountUp");

    // Cleanup previous instances if any (ensure animation doesn't run twice)
    const projectsCount = document.getElementById('projects-count');
    const technologiesCount = document.getElementById('technologies-count');
    const openSourceCount = document.getElementById('open-source-count');
    const passionCount = document.getElementById('passion-count');

    // Initialize the countups
    new CountUp(projectsCount, 0, projectData.length, 0, 2.5).start();
    new CountUp(technologiesCount, 0, tags.length, 0, 2.5).start();
    new CountUp(openSourceCount, 0, 8, 0, 2.5).start();
    new CountUp(passionCount, 0, 100, 0, 2.5).start();
  }
}, [inView, projectData.length, tags.length]); // Re-run when inView, projectData or tags change



  return (
    <motion.div
      id="stats-section"
      variants={fadeIn('up', 'spring', 0.5, 0.75)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="mt-16 bg-[#1e1e2f] rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
      style={{ border: '2px solid red, z-index: 10' }}
    >
      <div className="text-center">
        <div>
          <div
            id="projects-count"
            className="text-3xl font-bold text-[#915EFF]"
          >
            0
          </div>
        </div>
        <div className="text-secondary">Projects</div>
      </div>
      <div className="text-center">
        <div
          id="technologies-count"
          className="text-3xl font-bold text-[#915EFF]"
        >
          0
        </div>
        <div className="text-secondary">Technologies</div>
      </div>
      <div className="text-center">
        <div
          id="open-source-count"
          className="text-3xl font-bold text-[#915EFF]"
        >
          0
        </div>
        <div className="text-secondary">Open Source</div>
      </div>
      <div className="text-center">
        <div
          id="passion-count"
          className="text-3xl font-bold text-[#915EFF]"
        >
          0
        </div>
        <div className="text-secondary">Passion</div>
      </div>
    </motion.div>
  );
};

export default StatsSection;