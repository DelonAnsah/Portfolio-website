import React from "react";

import { motion } from "framer-motion";
import Tilt from 'react-parallax-tilt';
import { styles } from '../styles';
import { fadeIn, textVariant } from '../Utils/motion';
import { projects } from './Constants';
import { SectionWrapper } from '../hoc'
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-[#1e1e2f] hover:p-5 rounded-2xl shadow-lg transition-transform duration-300 hover:shadow-[#915EFF]/50 hover:-translate-y-2 group" 
      >
        <div className="overflow-hidden h-full relative">
          <img
            src={image}
            alt="project_image"
            className="w-full h-full object-cover object-top rounded"
            loading="lazy"
          />
         
          <div className="absolute inset-0 bg-[#1a1a3d] md:p-14 lg:p-4 xl:p-8 2xl:p-4 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
            <div className="mb-2 md:mb-4 ">
              <h3 className="md:text-2xl lg:text-xl xl:text-2xl 2xl:text-xl font-bold text-white">{name}</h3>
              <p className="text-secondary text-xs md:text-base lg:text-sm xl:text-[18px] leading-4 2xl:text-sm mt-2">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-1 md:mt-3 md:mb-5">
              {tags.map((tag) => (
                <p
                  key={`${name}-${tag.name}`}
                   className="text-[#915EFF] text-[10px] md:text-base lg:text-sm xl:text-base 2xl:text-xs font-semibold bg-[#2e2e4d] px-2 py-1 rounded"
                >
                   #{tag.name}
                </p>
              ))}
            </div>

            <div className="flex gap-4 text-xs md:text-base lg:text-sm xl:text-xl mt-3 md:mt-5 xl:mt-6 2xl:text-sm 2xl:mt-4">
              <a
                href={ source_code_link}
                target="_blank"
                 rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#915EFF] hover:text-white transition-colors"
              >
                <FaExternalLinkAlt />
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};


const Works = () => {

  const navigate = useNavigate();


  const handleViewProjects = () => {
    navigate('/project')
  }

  return (
    <div id="projects">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My recent work</p>
        <h2 className={`${styles.sectionHeadText}`}  >Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
      <div className="text-center mt-12">
        <button
          onClick={handleViewProjects}
          className="bg-[#915EFF] text-blue-100 hover:bg-[#7b4fd6] font-medium py-3 px-8 rounded-lg transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
          View All Projects
        </button>
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "Works");