'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, memo, useRef } from 'react';
import VIPCard from '@/components/hero-elements/VIPCard';

import GlitchText from '@/components/hero-elements/GlitchText';
import HypeEnergyMeter from '@/components/hero-elements/HypeEnergyMeter';
import TestimonialCarousel from '@/components/hero-elements/TestimonialCarousel';
import { useParallax } from '@/hooks/useParallax';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';


// Memoize VIPCard to prevent re-renders when title changes
const MemoizedVIPCard = memo(VIPCard);

// Constants
const words = ['PARTIES', 'MEMORIES', 'MADNESS'];

export default function Home() {

  const [currentWord, setCurrentWord] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const parallax = useParallax(0.5);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Swipe gesture for mobile
  useSwipeGesture(heroRef as React.RefObject<HTMLElement>, {
    onSwipeUp: () => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    },
  });

  return (
    <div ref={heroRef} className="min-h-screen bg-black relative overflow-x-hidden pt-20">

      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* High Saturated Glows */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/50 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-pink-600/50 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-purple-500/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4.5, repeat: Infinity }}
          className="absolute top-1/4 left-1/2 w-[400px] h-[400px] bg-pink-500/60 rounded-full blur-[80px]" 
        />
        

        
        {/* Cyber Grid */}
        <div className="cyber-grid absolute inset-0 opacity-30" />
        
        {/* Cyber Lines */}
        <div className="cyber-lines" />
      </div>



      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-20 parallax-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col items-center">
            {/* Content First */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              style={{
                transform: `translateX(${parallax.x * 0.3}px) translateY(${parallax.y * 0.3}px)`,
              }}
              className="space-y-6 sm:space-y-8 text-center max-w-6xl w-full mb-12 sm:mb-16 px-2 sm:px-4">
              {/* Small Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 mx-auto"
              >
                <span className="text-lg">🇨🇾</span>
                <span className="text-purple-300 text-sm font-medium">CYPRUS ADVENTURES</span>
              </motion.div>

              {/* Main Title */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight"
                  style={{
                    transform: `perspective(1000px) rotateX(${parallax.rotateX * 0.5}deg) rotateY(${parallax.rotateY * 0.5}deg)`,
                  }}
                >
                  <span className="text-white neon-hover">3 DAYS OF</span>{' '}
                  <span className="relative inline-block">
                    <span className="absolute inset-0 blur-2xl bg-purple-600/50"></span>
                    <GlitchText 
                      text={words[currentWord]}
                      className="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 neon-purple"
                    />
                  </span>
                </motion.h1>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mx-auto max-w-2xl px-2">
                Chat with{' '}
                <motion.span 
                  className="text-purple-400 font-semibold relative inline-block"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(139, 92, 246, 0.5)',
                      '0 0 20px rgba(139, 92, 246, 0.8)',
                      '0 0 10px rgba(139, 92, 246, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Lora
                </motion.span>
                {' '}to secure your personalized VIP pass for Cyprus adventures.
              </p>

              {/* Features */}
              <motion.div 
                className="flex flex-wrap gap-3 sm:gap-6 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, staggerChildren: 0.1 }}
              >
                {['Instant Booking', 'VIP Access', 'AI Trip Planning'].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex items-center gap-2 text-gray-300 hover:text-purple-300 transition-colors cursor-pointer group"
                  >
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse group-hover:bg-purple-400 group-hover:glow-pulse" />
                    <span className="text-sm whitespace-nowrap">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Proof Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <TestimonialCarousel />
              </motion.div>

              {/* Hype Energy Meter */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="pt-8"
              >
                <HypeEnergyMeter />
              </motion.div>

            </motion.div>
          </div>
        </div>
        
        {/* VIP Card Section with Enhanced Background */}
        <div className="relative mt-20 pb-20 overflow-visible">
          {/* Section Background Effects */}
          <div className="absolute inset-0">
            {/* Gradient Orbs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[100px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -40, 0],
                y: [0, 40, 0]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" 
            />
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(purple 1px, transparent 1px), linear-gradient(90deg, purple 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
              }} />
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 container mx-auto px-4 overflow-visible">
            {/* Enhanced VIP Card Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_auto]">
                  Your VIP Pass Awaits
                </h2>
              </motion.div>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Join <span className="text-purple-400 font-semibold">500+ students</span> who&apos;ve already secured their spot for the most exclusive Cyprus adventures
              </p>
            </motion.div>

            {/* VIP Card with Enhanced Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={isLoaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.2, type: "spring" }}
              className="relative max-w-2xl mx-auto px-4 sm:px-0"
            >
              {/* Card Glow Effect - Extended for proper blur */}
              <motion.div
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-10 sm:-inset-20 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-3xl rounded-3xl pointer-events-none"
              />
              
              {/* Floating Particles Around Card */}
              <div className="absolute inset-0 pointer-events-none hidden sm:block">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400 rounded-full"
                    initial={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                    }}
                    animate={{
                      x: Math.random() * 400 - 200,
                      y: Math.random() * 400 - 200,
                    }}
                    transition={{
                      duration: 10 + Math.random() * 10,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: i * 0.5,
                    }}
                    style={{
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
                    }}
                  />
                ))}
              </div>
              
              {/* VIP Card */}
              <motion.div
                style={{
                  transform: `
                    perspective(1000px) 
                    translateX(${parallax.x * 0.3}px) 
                    translateY(${parallax.y * 0.3}px)
                    rotateX(${parallax.rotateX * 0.5}deg) 
                    rotateY(${parallax.rotateY * 0.5}deg)
                  `,
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <MemoizedVIPCard />
              </motion.div>
              
              {/* Call to Action Below Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-center mt-8"
              >
                <p className="text-sm text-gray-400 mb-4">
                  Energy levels rising • Join the hype now
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  CLAIM YOUR PASS NOW
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}