import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { styles } from '../../styles';
import { fadeIn, textVariant, staggerContainer } from '../../Utils/motion';
import { client } from '../../client';
import { FaExternalLinkAlt, FaFilter, FaHeart } from 'react-icons/fa';
import { FiGrid, FiList, FiSearch, FiX } from 'react-icons/fi';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Projects = () => {
  const [projectData, setProjectData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('viewMode') || 'grid';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Intersection Observer hook for Stats section
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const ProjectCard = ({ title, description, link, tags, mainImage, isListView, index }) => {
    return (
      <motion.div
        className={`bg-[#1e1e2f] rounded-2xl shadow-xl overflow-hidden border border-[#915EFF]/20 hover:border-[#915EFF]/50 transition-all duration-300 hover:-translate-y-2 group ${isListView ? "flex flex-col sm:flex-row" : ""}`}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 25px -5px rgba(145, 94, 255, 0.2)"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15
        }}
      >
        <div className={`relative overflow-hidden ${isListView ? "sm:w-1/3 lg:w-1/4 " : "w-full"}`}>
          {mainImage && mainImage.asset?.url && (
            <div>
              <img
                src={mainImage.asset.url}
                alt={title}
                 loading="lazy"
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isListView ? 'h-48 sm:h-full' : 'h-64'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </div>

        <div className={`p-4 lg:p-6 flex flex-col justify-between ${isListView ? "sm:w-2/3 lg:w-3/4" : ""}`}>
          <div>
            <div className="flex justify-between items-start mb-3">
              <motion.h3
                className={`font-bold text-white group-hover:text-[#915EFF] transition-colors duration-300 ${isListView ? 'text-lg sm:text-xl md:text-2xl' : 'text-lg sm:text-xl'}`}
                whileHover={{ x: 5 }}
              >
                {title}
              </motion.h3>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#915EFF] bg-[#915EFF]/80 hover:bg-white transition-all duration-300 px-3 py-1 rounded-lg text-xs sm:text-sm flex items-center gap-1 group"
                aria-label="Live demo"
              >
                <span className="hidden sm:inline">Live Demo</span>
                <span className="inline sm:hidden">Demo</span>
                <FaExternalLinkAlt size={12} />
              </a>
            </div>
            <p className={`text-gray-300 leading-relaxed mb-4 ${isListView ? 'text-sm sm:text-base line-clamp-2 sm:line-clamp-3' : 'text-sm line-clamp-3'}`}>
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tags?.slice(0, isListView ? (window.innerWidth < 640 ? 4 : 6) : 6).map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                className={`text-[#915EFF] font-medium bg-[#915EFF]/10 border border-[#915EFF]/30 rounded-full hover:bg-[#915EFF]/20 transition-colors cursor-pointer ${isListView ? 'text-xs px-2 py-1' : 'text-xs px-3 py-1'}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => !selectedTags.includes(tag) && toggleTag(tag)}
              >
                #{tag}
              </motion.span>
            ))}
            {tags?.length > (isListView ? (window.innerWidth < 640 ? 4 : 6) : 6) && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{tags.length - (isListView ? (window.innerWidth < 640 ? 4 : 6) : 6)} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Skeleton Loader Components
  const FeaturedProjectSkeleton = () => (
    <div className="mb-10 sm:mb-16 relative bg-gradient-to-br from-[#1e1e2f] to-[#2a2a3e] rounded-2xl overflow-hidden shadow-2xl border border-[#915EFF]/20">
      <div className="w-full h-64 sm:h-80 md:h-[400px] bg-[#2e2e4d] animate-pulse"></div>
    </div>
  );

  const ProjectCardSkeleton = ({ isListView }) => (
    <div className={`bg-[#1e1e2f] rounded-2xl shadow-xl overflow-hidden border border-[#915EFF]/20 ${isListView ? "flex flex-col md:flex-row" : ""}`}>
      <div className={`relative overflow-hidden ${isListView ? "md:w-1/3" : "w-full"}`}>
        <div className={`w-full bg-[#2e2e4d] animate-pulse ${isListView ? 'h-52 lg:h-auto' : 'h-64'}`}></div>
      </div>
      <div className={`p-4 lg:p-6 flex flex-col justify-between ${isListView ? "md:w-2/3" : ""}`}>
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="h-6 w-3/4 bg-[#2e2e4d] rounded animate-pulse"></div>
            <div className="h-5 w-5 bg-[#2e2e4d] rounded animate-pulse"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-[#2e2e4d] rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-[#2e2e4d] rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-[#2e2e4d] rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-16 bg-[#2e2e4d] rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="mt-12 bg-[#1e1e2f] border border-[#915EFF]/20 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="text-center">
          <div className="text-4xl font-bold text-[#2e2e4d] mb-2 h-10 bg-[#2e2e4d] rounded animate-pulse"></div>
          <div className="h-4 w-3/4 mx-auto bg-[#2e2e4d] rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    setIsLoading(true);
    client.fetch(`*[_type == 'project']{
      title,
      description,
      link,
      tags,
      priority,
      mainImage {
        asset->{
      _id,
      url
    },
      }
      }`)
      .then((data) => {
        const sortedData = [...data].sort((a, b) => a.priority - b.priority);
        setProjectData(sortedData);
        setFilteredProjects(sortedData);
        const allTags = new Set(data.flatMap(project => project.tags));
        setTags(Array.from(allTags).sort());
        setIsLoading(false);
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    let filtered = projectData;

    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.every(tag => project.tags.includes(tag))
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
    setFeaturedIndex(0);
  }, [selectedTags, projectData, searchTerm]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  useEffect(() => {
    if (filteredProjects.length > 1) {
      const interval = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % filteredProjects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [filteredProjects.length]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };


  return (
    <motion.div
      className="px-5 md:px-16 py-8 md:py-12"
      variants={staggerContainer()}
      initial="hidden"
      animate="show"
      exit="hidden">
      <div className="mx-auto max-w-[82rem]">
        {/* Header Section */}
        <motion.div variants={textVariant()}
          className="mb-10 text-center lg:text-left"
        >
          <p className={`${styles.sectionSubText} `}>Explore my work</p>
          <h2 className={`${styles.sectionHeadText}`}>Project Gallery</h2>
        </motion.div>

        {/* Featured Project Section */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <FeaturedProjectSkeleton />
          ) : filteredProjects.length > 0 ? (
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

                <div className="absolute top-6 left-6">
                  <span className="bg-[#915EFF] text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
                    <FaHeart size={12} />
                    Featured Project
                  </span>
                </div>

                {filteredProjects.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:transform-none flex gap-2">
                    {filteredProjects.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setFeaturedIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === featuredIndex ? 'bg-[#915EFF]' : 'bg-white/30'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden absolute inset-0 p-4 sm:p-6 md:p-12 md:flex flex-col justify-end">
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
          ) : null}
        </AnimatePresence>

        {/* Optimized Horizontal Toolbar */}
        <motion.div
          variants={fadeIn("down", "spring", 0.3, 0.75)}
          className='mb-8'>

          {/* Single Horizontal Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">

            {/* Search Bar - Takes most space on desktop */}
            <div className="relative flex-1 md:max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={18} />
              <input
                type="text"
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[#2e2e4d] text-white rounded-lg border border-[#915EFF]/20 focus:border-[#915EFF] focus:outline-none transition-colors text-sm"
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

            {/* Controls Group */}
            <div className="flex gap-2 md:gap-3 flex-shrink-0">
              {/* Filter Button */}
              <motion.button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center justify-center gap-2 bg-[#2e2e4d] text-white px-4 py-3 rounded-lg border border-[#915EFF]/20 hover:border-[#915EFF] transition-colors text-sm font-medium min-w-[120px] md:min-w-[140px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <FaFilter size={14} />
                <span>Filter</span>
                {selectedTags.length > 0 && (
                  <span className="bg-[#915EFF] text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {selectedTags.length}
                  </span>
                )}
              </motion.button>

              {/* View Mode Toggle */}
              <div className="flex bg-[#2e2e4d] rounded-xl overflow-hidden border border-[#915EFF]/30 shadow-lg">
                <motion.button
                  onClick={() => handleViewModeChange("grid")}
                  className={`px-6 py-3 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium relative`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  {viewMode === "grid" && (
                    <motion.span
                      layoutId="viewModeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#915EFF] to-[#7c4dff] rounded-lg"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <FiGrid />
                    Grid
                  </span>
                </motion.button>
                <motion.button
                  onClick={() => handleViewModeChange("list")}
                  className={`px-6 py-3 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium relative`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  {viewMode === "list" && (
                    <motion.span
                      layoutId="viewModeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#915EFF] to-[#7c4dff] rounded-lg"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <FiList />
                    List
                  </span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Active Filters Display - Only show when filters are active */}
          <AnimatePresence>
            {selectedTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex flex-wrap gap-2 p-3 bg-[#1e1e2f] rounded-lg border border-[#915EFF]/20"
              >
                <span className="text-sm text-gray-400 mr-1">Filters:</span>
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
          </AnimatePresence>
        </motion.div>

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilterModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={() => setShowFilterModal(false)}
              >
                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-[#2e2e4d] rounded-xl shadow-2xl border border-[#915EFF]/30 w-full max-w-md max-h-[80vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-[#915EFF]/20">
                    <h3 className="text-white font-semibold text-lg">Filter Technologies</h3>
                    <motion.button
                      onClick={() => setShowFilterModal(false)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiX size={20} />
                    </motion.button>
                  </div>

                  {/* Tags Container */}
                  <div className="p-6">
                    <div className="max-h-60 overflow-y-auto overflow-x-hidden custom-scrollbar">
                      {isLoading ? (
                        <div className="space-y-2">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-12 bg-[#1e1e2f] rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
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
                      )}
                    </div>

                    {/* Selected Tags Preview */}
                    {selectedTags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#915EFF]/20">
                        <p className="text-xs text-gray-400 mb-3">Selected ({selectedTags.length}):</p>
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
                    <div className="flex gap-3 mt-6 pt-4 border-t border-[#915EFF]/20">
                      <motion.button
                        className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#6A5ACD] to-[#915EFF] rounded-lg hover:from-[#7B68EE] hover:to-[#915EFF] transition-all duration-300 shadow-lg hover:shadow-purple-600/40"
                        onClick={() => setShowFilterModal(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Apply Filters
                      </motion.button>
                      <motion.button
                        className="px-4 py-3 text-sm font-medium text-gray-400 bg-transparent border border-gray-600 rounded-lg hover:text-white hover:border-gray-400 transition-all duration-300"
                        onClick={() => {
                          setSelectedTags([]);
                          setShowFilterModal(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Clear All
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                : "space-y-8"
              }
            >
              {[...Array(6)].map((_, index) => (
                <ProjectCardSkeleton key={index} isListView={viewMode === 'list'} />
              ))}
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              variants={fadeIn("up", "spring", 0.1, 0.75)}
              className="text-center py-20"
            >
              <motion.div
                className="mx-auto mb-6 w-48 h-48 relative"
                animate={{
                  rotate: [0, 5, -5, 0],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    fill="#915EFF"
                    d="M50,-50C62.3,-36.8,68.1,-18.4,66.7,-1.3C65.3,15.8,56.7,31.6,44.4,43.4C32,55.2,16,63,-2.5,65.5C-21,68,-42,65.1,-56.2,53.3C-70.4,41.5,-77.8,20.7,-76.3,1.1C-74.8,-18.5,-64.4,-37,-50.2,-50.2C-36,-63.4,-18,-71.2,0.7,-71.9C19.4,-72.6,38.8,-66.2,50,-50Z"
                    transform="translate(100 100)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiSearch className="text-white" size={50} />
                </div>
              </motion.div>

              <h3 className="text-2xl text-white mb-2 font-bold">No projects found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any projects matching your criteria. Try adjusting your search or filter settings.</p>
              <button
                onClick={() => { setSelectedTags([]); setSearchTerm(''); }}
                className="bg-[#915EFF] text-white px-6 py-3 rounded-lg hover:bg-[#7c4dff] transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                : "space-y-8"
              }
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={`project-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <ProjectCard
                    {...project}
                    isListView={viewMode === 'list'}
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <motion.div
            ref={ref}
            variants={fadeIn("up", "spring", 0.5, 0.75)}
            className="mt-12 bg-[#1e1e2f] border border-[#915EFF]/20 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
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
        )}
      </div>
    </motion.div>
  )
}

export default Projects