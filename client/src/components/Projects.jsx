import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { styles } from '../styles';
import { fadeIn, textVariant, staggerContainer } from '../Utils/motion';
import { client } from '../client';
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaFilter, FaHeart } from 'react-icons/fa';
import { FiGrid, FiList, FiSearch, FiX } from 'react-icons/fi';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';




const Projects = () => {
  const [projectData, setProjectData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredIndex, setFeaturedIndex] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(true);



  // Intersection Observer hook for Stats section

  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger once when the section comes into view
    threshold: 0.3, // Trigger when 30% of the section is visible
  });


  const ProjectCard = ({ title, description, link, tags, mainImage, isListView, index }) => {
    return (
      <motion.div
        className={`bg-[#1e1e2f] rounded-2xl shadow-xl overflow-hidden border-[#915EFF]/20 hover:border-[#915EFF]/50 transition-all duration-300 hover:-translate-y-2 group ${isListView ? "flex flex-col md:flex-row" : ""}`}
      >
        <div
          className={`relative overflow-hidden ${isListView ? "md:w-1/3" : "w-full"}`}>
          {/* Image Section */}
          {mainImage && mainImage.asset?.url && (
            <div>
              <img
                src={mainImage.asset.url}
                alt={title}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${isListView ? 'h-52 lg:h-auto' : 'h-64'}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className={` p-4 lg:p-6 flex flex-col justify-between ${isListView ? "md:w-2/3" : ""}`}>
          <div>
            <div className="flex justify-between items-start mb-3">
              <motion.h3
                className={`font-bold text-white group-hover:text-[#915EFF] transition-colors duration-300 ${isListView ? 'text-base sm:text-lg md:text-xl' : 'text-lg sm:text-xl'
                  }`}
                whileHover={{ x: 5 }}
              >
                {title}
              </motion.h3>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#915EFF] hover:text-white transition-colors p-1 rounded"
                aria-label="Live demo"
              >
                <FaExternalLinkAlt size={16} />
              </a>
            </div>
            <p
              className={`text-gray-300 leading-relaxed mb-4 ${isListView
                  ? 'text-xs sm:text-sm  sm:line-clamp-3'
                  : 'text-sm line-clamp-3'
                }`}>{description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tags?.slice(0, isListView ? 10 : 6).map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                className={`text-[#915EFF] font-medium bg-[#915EFF]/10 border border-[#915EFF]/30 rounded-full hover:bg-[#915EFF]/20 transition-colors cursor-pointer ${isListView ? 'text-xs px-2 py-1' : 'text-xs px-3 py-1'
                  }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => !selectedTags.includes(tag) && toggleTag(tag)}
              >
                #{tag}
              </motion.span>
            ))}
            {tags?.length > (isListView ? 10 : 6) && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{tags.length - (isListView ? 10 : 6)} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };



  useEffect(() => {
    client.fetch(`*[_type == 'project']{
      title,
      description,
      link,
      tags,
      mainImage {
        asset->{
      _id,
      url
    }
      }
      }`)
      .then((data) => {
        setProjectData(data);
        setFilteredProjects(data);

        const allTags = new Set(data.flatMap(project => project.tags));
        setTags(Array.from(allTags).sort());
      })
      .catch(console.error)
  }, [])


  useEffect(() => {
    let filtered = projectData;

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.every(tag => project.tags.includes(tag))
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
    setFeaturedIndex(0); // Reset featured index when filters change
  }, [selectedTags, projectData, searchTerm]);


  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Auto-rotate featured project
  useEffect(() => {
    if (filteredProjects.length > 1) {
      const interval = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % filteredProjects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [filteredProjects.length]);


  // Enhanced featured project navigation
  const nextProject = () => {
    setFeaturedIndex(prev => (prev + 1) % filteredProjects.length);
    if (isAutoRotating) {
      setIsAutoRotating(false);
      setTimeout(() => setIsAutoRotating(true), 10000);
    }
  };

  const prevProject = () => {
    setFeaturedIndex(prev => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    if (isAutoRotating) {
      setIsAutoRotating(false);
      setTimeout(() => setIsAutoRotating(true), 10000);
    }
  };

  // Auto-rotation with pause on hover
  useEffect(() => {
    let interval;
    if (filteredProjects.length > 1 && isAutoRotating) {
      interval = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % filteredProjects.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [filteredProjects.length, isAutoRotating]);



  return (
    <motion.div
      className="px-5 md:px-16 py-8 md:py-12"
      variants={staggerContainer()}
      initial="hidden"
      animate="show"
      exit="hidden">
       <div className="mx-auto max-w-[82rem]">
          <section className="relative mb-16">
          {/* Animated background elements */}
          <motion.div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#915EFF]/10"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 100 - 50],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          <div className="relative z-10">
            <motion.div variants={textVariant()} className="mb-12 text-center">
              <p className={`${styles.sectionSubText}`}>Explore my work</p>
              <h2 className={`${styles.sectionHeadText} mb-6`}>Project Gallery</h2>
              
              {/* Stats moved to hero section */}
              <motion.div
                ref={ref}
                variants={fadeIn("up", "spring", 0.5, 0.75)}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto"
              >
                {[
                  { value: projectData.length, label: "Projects", suffix: "+" },
                  { value: tags.length, label: "Technologies", suffix: "+" },
                  { value: 8, label: "Open Source", suffix: "+" },
                  { value: 100, label: "Passion", suffix: "%" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 bg-[#1e1e2f]/80 backdrop-blur-sm rounded-xl border border-[#915EFF]/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-[#915EFF] mb-1">
                      {inView ? <CountUp end={stat.value} duration={4} suffix={stat.suffix} /> : '0' + stat.suffix}
                    </div>
                    <div className="text-xs md:text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Featured Project Carousel - Moved to top */}
            <AnimatePresence mode="wait">
              {filteredProjects.length > 0 && (
                <motion.div
                  key={featuredIndex}
                  variants={fadeIn("up", "spring", 0.2, 1)}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="relative bg-gradient-to-br from-[#1e1e2f] to-[#2a2a3e] rounded-2xl overflow-hidden shadow-2xl border border-[#915EFF]/20"
                  onMouseEnter={() => setIsAutoRotating(false)}
                  onMouseLeave={() => setIsAutoRotating(true)}
                >
                  <div className='relative'>
                    <img
                      src={filteredProjects[featuredIndex].mainImage?.asset.url}
                      alt={filteredProjects[featuredIndex].title}
                      className="w-full h-64 sm:h-80 md:h-[450px] object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Featured badge with animation */}
                    <motion.div 
                      className="absolute top-6 left-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="bg-[#915EFF] text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
                        <FaHeart className="animate-pulse" size={12} />
                        Featured Project
                      </span>
                    </motion.div>

                    {/* Navigation arrows */}
                    {filteredProjects.length > 1 && (
                      <>
                        <button 
                          onClick={prevProject}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-[#915EFF] transition-colors z-10"
                          aria-label="Previous project"
                        >
                          <FaChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={nextProject}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-[#915EFF] transition-colors z-10"
                          aria-label="Next project"
                        >
                          <FaChevronRight size={20} />
                        </button>
                      </>
                    )}

                    {/* Project info overlay */}
                    <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end">
                      <motion.div
                        className="bg-gradient-to-t from-black/80 to-transparent p-6 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.h3
                          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {filteredProjects[featuredIndex].title}
                        </motion.h3>
                        <motion.p
                          className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed mb-4"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {filteredProjects[featuredIndex].description}
                        </motion.p>
                        <div className="flex flex-wrap gap-2">
                          {filteredProjects[featuredIndex].tags?.slice(0, 5).map((tag, index) => (
                            <motion.span
                              key={index}
                              className="text-[#915EFF] text-xs bg-[#915EFF]/10 border border-[#915EFF]/30 rounded-full px-3 py-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          
          </div>
        </section>
        
   {/* Header Section */}
      <motion.div variants={textVariant()}
        className="mb-10 text-center lg:text-left"
      >
        <p className={`${styles.sectionSubText} `}>Explore my work</p>
        <h2 className={`${styles.sectionHeadText}`}>Project Gallery</h2>
      </motion.div>

      {/* Controls Section */}
      <motion.div
        variants={fadeIn("down", "spring", 0.3, 0.75)}
        className='flex flex-col gap-4 mb-8'>

        {/* Search Bar - Full width on mobile */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
          <input
            type="text"
            placeholder="Search projects, technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-[#2e2e4d] text-white rounded-lg border border-[#915EFF]/20 focus:border-[#915EFF] focus:outline-none transition-colors text-sm md:text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Filter and View Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Filter Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <motion.button
              onClick={() => setShowDropdown(prev => !prev)}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-[#2e2e4d] text-white px-4 py-3 rounded-lg border border-[#915EFF]/20 hover:border-[#915EFF] transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaFilter />
              <span>Filter Technologies</span>
              {selectedTags.length > 0 && (
                <span className="bg-[#915EFF] text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {selectedTags.length}
                </span>
              )}
              <motion.div
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-auto sm:ml-2"
              >
                ▼
              </motion.div>
            </motion.button>

            {/* Enhanced Mobile-Friendly Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <>
                  {/* Mobile Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                    onClick={() => setShowDropdown(false)}
                  />

                  {/* Dropdown Content */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 sm:right-0 mt-2 bg-[#2e2e4d] rounded-lg shadow-2xl border border-[#915EFF]/30 z-50 
                         w-full sm:w-80 max-w-[calc(100vw-2rem)] sm:max-w-none"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#915EFF]/20">
                      <h3 className="text-white font-medium">Filter by Technology</h3>
                      <button
                        onClick={() => setShowDropdown(false)}
                        className="text-gray-400 hover:text-white transition-colors sm:hidden"
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    {/* Tags Container */}
                    <div className="p-4">
                      <div className="max-h-64 overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <div className="grid grid-cols-1 gap-2">
                          {tags.map((tag, index) => (
                            <motion.label
                              key={index}
                              className="flex items-center gap-3 p-3 hover:bg-[#915EFF]/10 rounded-lg transition-colors cursor-pointer group"
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                type="checkbox"
                                value={tag}
                                checked={selectedTags.includes(tag)}
                                onChange={() => toggleTag(tag)}
                                className="accent-[#915EFF] w-4 h-4 rounded focus:ring-2 focus:ring-[#915EFF]"
                              />
                              <span className="text-sm text-white group-hover:text-[#915EFF] transition-colors flex-1">
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                              </span>
                              {selectedTags.includes(tag) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-[#915EFF] rounded-full"
                                />
                              )}
                            </motion.label>
                          ))}
                        </div>
                      </div>

                      {/* Selected Tags Preview */}
                      {selectedTags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#915EFF]/20">
                          <p className="text-xs text-gray-400 mb-2">Selected ({selectedTags.length}):</p>
                          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                            {selectedTags.map((tag, index) => (
                              <motion.span
                                key={index}
                                className="text-[#915EFF] text-xs bg-[#915EFF]/20 px-2 py-1 rounded-full flex items-center gap-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                {tag}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleTag(tag);
                                  }}
                                  className="hover:text-white transition-colors"
                                >
                                  ×
                                </button>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-[#915EFF]/20">
                        <motion.button
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#6A5ACD] to-[#915EFF] rounded-lg hover:from-[#7B68EE] hover:to-[#915EFF] transition-all duration-300 shadow-lg hover:shadow-purple-600/40"
                          onClick={() => setShowDropdown(false)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Apply Filters
                        </motion.button>
                        <motion.button
                          className="px-4 py-2 text-sm font-medium text-gray-400 bg-transparent border border-gray-600 rounded-lg hover:text-white hover:border-gray-400 transition-all duration-300"
                          onClick={() => {
                            setSelectedTags([]);
                            setShowDropdown(false);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Clear
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Toggle - Enhanced for mobile */}
          <div className="flex bg-[#2e2e4d] rounded-lg overflow-hidden border border-[#915EFF]/20 w-full sm:w-auto">
            <motion.button
              onClick={() => setViewMode("grid")}
              className={`flex-1 sm:flex-none px-4 py-3 transition-colors flex items-center justify-center gap-2 text-sm font-medium ${viewMode === "grid"
                ? "bg-[#915EFF] text-white shadow-lg"
                : "text-white hover:bg-[#915EFF]/20"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title='Grid'
            >
              <FiGrid />
              <span >Grid</span>
            </motion.button>
            <motion.button
              onClick={() => setViewMode("list")}
              className={`flex-1 sm:flex-none px-4 py-3 transition-colors flex items-center justify-center gap-2 text-sm font-medium ${viewMode === "list"
                ? "bg-[#915EFF] text-white shadow-lg"
                : "text-white hover:bg-[#915EFF]/20"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title='List'
            >
              <FiList />
              <span >List</span>
            </motion.button>
          </div>
        </div>

        {/* Active Filters Display */}
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 p-4 bg-[#1e1e2f] rounded-lg border border-[#915EFF]/20"
          >
            <span className="text-sm text-gray-400 mr-2">Active filters:</span>
            {selectedTags.map((tag, index) => (
              <motion.span
                key={index}
                className="text-[#915EFF] text-xs bg-[#915EFF]/20 border border-[#915EFF]/30 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-[#915EFF]/30 transition-colors"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                #{tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-white transition-colors text-[#915EFF]/70"
                >
                  ×
                </button>
              </motion.span>
            ))}
            <motion.button
              onClick={() => setSelectedTags([])}
              className="text-xs text-gray-400 hover:text-white transition-colors underline ml-2"
              whileHover={{ scale: 1.05 }}
            >
              Clear all
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Featured Project Section */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 && (
          <motion.div
            key={featuredIndex}
            variants={fadeIn("up", "spring", 0.2, 1)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="mb-10 sm:mb-16 relative bg-gradient-to-br from-[#1e1e2f] to-[#2a2a3e] rounded-2xl overflow-hidden shadow-2xl border border-[#915EFF]/20"
          >
            <div className='relative'>
              <img
                src={filteredProjects[featuredIndex].mainImage?.asset.url}
                alt={filteredProjects[featuredIndex].title}
                className="w-full h-64 sm:h-80 md:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Featured badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-[#915EFF] text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
                  <FaHeart size={12} />
                  Featured Project
                </span>
              </div>

              {/* Navigation dots */}
              {filteredProjects.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:transform-none flex gap-2">
                  {filteredProjects.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setFeaturedIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${index === featuredIndex ? 'bg-[#915EFF]' : 'bg-white/30'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className=" hidden absolute inset-0 p-4 sm:p-6 md:p-12 md:flex flex-col justify-end">
              <motion.h3
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {filteredProjects[featuredIndex].title}
              </motion.h3>
              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {filteredProjects[featuredIndex].description}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid/List */}
      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <motion.div
            variants={fadeIn("up", "spring", 0.1, 0.75)}
            className="text-center py-20"
          >
            <h3 className="text-2xl text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6"> Try adjusting your search or filter criteria</p>
            <button
              onClick={() => { setSelectedTags([]); setSearchTerm(''); }}
              className="bg-[#915EFF] text-white px-6 py-3 rounded-lg hover:bg-[#7c4dff] transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div
            key={viewMode}
            variants={staggerContainer()}
            initial="hidden"
            animate="show"
            className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              : "space-y-8"
            }
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={`project-${index}`}
                {...project}
                isListView={viewMode === 'list'}
                index={index}
              />
            ))}
          </div>
        )}
      </AnimatePresence>


      {/* Stats Section */}
      <motion.div
        ref={ref}
        variants={fadeIn("up", "spring", 0.5, 0.75)}
        className="mt-16 bg-[#1e1e2f] rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-4xl font-bold text-[#915EFF] mb-2">
            {inView ? <CountUp end={projectData.length} duration={4} suffix="+" /> : '0+'}
          </div>
          <div className="text-secondary">Projects</div>
        </motion.div>
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-4xl font-bold text-[#915EFF] mb-2">
            {inView ? <CountUp end={tags.length} duration={4} suffix="+" /> : '0+'}
          </div>
          <div className="text-secondary">Technologies</div>
        </motion.div>
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-4xl font-bold text-[#915EFF] mb-2">
            {inView ? <CountUp end={8} duration={4} suffix="+" /> : '0+'}
          </div>
          <div className="text-secondary">Open Source</div>
        </motion.div>
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-4xl font-bold text-[#915EFF] mb-2">
            {inView ? <CountUp end={100} duration={4} suffix="%" /> : '0%'}
          </div>
          <div className="text-secondary">Passion</div>
        </motion.div>
      </motion.div>
  </div>

      
    </motion.div>
  )
}

export default Projects
