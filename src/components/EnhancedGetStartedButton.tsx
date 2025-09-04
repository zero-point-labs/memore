'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, memo } from 'react';
import { BorderBeam } from '@/components/magicui/border-beam';

interface EnhancedGetStartedButtonProps {
  onClick: () => void;
  className?: string;
}

const EnhancedGetStartedButton = memo(function EnhancedGetStartedButton({ 
  onClick, 
  className = "" 
}: EnhancedGetStartedButtonProps) {
  const [currentState, setCurrentState] = useState(0);
  
  // Multi-state button messages
  const buttonStates = [
    { icon: '✨', text: 'Get Started', emoji: '🚀' },
    { icon: '🎉', text: 'Join The Adventure', emoji: '🌟' },
    { icon: '🔥', text: 'Book Your Spot', emoji: '💫' },
    { icon: '⚡', text: 'Reserve Now', emoji: '🎯' },
  ];

  // Change button state every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % buttonStates.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [buttonStates.length]);

  const currentButton = buttonStates[currentState];

  // Particle component
  const Particle = ({ delay = 0, x = 0, y = 0 }) => (
    <motion.div
      className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-70"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -20, 0],
        x: [0, Math.random() * 10 - 5, 0],
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-500/50 backdrop-blur-sm overflow-hidden font-bold text-lg transition-all duration-500 group ${className}`}
    >
      {/* Animation keyframe styles */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 0 40px rgba(236, 72, 153, 0.3); }
        }
        
        .button-glow {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Border beam effect */}
      <BorderBeam
        colorFrom="#8B5CF6"
        colorTo="#EC4899"
        borderWidth={3}
        duration={3}
      />
      
      {/* Subtle particles */}
      <Particle delay={0} x={20} y={30} />
      <Particle delay={1} x={80} y={70} />
      <Particle delay={2} x={50} y={20} />
      <Particle delay={0.5} x={70} y={80} />
      <Particle delay={1.5} x={30} y={60} />
      
      {/* Animated background overlay */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
      
      {/* Button content with state transitions */}
      <motion.div
        key={currentState}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center gap-3 text-white z-10"
      >
        <motion.span
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="text-xl"
        >
          {currentButton.icon}
        </motion.span>
        
        <span className="relative font-bold tracking-wide">
          {currentButton.text}
        </span>
        
        <motion.span
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-lg"
        >
          {currentButton.emoji}
        </motion.span>
      </motion.div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-full button-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.button>
  );
});

export default EnhancedGetStartedButton;
