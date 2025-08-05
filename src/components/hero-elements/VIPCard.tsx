'use client';

import { motion } from 'framer-motion';
import { User, Crown, Shield, Diamond, Star } from 'lucide-react';

interface VIPCardProps {
  isHovered?: boolean;
}

export default function VIPCard({ isHovered = false }: VIPCardProps) {
  return (
    <div className="relative w-full h-auto min-h-[400px] md:h-[420px] lg:h-[450px] py-8 md:py-0">
      <div className="absolute inset-0 flex items-center justify-center lg:justify-center md:justify-start">
        <div className="relative">
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-purple-600/20 blur-[80px] animate-pulse" />
          
          {/* Main Card */}
          <motion.div
            animate={{
              rotateY: isHovered ? 10 : 0,
              rotateX: isHovered ? -5 : 0,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-[340px] sm:w-[380px] md:w-[420px] lg:w-[460px] h-[280px] sm:h-[300px] md:h-[320px] mx-auto"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Glassmorphism Card */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
              
              <div className="relative z-10 p-4 sm:p-5 md:p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400/80" />
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white/90">MEMORA PREMIUM</h3>
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/50 font-mono">EST. 2024</span>
                </div>

                {/* Profile Section */}
                <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <User className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white/70" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white/90 font-semibold text-base sm:text-lg">YOUR NAME HERE</h4>
                    <p className="text-white/60 text-xs sm:text-sm">Member ID: VIP-2024-0847</p>
                    <div className="flex gap-2 mt-1 sm:mt-2">
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">VERIFIED</span>
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">FOUNDING MEMBER</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-[10px] sm:text-xs text-white/50">Member Since</p>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">July 15, 2024</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-[10px] sm:text-xs text-white/50">Events Attended</p>
                    <p className="text-xs sm:text-sm text-white/80 font-medium">47 Exclusive</p>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <p className="text-[10px] sm:text-xs text-white/40">Lifetime Benefits Include:</p>
                    <div className="flex gap-1">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                      <Diamond className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white/40" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[9px] sm:text-[10px] text-white/60">
                    <span>• VIP Access</span>
                    <span>• Private Events</span>
                    <span>• Concierge Service</span>
                    <span>• Priority Booking</span>
                  </div>
                </div>
              </div>


            </div>
          </motion.div>


        </div>
      </div>

      {/* Background Particles */}
      {[...Array(6)].map((_, i) => {
        const initialTop = 20 + (i * 15);
        const initialLeft = 10 + (i * 14);
        
        return (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.7,
            }}
            className="absolute"
            style={{
              top: `${initialTop}%`,
              left: `${initialLeft}%`,
            }}
          >
            <div className="w-1 h-1 bg-white/40 rounded-full" />
          </motion.div>
        );
      })}
    </div>
  );
}