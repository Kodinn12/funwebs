import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  size: number;
  delay: number;
}

interface RocketAnimationProps {
  multiplier: number;
  isPlaying: boolean;
  isCrashed: boolean;
}

export const RocketAnimation = ({ multiplier, isPlaying, isCrashed }: RocketAnimationProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Generate static background stars
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  // Generate moving stars when playing
  useEffect(() => {
    if (!isPlaying) {
      setStars([]);
      return;
    }

    const interval = setInterval(() => {
      setStars(prev => {
        const newStar: Star = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 0.5,
        };
        const updated = [...prev, newStar];
        return updated.slice(-20);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Explosion particles on crash
  useEffect(() => {
    if (isCrashed) {
      const explosionParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.cos((i / 12) * Math.PI * 2) * (Math.random() * 80 + 40),
        y: Math.sin((i / 12) * Math.PI * 2) * (Math.random() * 80 + 40),
      }));
      setParticles(explosionParticles);
    } else {
      setParticles([]);
    }
  }, [isCrashed]);

  // Rocket position based on multiplier (higher = further up)
  // bottom: 5% = resting, bottom: 85% = top of screen
  const rocketBottom = isPlaying
    ? Math.min(5 + (multiplier - 1) * 20, 85) // 5% at 1x → 85% at 5x+
    : isCrashed
    ? Math.min(5 + (multiplier - 1) * 20, 85) // Stay at crash position
    : 5; // Resting position at bottom

  // Sky gradient changes as rocket goes higher
  const skyGradient = isPlaying
    ? multiplier < 2
      ? 'from-blue-900 via-blue-700 to-blue-400' // Low altitude - blue sky
      : multiplier < 5
      ? 'from-blue-900 via-indigo-800 to-purple-600' // Mid altitude - dark sky
      : 'from-indigo-950 via-purple-900 to-black' // High altitude - space
    : isCrashed
    ? 'from-red-900 via-orange-800 to-yellow-600' // Crashed - fire sky
    : 'from-gray-900 via-gray-800 to-gray-700'; // Idle - dark

  return (
    <div className={`relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-b ${skyGradient} transition-all duration-500`}>
      {/* Background stars */}
      {backgroundStars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Moving stars (speed effect) */}
      <AnimatePresence>
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${star.x}%`, width: star.size, height: star.size * 3 }}
            initial={{ top: '0%', opacity: 0.8 }}
            animate={{ top: '100%', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: star.delay }}
          />
        ))}
      </AnimatePresence>

      {/* Clouds at low altitude */}
      {isPlaying && multiplier < 3 && (
        <>
          <motion.div
            className="absolute w-32 h-8 bg-white/20 rounded-full blur-sm"
            style={{ left: '10%' }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-24 h-6 bg-white/15 rounded-full blur-sm"
            style={{ left: '60%' }}
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
        </>
      )}

      {/* Rocket */}
      <motion.div
        className="absolute"
        style={{ left: '50%', marginLeft: '-30px' }}
        animate={{
          bottom: `${rocketBottom}%`,
          scale: isCrashed ? [1, 1.3, 0] : isPlaying ? 1 : 0.8,
          rotate: isCrashed ? [0, -15, 15, -30, 30, 0] : 0,
          x: isCrashed ? [0, -20, 20, -10, 10, 0] : 0,
        }}
        transition={{
          bottom: { duration: 0.3, ease: 'linear' },
          scale: { duration: 0.5 },
          rotate: { duration: 1 },
          x: { duration: 1 },
        }}
      >
        {/* Rocket Body - SVG */}
        <svg width="60" height="80" viewBox="0 0 60 80" className="drop-shadow-2xl">
          {/* Flame */}
          {isPlaying && !isCrashed && (
            <motion.g
              animate={{ scaleY: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <ellipse cx="30" cy="78" rx="8" ry="12" fill="#FF6B00" />
              <ellipse cx="30" cy="78" rx="5" ry="8" fill="#FFD700" />
              <ellipse cx="30" cy="78" rx="3" ry="5" fill="#FFF" />
            </motion.g>
          )}
          {/* Fins */}
          <path d="M10 55 L0 70 L15 65 Z" fill="#E53E3E" />
          <path d="M50 55 L60 70 L45 65 Z" fill="#E53E3E" />
          {/* Body */}
          <rect x="15" y="15" width="30" height="50" rx="15" fill="#E2E8F0" />
          {/* Nose */}
          <path d="M30 0 L45 20 L15 20 Z" fill="#E53E3E" />
          {/* Window */}
          <circle cx="30" cy="35" r="8" fill="#4299E1" />
          <circle cx="30" cy="35" r="5" fill="#63B3ED" />
          {/* Stripe */}
          <rect x="15" y="45" width="30" height="4" fill="#E53E3E" />
        </svg>
      </motion.div>

      {/* Crash explosion */}
      <AnimatePresence>
        {isCrashed && particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
            style={{ backgroundColor: ['#FF6B00', '#FFD700', '#FF0000', '#FF4444'][p.id % 4] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Multiplier overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className={`text-4xl font-bold ${isCrashed ? 'text-red-400' : 'text-green-400'}`}
          animate={isCrashed ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.5, repeat: isCrashed ? 2 : 0 }}
        >
          {multiplier.toFixed(2)}x
        </motion.div>
      </div>

      {/* Altitude indicator */}
      {isPlaying && (
        <div className="absolute right-4 top-4 text-white/60 text-sm">
          ALT: {(multiplier * 1000).toFixed(0)}m
        </div>
      )}

      {/* Crash text */}
      <AnimatePresence>
        {isCrashed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-6xl font-black text-red-500"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              CRASHED!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RocketAnimation;
