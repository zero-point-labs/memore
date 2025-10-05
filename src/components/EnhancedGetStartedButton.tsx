'use client';

import { motion } from 'framer-motion';

interface EnhancedGetStartedButtonProps {
  onClick: () => void;
  className?: string;
}

export default function EnhancedGetStartedButton({ 
  onClick, 
  className = "" 
}: EnhancedGetStartedButtonProps) {
  return (
    <div className="relative inline-block">
      {/* Gradient border */}
      <svg className="absolute inset-0 w-full h-full" style={{ borderRadius: '8px' }}>
        <defs>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <rect
          x="1.5"
          y="1.5"
          width="calc(100% - 3px)"
          height="calc(100% - 3px)"
          rx="8"
          ry="8"
          fill="none"
          stroke="url(#borderGradient)"
          strokeWidth="3"
        />
      </svg>
      
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`group relative px-14 py-5 bg-white/5 backdrop-blur-sm rounded-lg font-bold text-xl transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/50 ${className}`}
      >
        {/* Button text */}
        <span className="relative z-10 flex items-center gap-3 justify-center text-white">
          <span>
            Get Started
          </span>
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
          >
            →
          </motion.span>
        </span>
      </motion.button>
    </div>
  );
}
