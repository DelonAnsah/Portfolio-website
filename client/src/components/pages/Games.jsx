import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styles } from '../../styles';
import { games } from '../Constants';
import GameCard from '../GameCard';
import GamesSkeleton from '../GamesSkeleton';


const Games = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);


  // Enhance games with category icons
  const enhancedGames = games.map(game => ({
    ...game,
    icon: game.category === 'classic' ? '🕹️' :
      game.category === 'educational' ? '📚' :
        game.category === 'puzzle' ? '🧩' : '🎮'
  }));

  const handleCardClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

    if (isLoading) {
    return <GamesSkeleton />;
  }


  return (
    <motion.div
      className="px-5 md:px-16 py-8 md:py-12 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[82rem] mx-auto">
        <motion.div className="mb-12 text-center">
          <p className={`${styles.sectionSubText}`}>Interactive Experience</p>
          <h2 className={`${styles.sectionHeadText} mb-4`}>Game Zone</h2>
          <motion.p
            className="mt-4 text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Play these carefully crafted games that showcase both technical skills and creative design.
            Challenge yourself and climb the leaderboard!
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {enhancedGames.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onClick={() => handleCardClick(game.id)}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Games;