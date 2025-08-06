'use client';

import { motion } from 'framer-motion';

interface ShimmerBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  borderWidth?: string;
  duration?: number;
}

export default function ShimmerBorder({
  children,
  className = '',
  borderRadius = '1rem',
  borderWidth = '2px',
  duration = 3
}: ShimmerBorderProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated gradient border */}
      <div
        className="absolute -inset-[1px] rounded-[inherit] opacity-75"
        style={{
          background: `linear-gradient(90deg, transparent, #a855f7, #ec4899, transparent)`,
          backgroundSize: '200% 100%',
          padding: borderWidth,
          borderRadius,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            background: 'inherit',
            backgroundSize: 'inherit'
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0']
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}