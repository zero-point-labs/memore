'use client';

import { motion } from 'framer-motion';
import { Zap, Flame } from 'lucide-react';

export default function HypeEnergyMeter() {
  const hypeLevel = 82;
  const studentsReady = 237;

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        {/* Enhanced Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-purple-400/80" />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              NEXT TRIP ENERGY
            </h3>
            <Flame className="w-5 h-5 text-pink-400/80" />
          </div>
          <p className="text-xs text-gray-400">Live hype meter</p>
        </div>

        {/* Energy Meter with better styling */}
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl" />
          
          {/* Meter Track */}
          <div className="relative h-10 bg-black/40 rounded-full overflow-hidden border border-purple-500/30 backdrop-blur-sm">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, purple 10px, purple 11px)`,
              }} />
            </div>

            {/* Meter Fill - More vibrant gradient */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${hypeLevel}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>

            {/* Enhanced Percentage Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {hypeLevel}% HYPED
              </span>
            </div>

            {/* Lightning Icon with glow */}
            {hypeLevel > 80 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Zap className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="flex flex-col items-center gap-2 mt-6">
          <div className="bg-purple-900/20 backdrop-blur-sm rounded-full px-6 py-2 border border-purple-500/20">
            <p className="text-sm">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {studentsReady}
              </span>
              <span className="text-gray-300 ml-2">students ready to party</span>
            </p>
          </div>
          <p className="text-xs text-gray-500">Filling up fast • Secure your spot</p>
        </div>
      </motion.div>
    </div>
  );
}