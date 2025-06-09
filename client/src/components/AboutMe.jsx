import React from 'react'
import { SectionWrapper } from '../hoc';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, textVariant } from '../Utils/motion';
import image from '../assets/Delon.png'
import { FaBriefcase, FaFileDownload, FaGithub, FaGlobe, FaLinkedinIn, FaMapMarkedAlt, FaTwitter } from 'react-icons/fa'
import { styles } from '../styles';
import CV from '../assets/Delon-cv.pdf'


const AboutMe = () => {
  return (
    <section id='aboutme'>
      <div className="mx-auto">
        <h2 className={`${styles.sectionHeadText}`}>
          About <span className="text-[#915EFF]">Me</span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="lg:w-1/3 w-full">
            <div className="md:h-[700px] lg:h-auto rounded-xl overflow-hidden shadow-xl ">
              <img src={image} alt="Delon"
                className="w-full h-full object-cover object-top" />
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn("up", "spring")}
            className="lg:w-2/3 w-full ">
            <h3 className="text-2xl font-semibold mb-4 text-[#915EFF]">Who I Am</h3>
            <p className="text-secondary text-lg mb-6 leading-relaxed">
              I'm a passionate <span className="text-[#915EFF] font-semibold">Frontend Engineer</span> with 2+ years of hands-on-experience building high-performance, user-focused web applications. My journey from accounting and finance to tech has sharpened my ability to think analytically, manage complexity, and design intuitive interfaces that perform seamlessly across devices. 
            </p>
            <p className="text-secondary  text-lg mb-8 leading-relaxed">
              I specialize in <span className="text-[#915EFF] font-semibold">JavaScript</span>, <span className="text-[#915EFF] font-semibold">React</span>, and <span className="text-[#915EFF] font-semibold">Node.js</span>,  with a proven track record of delivering scalable, interactive, and data-driven solutions that align with both user expectations and business objectives.
            </p>

            <div className="flex flex-wrap gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2 bg-[#2e2e4d] px-4 py-2 rounded shadow">
                <FaMapMarkedAlt className="text-[#915EFF]" />
                <span>Ghana, Accra</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2e2e4d] px-4 py-2 rounded shadow">
                <FaGlobe className="text-[#915EFF]" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2e2e4d] px-4 py-2 rounded shadow">
                <FaBriefcase className="text-[#915EFF]" />
                <span>Available for Freelance</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-8 flex-wrap">
              <a 
              href="https://x.com/ansahdelon?s=21" 
              className="bg-[#2e2e4d] hover:text-[#915EFF] text-xl w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer"
              target='_blank'>
                <FaLinkedinIn />
              </a>
              <a href="https://github.com/DelonAnsah"  className="bg-[#2e2e4d] hover:text-[#915EFF] text-xl w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer"
               target='_blank'>
                <FaGithub />
              </a>
              <a href="https://x.com/ansahdelon?s=21" className="bg-[#2e2e4d] hover:text-[#915EFF] text-xl w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer"
               target='_blank'>
                <FaTwitter />
              </a>
              <a
                download=""
                href={CV}
                className="flex items-center gap-2 bg-[#915EFF] text-white px-4 py-2 rounded hover:bg-[#7b4fd6] transition"
              >
                <FaFileDownload />
                Download CV
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SectionWrapper(AboutMe, "AboutMe")

