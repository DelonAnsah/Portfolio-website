import React, { useState, useEffect, useRef } from 'react';
import { knowledgeSnippets } from './Constants';
import { motion, AnimatePresence } from 'framer-motion';
import { FaKeyboard, FaUndo, FaTrophy, FaChevronRight } from 'react-icons/fa';
import { IoMdTimer } from 'react-icons/io';
import { BsSpeedometer2, BsCheckCircleFill } from 'react-icons/bs';

const CodeTypingChallenge = () => {
  // Game state
  const [gameState, setGameState] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [charStatus, setCharStatus] = useState([]);
  const previewRef = useRef(null);
  const inputRef = useRef(null);

  const currentSnippet = knowledgeSnippets[snippetIndex];
  const snippetChars = currentSnippet.content.split('');

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(60);
    setScore(0);
    setTypedText('');
    setStartTime(Date.now());
    setCharStatus(Array(snippetChars.length).fill(null));
    inputRef.current.focus();
  };

  const resetGame = () => {
    setGameState('ready');
    setTimeLeft(60);
    setScore(0);
    setWpm(0);
    setAccuracy(100);
    setTypedText('');
    setStartTime(null);
    setEndTime(null);
    setCharStatus([]);
    setSnippetIndex(Math.floor(Math.random() * knowledgeSnippets.length));
  };

  const handleTyping = (e) => {
    if (gameState !== 'playing') return;

    const text = e.target.value.slice(0, snippetChars.length);
    setTypedText(text);

    const newCharStatus = [];
    let correctChars = 0;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === snippetChars[i]) {
        newCharStatus[i] = 'correct';
        correctChars++;
      } else {
        newCharStatus[i] = 'incorrect';
      }
    }

    setCharStatus(newCharStatus);

    const newAccuracy = text.length > 0 ? Math.round((correctChars / text.length) * 100) : 100;
    setAccuracy(newAccuracy);

    const timeElapsed = startTime ? (Date.now() - startTime) / 60000 : 0;
    const words = correctChars / 5;
    const newWpm = timeElapsed > 0 ? Math.round(words / timeElapsed) : 0;
    setWpm(newWpm);

    if (text.length === snippetChars.length && correctChars === snippetChars.length) {
      const snippetScore = Math.round((correctChars * newWpm * newAccuracy) / 100);
      setScore(prev => prev + snippetScore);
      const nextIndex = (snippetIndex + 1) % knowledgeSnippets.length;
      setSnippetIndex(nextIndex);
      setTypedText('');
      setCharStatus([]);
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('finished');
            setEndTime(Date.now());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, snippetIndex]);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [typedText]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4"
      onClick={() => {
        if (inputRef.current && gameState === 'playing') {
          inputRef.current.focus();
        }
      }}
    >
      {/* Game Title - Responsive text size */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <FaKeyboard className="text-[#915EFF]" /> Typing Challenge
      </h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-8 text-center max-w-2xl">
        Test your typing speed and accuracy. Type the knowledge snippet as fast and accurately as you can!
      </p>

      {/* Game Info Bar - Stack on mobile */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-between w-full mb-4 sm:mb-6 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 text-white">
          <IoMdTimer className="text-[#915EFF]" size={16} />
          <span className="font-mono text-sm sm:text-xl">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <BsSpeedometer2 className="text-[#915EFF]" size={14} />
          <span className="font-mono text-sm sm:text-xl">{wpm} WPM</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <BsCheckCircleFill className="text-[#915EFF]" size={14} />
          <span className="font-mono text-sm sm:text-xl">{accuracy}%</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <span className="font-bold text-sm sm:text-base">Score:</span>
          <span className="font-mono text-sm sm:text-xl">{score}</span>
        </div>
      </div>

      {/* Language Tag - Adjusted for mobile */}
      <div className="self-start mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="bg-[#915EFF]/20 text-[#915EFF] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
          {currentSnippet.category}
        </span>
        <span className="text-gray-400 text-xs sm:text-sm capitalize">
          {currentSnippet.difficulty}
        </span>
      </div>

      <div className="relative w-full mb-4 sm:mb-8">
        {/* Code snippet display - Adjusted height for mobile */}
        <div
          className="bg-[#1e1e2f] p-4 sm:p-6 rounded-xl overflow-auto text-gray-300 font-mono text-xs sm:text-sm md:text-base border border-[#915EFF]/30 h-32 sm:h-48"
          ref={previewRef}
        >
          {snippetChars.map((char, index) => {
            let charClass = 'text-gray-400';
            if (index < typedText.length) {
              charClass = charStatus[index] === 'correct'
                ? 'text-green-400'
                : 'text-red-400 underline';
            } else if (index === typedText.length && gameState === 'playing') {
              charClass = 'text-white bg-[#915EFF]/50';
            }
            return (
              <span key={index} className={charClass}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Input field - Adjusted for mobile */}
        <textarea
          ref={inputRef}
          value={typedText}
          onChange={handleTyping}
          className="w-full h-32 bg-transparent resize-none text-transparent caret-white absolute top-0 left-0 p-4 sm:p-6 font-mono text-xs sm:text-sm md:text-base overflow-hidden focus:outline-none"
          disabled={gameState !== 'playing'}
          spellCheck={false}
          tabIndex={0}
          aria-hidden="false"
        />
      </div>

      {/* Game Controls - Adjusted button sizes for mobile */}
      <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-center">
        {gameState === 'ready' && (
          <motion.button
            onClick={startGame}
            className="bg-[#915EFF] hover:bg-[#7c4dff] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start<span className="hidden sm:inline">Challenge</span> <FaChevronRight className="text-xs sm:text-sm" />
          </motion.button>
        )}

        {(gameState === 'playing' || gameState === 'finished') && (
          <motion.button
            onClick={resetGame}
            className="bg-[#1e1e2f] border border-[#915EFF]/50 hover:bg-[#915EFF]/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUndo className="text-xs sm:text-sm" /> <span className="hidden sm:inline">Play</span> Again
          </motion.button>
        )}
      </div>

      {/* Results Screen - Adjusted for mobile */}
      <AnimatePresence>
        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 sm:mt-8 bg-gradient-to-br from-[#1e1e2f] to-[#2a2a3e] p-4 sm:p-6 rounded-2xl border border-[#915EFF]/30 w-full max-w-md"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <FaTrophy className="text-yellow-400" size={20} />
              <h4 className="text-lg sm:text-xl font-bold text-white">Challenge Complete!</h4>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {[
                { label: "Final Score", value: score },
                { label: "Typing Speed", value: `${wpm} WPM` },
                { label: "Accuracy", value: `${accuracy}%` },
                { label: "Snippets", value: Math.floor(typedText.length / snippetChars.length) }
              ].map((item, index) => (
                <div key={index} className="bg-[#1e1e2f] p-2 sm:p-4 rounded-lg">
                  <div className="text-gray-400 text-xs sm:text-sm">{item.label}</div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm sm:text-base mb-2 sm:mb-4">
                {score > 5000 ? "Amazing! You're a coding wizard! 🧙♂️" :
                  score > 3000 ? "Great job! You've got serious skills! 💻" :
                    score > 1500 ? "Good work! Keep practicing! 👍" :
                      "Nice try! You'll get better with practice! 👊"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions - Adjusted for mobile */}
      {gameState === 'ready' && (
        <div className="mt-4 sm:mt-8 bg-[#1e1e2f] p-4 sm:p-6 rounded-2xl border border-[#915EFF]/30 w-full max-w-2xl">
          <h4 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4 flex items-center gap-2">
            <FaKeyboard className="text-[#915EFF]" /> How to Play
          </h4>
          <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
            {[
              "Type the knowledge snippet as fast and accurately as you can",
              "You have 60 seconds to type as many snippets as possible",
              "Your score is based on speed, accuracy, and characters typed",
              "Correct characters turn green, incorrect ones turn red",
              "Complete a snippet to automatically move to the next one"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#915EFF]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeTypingChallenge;