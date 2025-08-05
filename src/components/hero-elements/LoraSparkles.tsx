'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoraSparkles() {
  return (
    <>
      {/* Floating sparkles that connect Lora mentions */}
      <motion.div
        className="absolute top-[40%] left-[20%] text-purple-400 pointer-events-none z-20"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-4 h-4" />
      </motion.div>

      <motion.div
        className="absolute top-[55%] right-[25%] text-pink-400 pointer-events-none z-20"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>

      <motion.div
        className="absolute top-[70%] left-[50%] text-purple-400 pointer-events-none z-20"
        animate={{
          x: [0, -10, 10, 0],
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Sparkles className="w-3 h-3" />
      </motion.div>

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ opacity: 0.2 }}>
        <motion.path
          d="M 20% 40% Q 50% 30% 80% 55%"
          fill="none"
          stroke="url(#purple-gradient)"
          strokeWidth="1"
          strokeDasharray="5 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <defs>
          <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}