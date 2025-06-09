import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { games } from './Constants';
import { FaGamepad } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import SnakeGame from './SnakeGame';
import MemoryGame from './MemoryGame';
import RockPaperScissors from './pages/RockPaperScissors';
import CodeTypingChallenge from './CodeTypingChallenge';


const GameDetail = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });


  // Find the game by ID
  const game = games.find(g => g.id === parseInt(gameId));

  // If game not found, redirect back
  useEffect(() => {
    if (!game) {
      navigate('/games');
    }
  }, [game, navigate]);

  if (!game) return null;

  const openGameModal = () => {
    setSelectedGame(game);
  };

  const closeGameModal = () => {
    setSelectedGame(null);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const onPlay = (game) => {
    setSelectedGame(game);
    setIsFullscreen(false);
  };


  return (
    <>
      <motion.section
        ref={ref}
        className="relative pt-12 pb-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#915EFF]/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-emerald-400/15 to-[#915EFF]/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#915EFF]/5 via-transparent to-transparent rounded-full" />
        </div>

        {/* Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
          <motion.button
            onClick={() => navigate('/games')}
            className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 text-lg font-medium"
            initial={{ x: -30, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            whileHover={{ x: -5 }}
          >
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:border-[#915EFF]/50 group-hover:bg-[#915EFF]/10 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <FiChevronLeft className="w-5 h-5" />
            </motion.div>
            <span className="group-hover:text-[#915EFF] transition-colors">Back to Games</span>
          </motion.button>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Column - Game Info */}
            <div className="space-y-8 ">
              {/* Game Title & Icon */}
              <motion.div
                className="flex items-center gap-6"
                initial={{ x: -50, opacity: 0 }}
                animate={inView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
              >
                <div className="text-6xl p-4 bg-gradient-to-br from-[#915EFF]/20 to-emerald-400/20 rounded-2xl border border-white/10">
                  {game.icon || '🎮'}
                </div>
                <div>
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-emerald-400 to-[#915EFF] bg-clip-text text-transparent leading-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.4 }}
                  >
                    {game.title}
                  </motion.h1>
                  <motion.div
                    className="flex items-center gap-2 mt-2"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="px-3 py-1 text-sm bg-[#915EFF]/20 text-[#915EFF] rounded-full border border-[#915EFF]/30">
                      {game.difficulty}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={inView ? { opacity: i < game.rating ? 1 : 0.3, scale: 1 } : {}}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        >
                          ⭐
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-xl text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                {game.description}
              </motion.p>

              <motion.div
                className="mt-6 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                <h4 className="text-lg font-semibold text-white mb-3">Game Features</h4>
                <ul className="space-y-3">
                  {[
                    "Engaging storyline with multiple endings",
                    "Leaderboard with global rankings",
                    "Achievements and unlockable content",
                    "Responsive controls for all devices",
                    "Regular updates with new challenges"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-[#915EFF] mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-lg font-semibold text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {game.tech.map((tech, i) => (
                    <motion.span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-[#2e2e4d] to-[#3e3e5d] text-gray-300 rounded-full border border-white/10 hover:border-[#915EFF]/30 transition-all duration-300 hover:text-white"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Game Preview */}
            <motion.div
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#915EFF] via-emerald-400 to-[#915EFF] rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                {/* Image Container */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-2 border border-white/20 backdrop-blur-sm overflow-hidden">
                  <motion.img
                    src={game.image}
                    alt={game.title}
                    className="w-full aspect-video object-cover rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Play Overlay */}
                  <motion.div
                    className="absolute inset-2 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onPlay(game)}
                  >
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-[#915EFF] rounded-full flex items-center justify-center shadow-2xl"
                      whileHover={{ scale: 1.1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#915EFF] to-emerald-400 rounded-2xl flex items-center justify-center text-2xl rotate-12 shadow-2xl"
                  animate={{
                    rotate: [12, 18, 12],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                >
                  {game.icon}
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <div className="group relative p-6 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-[#915EFF]/30 transition-all duration-300 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <div className="relative">
                      <div className="text-2xl mb-2">⏱️</div>
                      <div className="text-sm text-gray-400 mb-1">Play Time</div>
                      <div className="text-lg font-bold text-emerald-400">{game.playTime}</div>
                    </div>
                  </div>

                  <div className="group relative p-6 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <div className="relative">
                      <div className="text-2xl mb-2">🏆</div>
                      <div className="text-sm text-gray-400 mb-1">Rating</div>
                      <div className="text-lg font-bold text-emerald-400">{game.rating}/5</div>
                    </div>
                  </div>

                  <div className="group relative p-6 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-[#915EFF]/30 transition-all duration-300 backdrop-blur-sm col-span-2 md:col-span-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    <div className="relative">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-sm text-gray-400 mb-1">Category</div>
                      <div className="text-lg font-bold text-emerald-400 capitalize">{game.category}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Play Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    className="group relative px-12 py-4 bg-gradient-to-r from-emerald-400 to-[#915EFF] text-white font-bold text-lg rounded-2xl shadow-2xl overflow-hidden mt-6"
                    onClick={() => onPlay(game)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-[#a16fff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      <FaGamepad className="text-xl" />
                      <span>Play {game.title}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.div>
                    </div>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400/20 to-[#915EFF]/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGameModal}
          >
            <motion.div
              className={`bg-black rounded-xl shadow-2xl border border-[#915EFF]/30 overflow-hidden ${isFullscreen ? 'w-screen h-screen' : 'w-full max-w-4xl max-h-[90vh]'}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-full">
                {/* Close and fullscreen buttons */}
                <button
                  className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
                </button>
                <button
                  className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors"
                  onClick={closeGameModal}
                >
                  <FiX size={20} />
                </button>

                {/* Render the actual game */}
                {selectedGame.id === 1 ? (
                  <div className="h-full overflow-auto">
                    <SnakeGame />
                  </div>
                ) : selectedGame.id === 2 ? (
                  <div className='h-full  bg-[#0e0e15] overflow-auto p-4'>
                    <CodeTypingChallenge />
                  </div>
                ) : selectedGame.id === 3 ? (
                  <div className="h-full bg-[#0D1117] overflow-auto p-4">
                    <RockPaperScissors />
                  </div>
                ) : selectedGame.id === 4 ? (
                  <div className="h-full bg-[#1e1e2f] overflow-auto p-4">
                    <MemoryGame />
                  </div>
                ) : (
                  <div className="w-full h-64 md:h-96 bg-black flex items-center justify-center">
                    <div className="text-white text-center">
                      <FaGamepad className="text-5xl mx-auto mb-4 text-[#915EFF]" />
                      <h3 className="text-2xl font-bold">{selectedGame.title}</h3>
                      <p className="text-gray-400 mt-2">Game would load here in a real implementation</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameDetail;