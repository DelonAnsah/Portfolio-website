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
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[250px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`bg-[#2e2e4d] text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded`}
            >
              {tag.name}
            </p>
          ))}
        </div>
        <div className="flex gap-4 text-sm mt-6">
          <a href="#" className="flex items-center gap-2 mr-4 text-blue-100 font-medium cursor-pointer">
            <FaExternalLinkAlt />Live Demo
          </a>
          <a href="#" className="flex items-center text-secondary gap-2 font-medium cursor-pointer">
            <FaGithub />GitHub
          </a>
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
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
      <div className="text-center mt-12">
        <button
          onClick={handleViewProjects}
          className="bg-[#2e2e4d] text-blue-100 hover:bg-tertiary font-medium py-3 px-8 rounded-lg transition-colors duration-300 !rounded-button whitespace-nowrap cursor-pointer">
          View All Projects
        </button>
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "Works");