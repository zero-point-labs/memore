'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);
  const characters = text.split('');

  useEffect(() => {
    setGlitching(true);
    const timer = setTimeout(() => setGlitching(false), 300);
    return () => clearTimeout(timer);
  }, [text]);

  const glitchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const glitchAnimation = {
    x: glitching ? [0, -2, 2, -1, 1, 0] : 0,
    filter: glitching
      ? [
          'hue-rotate(0deg)',
          'hue-rotate(90deg)',
          'hue-rotate(-90deg)',
          'hue-rotate(45deg)',
          'hue-rotate(0deg)',
        ]
      : 'hue-rotate(0deg)',
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          className="relative inline-block"
          animate={glitchAnimation}
          transition={{ duration: 0.3 }}
        >
          {characters.map((char, i) => (
            <motion.span
              key={`${text}-${i}`}
              initial="hidden"
              animate="visible"
              variants={glitchVariants}
              transition={{
                delay: i * 0.05,
                duration: 0.5,
                ease: "easeOut",
              }}
              className="inline-block"
              style={{
                textShadow: glitching
                  ? `
                    ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(255, 0, 255, 0.5),
                    ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(0, 255, 255, 0.5)
                  `
                  : 'none',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
      
      {/* Glitch layers */}
      {glitching && (
        <>
          <span
            className="absolute inset-0 opacity-80"
            style={{
              color: '#ff00ff',
              transform: 'translateX(-2px)',
              mixBlendMode: 'screen',
            }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 opacity-80"
            style={{
              color: '#00ffff',
              transform: 'translateX(2px)',
              mixBlendMode: 'screen',
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}