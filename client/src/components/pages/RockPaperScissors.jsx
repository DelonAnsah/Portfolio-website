import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameResult, setGameResult] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [delonMessage, setDelonMessage] = useState("Ready to challenge me? 🎮");
  const [matchWinner, setMatchWinner] = useState(null);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const choices = [
    { name: 'rock', emoji: '🪨', icon: '✊', color: '#8B5CF6' },
    { name: 'paper', emoji: '📄', icon: '✋', color: '#06B6D4' },
    { name: 'scissors', emoji: '✂️', icon: '✌️', color: '#F59E0B' }
  ];

  const delonMessages = {
    win: [
      "Too easy! I saw that coming 😎",
      "My algorithms are superior! 🤖",
      "Better luck next time, human! 💪",
      "I'm built different! ⚡",
      "That's how we do it in the code! 🔥"
    ],
    lose: [
      "Not bad... for a human 🤔",
      "Lucky shot! Won't happen again 😤",
      "Impressive move! But I'm learning... 🧠",
      "You got me this time! 👏",
      "Alright, you earned that one! 💯"
    ],
    tie: [
      "Great minds think alike! 🤝",
      "We're evenly matched! 😮",
      "Perfectly balanced! ⚖️",
      "Synchronization achieved! 🔄",
      "Mirror match! 🪞"
    ],
    matchWin: [
      "I reign supreme! 👑",
      "Victory is mine! 🏆",
      "Another win for the machines! 🤖",
      "Better luck next match! 😎",
      "I'm simply unbeatable! 💪"
    ],
    matchLose: [
      "You got me this time... 😤",
      "I'll get you next match! 🤖",
      "Well played, human! 👏",
      "This won't happen again! 💢",
      "You're pretty good! �"
    ]
  };

  const getRandomChoice = () => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player, computer) => {
    if (player.name === computer.name) return 'tie';
    if (
      (player.name === 'rock' && computer.name === 'scissors') ||
      (player.name === 'paper' && computer.name === 'rock') ||
      (player.name === 'scissors' && computer.name === 'paper')
    ) {
      return 'player';
    }
    return 'computer';
  };

  const getRandomMessage = (result) => {
    if (result === 'matchWin') return delonMessages.matchWin[Math.floor(Math.random() * delonMessages.matchWin.length)];
    if (result === 'matchLose') return delonMessages.matchLose[Math.floor(Math.random() * delonMessages.matchLose.length)];

    const messages = delonMessages[result === 'player' ? 'lose' : result === 'computer' ? 'win' : 'tie'];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const checkMatchWinner = () => {
    if (playerScore >= 5) {
      setMatchWinner('player');
      setDelonMessage(getRandomMessage('matchLose'));
    } else if (computerScore >= 5) {
      setMatchWinner('computer');
      setDelonMessage(getRandomMessage('matchWin'));
    }
  };

  const playGame = (choice) => {
    if (isPlaying || matchWinner) return;

    setIsPlaying(true);
    setPlayerChoice(choice);
    setShowResult(false);

    // Simulate thinking time
    setTimeout(() => {
      const compChoice = getRandomChoice();
      setComputerChoice(compChoice);

      const result = determineWinner(choice, compChoice);
      setRoundsPlayed(prev => prev + 1);

      if (result === 'player') {
        setPlayerScore(prev => prev + 1);
        setStreak(prev => {
          const newStreak = prev + 1;
          setMaxStreak(current => Math.max(current, newStreak));
          return newStreak;
        });
        setGameResult('You Win! 🎉');
      } else if (result === 'computer') {
        setComputerScore(prev => prev + 1);
        setStreak(0);
        setGameResult('Delon Wins! 🤖');
      } else {
        setGameResult("It's a Tie! 🤝");
      }

      setDelonMessage(getRandomMessage(result));

      // Add to history
      setGameHistory(prev => [{
        playerChoice: choice,
        computerChoice: compChoice,
        result,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);

      setShowResult(true);
      setIsPlaying(false);

      // Check if match has been won
      checkMatchWinner();
    }, 300);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setStreak(0);
    setMaxStreak(0);
    setGameHistory([]);
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameResult('');
    setShowResult(false);
    setMatchWinner(null);
    setRoundsPlayed(0);
    setDelonMessage("Fresh start! Let's go again! 🚀");
  };

  // Responsive adjustments
  const isSmallScreen = windowSize.width < 768;
  const choiceIconSize = isSmallScreen ? 'text-3xl' : 'text-4xl';
  const choiceButtonPadding = isSmallScreen ? 'p-4' : 'p-6';
  const scoreFontSize = isSmallScreen ? 'text-3xl' : 'text-4xl';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 md:mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Rock Paper Scissors</h1>
          <p className="text-gray-400 text-sm md:text-lg">
            Challenge Delon 🤖 in this classic game. First to 5 wins becomes the ultimate champion!
          </p>
        </motion.div>

        {/* Score Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1e1e2f] rounded-2xl border border-[#915EFF]/20 p-4 mb-4 md:mb-6"
        >
          <div className="grid grid-cols-3 gap-2 md:gap-6 text-center">
            <div>
              <h3 className="text-white text-sm md:text-lg font-semibold mb-1 md:mb-2">You</h3>
              <div className={`${scoreFontSize} font-bold text-[#06B6D4]`}>{playerScore}</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-xl md:text-2xl font-bold text-[#915EFF] mb-1 md:mb-2">VS</div>
              <div className="text-xs md:text-sm text-gray-400">
                Streak: {streak} | Best: {maxStreak}
              </div>
            </div>
            <div>
              <h3 className="text-white text-sm md:text-lg font-semibold mb-1 md:mb-2">Delon</h3>
              <div className={`${scoreFontSize} font-bold text-[#F59E0B]`}>{computerScore}</div>
            </div>
          </div>
        </motion.div>

        {/* Combined Message and Result Area */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
          {/* Delon's Message */}
          <motion.div
            key={delonMessage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#2e2e4d] rounded-xl p-3 md:p-4 border border-[#915EFF]/30 h-full flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-[#915EFF] to-[#7c4dff] rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                🤖
              </div>
              <div>
                <div className="text-[#915EFF] font-semibold text-xs md:text-sm mb-1">Delon says:</div>
                <div className="text-white text-sm md:text-lg">{delonMessage}</div>
              </div>
            </div>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="bg-gradient-to-r from-[#915EFF]/20 to-[#7c4dff]/20 rounded-xl border border-[#915EFF]/50 p-3 md:p-4 h-full flex items-center justify-center"
              >
                <div className="text-center w-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2"
                  >
                    {gameResult}
                  </motion.div>

                  {streak > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-[#915EFF] font-semibold text-sm md:text-lg"
                    >
                      🔥 {streak} Win Streak! 🔥
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Area - Stack on small screens, side by side on larger */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-4 md:mb-8">
          {/* Player Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1e1e2f] rounded-2xl border border-[#915EFF]/20 p-4 md:p-6 flex-1"
          >
            <h3 className="text-white text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">Your Choice</h3>

            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              {choices.map((choice) => (
                <motion.button
                  key={choice.name}
                  onClick={() => playGame(choice)}
                  disabled={isPlaying || matchWinner}
                  className={`relative ${choiceButtonPadding} rounded-xl border-2 transition-all duration-300 ${
                    playerChoice?.name === choice.name
                      ? `border-[${choice.color}] bg-[${choice.color}]/20`
                      : 'border-gray-600 hover:border-[#915EFF]'
                  } ${(isPlaying || matchWinner) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                  whileHover={!(isPlaying || matchWinner) ? { scale: 1.05 } : {}}
                  whileTap={!(isPlaying || matchWinner) ? { scale: 0.95 } : {}}
                >
                  <div className={`${choiceIconSize} mb-1 md:mb-2`}>{choice.icon}</div>
                  <div className="text-white text-xs md:text-base font-medium capitalize">{choice.name}</div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {playerChoice && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-6xl mb-1 md:mb-2">{playerChoice.icon}</div>
                  <div className="text-white text-sm md:text-base font-semibold capitalize">{playerChoice.name}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Computer Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1e1e2f] rounded-2xl border border-[#915EFF]/20 p-4 md:p-6 flex-1"
          >
            <h3 className="text-white text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center">Delon's Choice</h3>

            <div className="min-h-[120px] md:min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="text-4xl md:text-6xl mb-2 md:mb-4"
                    >
                      🤖
                    </motion.div>
                    <div className="text-[#915EFF] font-semibold text-sm md:text-base">Delon is thinking...</div>
                    <div className="flex justify-center gap-1 mt-1 md:mt-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-[#915EFF] rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : computerChoice ? (
                  <motion.div
                    key="choice"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-6xl mb-1 md:mb-2">{computerChoice.icon}</div>
                    <div className="text-white text-sm md:text-base font-semibold capitalize">{computerChoice.name}</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-400 text-sm md:text-base"
                  >
                    <div className="text-4xl md:text-6xl mb-1 md:mb-2">🤖</div>
                    <div>Waiting for your move...</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Reset Button */}
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-[#915EFF] to-[#7c4dff] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold text-sm md:text-base hover:shadow-lg hover:shadow-[#915EFF]/30 transition-all duration-300"
          >
            {matchWinner ? '🔄 Play Again' : '🔄 Reset Game'}
          </button>
        </motion.div>

        {/* Match Winner Banner - Full Width Overlay */}
        <AnimatePresence>
          {matchWinner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-r from-[#915EFF]/90 to-[#7c4dff]/90 rounded-2xl border-2 border-[#915EFF] p-6 md:p-8 max-w-2xl w-full text-center relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                  className="text-2xl md:text-4xl font-bold mb-4 md:mb-6"
                >
                  {matchWinner === 'player' ? (
                    <span className="text-green-300">🏆 You Won the Match! 🏆</span>
                  ) : (
                    <span className="text-yellow-300">🤖 Delon Won the Match! 🤖</span>
                  )}
                </motion.div>

                <div className="text-xl md:text-2xl text-white mb-4 md:mb-6">
                  Final Score: {playerScore} - {computerScore}
                </div>

                <div className="text-base md:text-xl text-white/80 mb-6 md:mb-8">
                  {matchWinner === 'player'
                    ? "Congratulations! You defeated the Delon!"
                    : "Better luck next time! The Delon learns from every game!"}
                </div>

                <motion.button
                  onClick={resetGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#915EFF] px-6 py-2 md:px-8 md:py-3 rounded-xl font-bold text-base md:text-lg hover:shadow-lg hover:shadow-white/30 transition-all"
                >
                  Play Again
                </motion.button>

                <Confetti
                  width={windowSize.width}
                  height={windowSize.height}
                  recycle={false}
                  numberOfPieces={isSmallScreen ? 500 : 1000}
                  gravity={0.2}
                  colors={['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']}
                  style={{ position: 'fixed', top: 0, left: 0 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RockPaperScissors;