'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface GlitchRevealTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlitchRevealTransition({ children, className = '' }: GlitchRevealTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to glitch intensity - less aggressive
  const glitchIntensity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 0.6, 0]);
  
  useEffect(() => {
    const unsubscribe = glitchIntensity.on("change", (value) => {
      setIsGlitching(value > 0.1);
    });
    return () => unsubscribe();
  }, [glitchIntensity]);

  const sliceCount = 10;
  const slices = Array.from({ length: sliceCount }, (_, i) => i);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Glitch slices overlay */}
      {isGlitching && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          {slices.map((slice) => (
            <motion.div
              key={slice}
              className="absolute w-full bg-black"
              style={{
                height: `${100 / sliceCount}%`,
                top: `${(slice * 100) / sliceCount}%`,
                mixBlendMode: 'difference',
              }}
              animate={{
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0, Math.random() * 0.4, 0],
                scaleX: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 0.2,
                ease: "linear",
              }}
            />
          ))}
          
          {/* RGB Split Effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1))',
              mixBlendMode: 'screen',
            }}
            animate={{
              x: [-5, 5, -5],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Digital Noise */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
              mixBlendMode: 'multiply',
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
            }}
          />
        </div>
      )}
      
      {/* Main content with glitch animation */}
      <motion.div
        style={{
          filter: isGlitching ? 'contrast(1.2) brightness(1.1)' : 'none',
        }}
        animate={isGlitching ? {
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 1, -1, 2, -2, 0],
        } : {}}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
      </motion.div>
      
      {/* Scanlines effect */}
      {isGlitching && (
        <div 
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          }}
        />
      )}
    </div>
  );
}