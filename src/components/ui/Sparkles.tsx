'use client';

import { useEffect, useRef } from 'react';

interface SparklesProps {
  className?: string;
  density?: number;
  speed?: number;
  color?: string;
  size?: number;
}

export default function Sparkles({
  className = '',
  density = 50,
  speed = 1,
  color = '#a855f7',
  size = 2
}: SparklesProps) {
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute rounded-full pointer-events-none';
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.backgroundColor = color;
      sparkle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.opacity = '0';
      
      if (sparklesRef.current) {
        sparklesRef.current.appendChild(sparkle);
        
        // Animate sparkle
        sparkle.animate([
          { opacity: 0, transform: 'scale(0) translateY(0)' },
          { opacity: 1, transform: 'scale(1) translateY(-10px)' },
          { opacity: 0, transform: 'scale(0) translateY(-20px)' }
        ], {
          duration: 2000 / speed,
          easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
      }
    };

    const interval = setInterval(() => {
      generateSparkle();
    }, 3000 / density);

    return () => clearInterval(interval);
  }, [density, speed, color, size]);

  return (
    <div 
      ref={sparklesRef} 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    />
  );
}