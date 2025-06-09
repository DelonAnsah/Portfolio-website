import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaHome } from 'react-icons/fa';
import {
  IoMdSettings,
  IoMdRefresh,
  IoMdPlay,
} from 'react-icons/io';
import {
  MdTimer,
  MdReplay,
  MdStars
} from 'react-icons/md';
import { FiX } from 'react-icons/fi';

const MemoryGame = ({ onClose }) => {
  // Game state
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [theme, setTheme] = useState('tech');
  const [showSettings, setShowSettings] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('memoryGameBestScore');
    return saved ? JSON.parse(saved) : { moves: null, time: null };
  });

  // Card themes
  const cardThemes = {
    tech: ['⚛️', '📱', '💻', '🖥️', '⚙️', '🔧', '💾', '🖨️', '📡', '🔌', '💡', '🔋'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯', '🦁', '🐸', '🐵'],
    food: ['🍎', '🍌', '🍊', '🍋', '🍉', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍'],
    space: ['🚀', '🛸', '🌟', '⭐', '🌙', '🪐', '🌍', '🌕', '☄️', '🛰️', '👽', '🌌']
  };

  const difficultySettings = {
    easy: { pairs: 6, cols: 3 },
    medium: { pairs: 8, cols: 4 },
    hard: { pairs: 12, cols: 4 }
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const { pairs } = difficultySettings[difficulty];
    const selectedIcons = cardThemes[theme].slice(0, pairs);
    const gameCards = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false
      }));

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(0);
    setGameCompleted(false);
    setGameStarted(false);
    setIsTimerRunning(false);
  }, [difficulty, theme]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setIsTimerRunning(true);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameStarted, gameCompleted]);

  // Handle card click
  const handleCardClick = (cardId) => {
    if (!gameStarted) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (matchedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCard, secondCard] = newFlippedCards;
      const firstCardData = cards.find(card => card.id === firstCard);
      const secondCardData = cards.find(card => card.id === secondCard);

      if (firstCardData.icon === secondCardData.icon) {
        // Match found
        setMatchedCards([...matchedCards, firstCard, secondCard]);
        setFlippedCards([]);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check game completion
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameCompleted(true);
      setIsTimerRunning(false);

      // Update best score
      const currentScore = { moves, time: timer };
      if (!bestScore.moves || moves < bestScore.moves ||
        (moves === bestScore.moves && timer < bestScore.time)) {
        setBestScore(currentScore);
        localStorage.setItem('memoryGameBestScore', JSON.stringify(currentScore));
      }
    }
  }, [matchedCards, cards.length, moves, timer, bestScore]);

  // Initialize game on component mount and settings change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    flip: {
      rotateY: 180,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="h-full overflow-auto flex flex-col p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Header Section */}
        <motion.div
          className="mb-6 md:mb-10 text-center"
          variants={containerVariants}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Memory Game</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-lg">
            Challenge your memory and have fun! Flip cards to find matching pairs and test your skills.
          </p>
        </motion.div>

        {/* Game Stats Bar */}
        <motion.div
          className="bg-[#1e1e2f] border border-[#915EFF]/20 rounded-xl md:rounded-2xl p-3 md:p-6 mb-6 md:mb-8"
          variants={containerVariants}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-wrap items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2">
                <MdTimer className="text-[#915EFF]" size={18} />
                <span className="text-white font-mono text-sm md:text-lg">{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdReplay className="text-[#915EFF]" size={18} />
                <span className="text-white font-mono text-sm md:text-lg">{moves} moves</span>
              </div>
              {bestScore.moves && (
                <div className="hidden sm:flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" size={18} />
                  <span className="text-yellow-500 font-mono text-xs md:text-sm">
                    Best: {bestScore.moves} moves in {formatTime(bestScore.time)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 md:p-3 bg-[#2e2e4d] text-white rounded-lg border border-[#915EFF]/20 hover:border-[#915EFF] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoMdSettings size={16} className="md:size-[18px]" />
              </motion.button>
              <motion.button
                onClick={initializeGame}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 bg-[#915EFF] text-white rounded-lg hover:bg-[#7c4dff] transition-colors font-medium text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoMdRefresh size={16} className="md:size-[18px]" />
                <span className="hidden sm:inline">New Game</span>
              </motion.button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#915EFF]/20"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-2 text-sm md:text-base bg-[#2e2e4d] text-white rounded-lg border border-[#915EFF]/20 focus:border-[#915EFF] focus:outline-none"
                    >
                      <option value="easy">Easy (6 pairs)</option>
                      <option value="medium">Medium (8 pairs)</option>
                      <option value="hard">Hard (12 pairs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full p-2 text-sm md:text-base bg-[#2e2e4d] text-white rounded-lg border border-[#915EFF]/20 focus:border-[#915EFF] focus:outline-none"
                    >
                      <option value="tech">Tech Icons</option>
                      <option value="animals">Animals</option>
                      <option value="food">Food</option>
                      <option value="space">Space</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Game Board */}
        <motion.div
          className="relative"
          variants={containerVariants}
        >
          {!gameStarted && (
            <motion.div
              className="absolute inset-0 bg-[#1e1e2f]/95 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.button
                onClick={startGame}
                className="flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#915EFF] to-[#7c4dff] text-white rounded-lg md:rounded-xl text-lg md:text-xl font-bold hover:from-[#7c4dff] hover:to-[#915EFF] transition-all duration-300 shadow-lg hover:shadow-purple-600/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoMdPlay size={18} className="md:size-[20px]" />
                Start Game
              </motion.button>
            </motion.div>
          )}

          <div
            className={`grid gap-2 md:gap-4 p-3 md:p-6 bg-[#1e1e2f] border border-[#915EFF]/20 rounded-xl md:rounded-2xl`}
            style={{
              gridTemplateColumns: `repeat(${difficultySettings[difficulty].cols}, 1fr)`
            }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className="relative aspect-square cursor-pointer"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card.id)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{
                    rotateY: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 180 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Card Back */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-[#915EFF] to-[#7c4dff] rounded-lg md:rounded-xl flex items-center justify-center shadow-lg border border-[#915EFF]/30">
                    <div className="text-white text-3xl md:text-4xl">?</div>
                  </div>

                  {/* Card Front */}
                  <div
                    className={`absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-[#2e2e4d] to-[#3e3e5d] rounded-lg md:rounded-xl flex items-center justify-center shadow-lg border-2 ${matchedCards.includes(card.id)
                      ? 'border-green-500 from-green-500/20 to-green-600/20'
                      : 'border-[#915EFF]/30'
                      }`}
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div className="text-3xl md:text-4xl lg:text-5xl">{card.icon}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game Completion Modal */}
        <AnimatePresence>
          {gameCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#2e2e4d] rounded-xl md:rounded-2xl shadow-2xl border border-[#915EFF]/30 p-6 md:p-8 max-w-md w-full text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="text-5xl md:text-6xl mb-4"
                >
                  🎉
                </motion.div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Congratulations!</h3>
                <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                  You completed the game in <span className="text-[#915EFF] font-bold">{moves} moves</span> and <span className="text-[#915EFF] font-bold">{formatTime(timer)}</span>!
                </p>

                {(moves === bestScore.moves && timer === bestScore.time) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2 mb-3 md:mb-4 text-yellow-500 text-sm md:text-base"
                  >
                    <MdStars size={18} className="md:size-[20px]" />
                    <span className="font-bold">New Best Score!</span>
                  </motion.div>
                )}

                <div className="flex gap-2 md:gap-3">
                  <motion.button
                    onClick={initializeGame}
                    className="flex-1 px-4 py-2 md:py-3 bg-[#915EFF] text-white rounded-lg hover:bg-[#7c4dff] transition-colors font-medium text-sm md:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Play Again
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </motion.div>
  )
}

export default MemoryGame