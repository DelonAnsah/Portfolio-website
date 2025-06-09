import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const GameCard = ({ game, index, onClick }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-to-br from-[#1e1e2f] to-[#2e2e4d] rounded-2xl p-6 border border-[#915EFF]/20 hover:border-[#915EFF]/50 transition-all cursor-pointer group overflow-hidden relative"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(145, 94, 255, 0.3)",
        scale: 1.02
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-[#915EFF] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="text-4xl mb-4">{game.icon || '🎮'}</div>
          <span className="inline-flex items-center px-3 py-1 text-xs bg-[#915EFF]/10 text-[#915EFF] rounded-full">
            {game.difficulty}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#915EFF] transition-colors">
          {game.title}
        </h3>
        <p className="text-gray-300 mb-4 flex-grow">{game.description}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {game.tech.map((tech, i) => (
            <span key={i} className="text-xs bg-[#2e2e4d] text-gray-400 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;