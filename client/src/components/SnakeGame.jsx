import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Responsive grid size based on screen width
const getGridSize = () => {
  if (typeof window === 'undefined') return 20;
  if (window.innerWidth < 400) return 15;
  if (window.innerWidth < 600) return 18;
  return 20;
};

const getCellSize = () => {
  if (typeof window === 'undefined') return 20;
  if (window.innerWidth < 400) return 20;
  if (window.innerWidth < 600) return 20;
  return 20;
};

const INITIAL_SNAKE = [{ x: 5, y: 5 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_FOOD = { x: 10, y: 10 };

const saveToLeaderboard = async (name, score) => {
  const leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
  leaderboard.push({ name, score, date: new Date().toISOString() });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard.slice(0, 10)));
  return leaderboard.slice(0, 10);
};

const getLeaderboard = () => {
  return JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
};

const SnakeGame = () => {
  const [gridSize, setGridSize] = useState(getGridSize());
  const [cellSize, setCellSize] = useState(getCellSize());
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [particles, setParticles] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const gameLoopRef = useRef();
  const directionRef = useRef(direction);
  const containerRef = useRef();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setGridSize(getGridSize());
      setCellSize(getCellSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load high score and leaderboard from memory
  useEffect(() => {
    const savedHighScore = parseInt(sessionStorage.getItem('snakeHighScore') || '0');
    setHighScore(savedHighScore);
    setLeaderboard(getLeaderboard());
  }, []);

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Generate random food position
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [gridSize]);

  // Create particle effect
  const createParticles = useCallback((x, y, color = '#915EFF') => {
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Math.random(),
        x: x * cellSize + cellSize/2,
        y: y * cellSize + cellSize/2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, [cellSize]);

  // Update particles
  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticles(prev =>
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      );
    }, 16);

    return () => {
      clearInterval(particleInterval);
      setParticles([]);
    };
  }, []);

  const handleGameOver = () => {
    setGameOver(true);
    if (score > 0) {
      setShowNameInput(true);
    }
  };

  // Game loop
  const gameLoop = useCallback(() => {
    setSnake(currentSnake => {
      if (gameOver || isPaused || !gameStarted) return currentSnake;

      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      const currentDirection = directionRef.current;

      // Move head
      head.x += currentDirection.x;
      head.y += currentDirection.y;

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        handleGameOver();
        return currentSnake;
      }

      // Check self-collision (skip head)
      if (newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        setFood(generateFood(newSnake));
        createParticles(head.x, head.y, '#00ff88');
        setSpeed(prev => Math.max(80, prev - 2));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, gameStarted, score, highScore, generateFood, createParticles, gridSize]);

  // Start game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const loop = () => {
      gameLoop();
      gameLoopRef.current = setTimeout(loop, speed);
    };

    gameLoopRef.current = setTimeout(loop, speed);
    return () => clearTimeout(gameLoopRef.current);
  }, [gameLoop, gameStarted, gameOver, isPaused, speed]);

  useEffect(() => {
    return () => {
      clearTimeout(gameLoopRef.current);
      setParticles([]);
    };
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  // Touch controls
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !gameStarted) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchStart.x - touchEnd.x;
    const dy = touchStart.y - touchEnd.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
      else if (dx < 0 && directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
    } else {
      if (dy > 0 && directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
      else if (dy < 0 && directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
    }
  };

  const startGame = () => {
    const initialSnake = [{ x: Math.floor(gridSize/2), y: Math.floor(gridSize/2) }];
    setSnake(initialSnake);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(initialSnake));
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    setIsPaused(false);
    setSpeed(150);
    setParticles([]);
    directionRef.current = INITIAL_DIRECTION;
  };

  const submitScore = async () => {
    if (!playerName.trim()) return;
    const updatedLeaderboard = await saveToLeaderboard(playerName.trim(), score);
    setLeaderboard(updatedLeaderboard);
    setShowNameInput(false);
    setPlayerName('');
  };

  const resetGame = () => {
    setGameStarted(false);
    const initialSnake = [{ x: Math.floor(gridSize/2), y: Math.floor(gridSize/2) }];
    setSnake(initialSnake);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(initialSnake));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setSpeed(150);
    setParticles([]);
    directionRef.current = INITIAL_DIRECTION;
  };

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className=" h-auto w-full bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 overflow-auto"
    >
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 md:mb-8"
        >
          <div className="flex justify-center gap-4 md:gap-8 text-white">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-[#915EFF]">{score}</div>
              <div className="text-xs md:text-sm text-gray-400">SCORE</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-[#00ff88]">{highScore}</div>
              <div className="text-xs md:text-sm text-gray-400">HIGH SCORE</div>
            </div>
          </div>
        </motion.div>

        {/* Game Container */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mx-auto"
            ref={containerRef}
            style={{ 
              width: gridSize * cellSize, 
              height: gridSize * cellSize,
              maxWidth: '100%'
            }}
          >
            {/* Game Board */}
            <div
              className="relative bg-black/50 border-2 border-[#915EFF]/50 rounded-lg overflow-hidden backdrop-blur-sm"
              style={{
                width: '100%',
                height: '100%',
                boxShadow: '0 0 50px rgba(145, 94, 255, 0.3)'
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: gridSize }).map((_, y) =>
                  Array.from({ length: gridSize }).map((_, x) => (
                    <div
                      key={`${x}-${y}`}
                      className="absolute border-r border-b border-[#915EFF]/20"
                      style={{
                        left: x * cellSize,
                        top: y * cellSize,
                        width: cellSize,
                        height: cellSize
                      }}
                    />
                  ))
                )}
              </div>

              {/* Snake */}
              <AnimatePresence>
                {snake.map((segment, index) => (
                  <motion.div
                    key={`${segment.x}-${segment.y}-${index}`}
                    className={`absolute rounded-sm ${index === 0
                      ? 'bg-gradient-to-br from-[#915EFF] to-[#7c4dff]'
                      : 'bg-gradient-to-br from-[#915EFF]/80 to-[#7c4dff]/80'
                      }`}
                    style={{
                      left: segment.x * cellSize + 1,
                      top: segment.y * cellSize + 1,
                      width: cellSize - 2,
                      height: cellSize - 2,
                      boxShadow: index === 0
                        ? '0 0 20px rgba(145, 94, 255, 0.8)'
                        : '0 0 10px rgba(145, 94, 255, 0.4)'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                ))}
              </AnimatePresence>

              {/* Food */}
              <motion.div
                className="absolute bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-full"
                style={{
                  left: food.x * cellSize + 2,
                  top: food.y * cellSize + 2,
                  width: cellSize - 4,
                  height: cellSize - 4,
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.8)'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Particles */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute w-1 h-1 rounded-full pointer-events-none"
                  style={{
                    left: particle.x,
                    top: particle.y,
                    backgroundColor: particle.color,
                    opacity: particle.life,
                    boxShadow: `0 0 4px ${particle.color}`
                  }}
                />
              ))}

              {/* Game Over Overlay */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="text-center p-4">
                      <motion.h2
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-2xl md:text-4xl font-bold text-red-500 mb-2 md:mb-4"
                      >
                        GAME OVER
                      </motion.h2>
                      <p className="text-white mb-4 md:mb-6">Final Score: {score}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="bg-gradient-to-r from-[#915EFF] to-[#7c4dff] text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-600/40 transition-all text-sm md:text-base"
                      >
                        PLAY AGAIN
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pause Overlay */}
              <AnimatePresence>
                {isPaused && gameStarted && !gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="text-center p-4">
                      <h2 className="text-2xl md:text-4xl font-bold text-[#915EFF] mb-2 md:mb-4">PAUSED</h2>
                      <p className="text-white text-sm md:text-base">Press SPACE to resume</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Start Screen */}
              <AnimatePresence>
                {!gameStarted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="text-center p-4">
                      <motion.h2
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="text-xl md:text-3xl font-bold text-[#915EFF] mb-4 md:mb-6"
                      >
                        READY TO PLAY?
                      </motion.h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="bg-gradient-to-r from-[#915EFF] to-[#7c4dff] text-white px-8 py-3 md:px-12 md:py-4 rounded-lg font-bold text-lg md:text-xl hover:shadow-lg hover:shadow-purple-600/40 transition-all mb-4 md:mb-6"
                      >
                        START GAME
                      </motion.button>
                      <div className="text-xs md:text-sm text-gray-400 space-y-1 md:space-y-2">
                        <p>Use arrow keys or swipe to move</p>
                        <p>Press SPACE to pause</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Leaderboard Panel - Hidden on small screens unless toggled */}
          {(showLeaderboard || window.innerWidth >= 768) && (
            <motion.div 
              className={`bg-[#16213e] rounded-lg p-4 shadow-xl border border-purple-900 ${showLeaderboard ? 'w-full md:w-64' : 'hidden md:block md:w-64'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-[#00ff88]">LEADERBOARD</h2>
                <button 
                  onClick={() => setShowLeaderboard(false)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              {leaderboard.length > 0 ? (
                <div className="overflow-auto max-h-64 md:max-h-none">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-800">
                        <th className="py-1 md:py-2 text-left text-xs md:text-sm text-gray-400">#</th>
                        <th className="py-1 md:py-2 text-left text-xs md:text-sm text-gray-400">Name</th>
                        <th className="py-1 md:py-2 text-right text-xs md:text-sm text-gray-400">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr
                          key={index}
                          className={`border-b border-purple-800/30 ${index % 2 === 0 ? 'bg-purple-900/20' : ''}`}
                        >
                          <td className="py-1 md:py-2 text-xs md:text-sm">{index + 1}</td>
                          <td className="py-1 md:py-2 text-xs md:text-sm truncate max-w-[80px]">{entry.name}</td>
                          <td className="py-1 md:py-2 text-right text-xs md:text-sm font-mono">{entry.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-xs md:text-sm text-gray-400 py-2 md:py-4">No scores yet. Be the first!</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-4"
        >
          {gameStarted && !gameOver && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPaused(!isPaused)}
              className="bg-[#2e2e4d] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg border border-[#915EFF]/30 hover:border-[#915EFF] transition-all text-xs md:text-sm"
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="bg-[#2e2e4d] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg border border-[#915EFF]/30 hover:border-[#915EFF] transition-all text-xs md:text-sm"
          >
            RESET
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="bg-[#2e2e4d] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg border border-[#915EFF]/30 hover:border-[#915EFF] transition-all text-xs md:text-sm md:hidden"
          >
            {showLeaderboard ? 'HIDE' : 'LEADERBOARD'}
          </motion.button>
        </motion.div>

        {/* Name Input Modal */}
        <AnimatePresence>
          {showNameInput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-[#1a1a2e] p-6 md:p-8 rounded-lg border border-[#915EFF]/50 max-w-md w-full mx-4"
              >
                <h3 className="text-xl md:text-2xl font-bold text-[#915EFF] mb-2 md:mb-4">Submit Your Score!</h3>
                <p className="text-white mb-4 md:mb-6">You scored: {score}</p>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#2e2e4d] border border-[#915EFF]/30 text-white px-4 py-2 md:py-3 rounded-lg mb-4 focus:outline-none focus:border-[#915EFF] text-sm md:text-base"
                  maxLength="20"
                  autoFocus
                />
                <div className="flex gap-2 md:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitScore}
                    disabled={!playerName.trim()}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold flex-1 text-sm md:text-base ${playerName.trim()
                      ? 'bg-gradient-to-r from-[#915EFF] to-[#7c4dff] text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    SUBMIT
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNameInput(false)}
                    className="bg-[#2e2e4d] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg border border-[#915EFF]/30 flex-1 text-sm md:text-base"
                  >
                    SKIP
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Controls - Only show on small screens */}
        {window.innerWidth < 768 && (
          <div className="mt-4 grid grid-cols-3 gap-2 max-w-[280px] mx-auto">
            <div></div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => directionRef.current.y !== 1 && setDirection({ x: 0, y: -1 })}
              className="bg-[#2e2e4d] border border-[#915EFF]/30 text-white p-3 rounded-lg text-xl flex items-center justify-center"
            >
              ↑
            </motion.button>
            <div></div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => directionRef.current.x !== 1 && setDirection({ x: -1, y: 0 })}
              className="bg-[#2e2e4d] border border-[#915EFF]/30 text-white p-3 rounded-lg text-xl flex items-center justify-center"
            >
              ←
            </motion.button>
            <div className="bg-[#2e2e4d]/50 rounded-lg flex items-center justify-center">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="text-xs text-gray-400"
              >
                {isPaused ? '▶' : '⏸'}
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => directionRef.current.x !== -1 && setDirection({ x: 1, y: 0 })}
              className="bg-[#2e2e4d] border border-[#915EFF]/30 text-white p-3 rounded-lg text-xl flex items-center justify-center"
            >
              →
            </motion.button>
            <div></div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => directionRef.current.y !== -1 && setDirection({ x: 0, y: 1 })}
              className="bg-[#2e2e4d] border border-[#915EFF]/30 text-white p-3 rounded-lg text-xl flex items-center justify-center"
            >
              ↓
            </motion.button>
            <div></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SnakeGame;