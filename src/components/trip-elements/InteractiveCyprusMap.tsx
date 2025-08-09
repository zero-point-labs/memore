'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
// import { cn } from '@/utils/cn';

interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  activities: string[];
  icon: string;
}

const locations: Location[] = [
  {
    id: 'ayia-napa',
    name: 'Ayia Napa',
    x: 75,
    y: 55,
    activities: ['Beach Parties', 'Nightclubs', 'Water Sports'],
    icon: '🏖️'
  },
  {
    id: 'limassol',
    name: 'Limassol',
    x: 45,
    y: 65,
    activities: ['Bar Crawls', 'Wine Tasting', 'Cultural Tours'],
    icon: '🍷'
  },
  {
    id: 'paphos',
    name: 'Paphos',
    x: 15,
    y: 55,
    activities: ['Archaeological Sites', 'Cliff Diving', 'Sunset Views'],
    icon: '🏛️'
  },
  {
    id: 'larnaca',
    name: 'Larnaca',
    x: 60,
    y: 60,
    activities: ['Boat Parties', 'Beach Hopping', 'Local Cuisine'],
    icon: '🚤'
  }
];

export default function InteractiveCyprusMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Cyprus Map Image - now using PNG for background */}
        <div className="relative w-full h-auto" style={{ aspectRatio: '607.74/360.27' }}>
          <img
            src="/cyprus.png"
            alt="Map of Cyprus"
            className="w-full h-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.3)) saturate(1.2) brightness(1.08) contrast(1.08)' }}
            draggable={false}
          />
          {/* Overlay pins */}
          <svg
            viewBox="0 0 100 100"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            {locations.map((location) => (
              <g key={location.id}>
                {/* Pulsing circle background */}
                <motion.circle
                  cx={location.x}
                  cy={location.y}
                  r="3"
                  fill="rgba(139, 92, 246, 0.3)"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Location dot */}
                <motion.circle
                  cx={location.x}
                  cy={location.y}
                  r="2"
                  fill="#8b5cf6"
                  filter="url(#glow)"
                  className="cursor-pointer pointer-events-auto"
                  whileHover={{ scale: 1.5 }}
                  onMouseEnter={() => setHoveredLocation(location.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={() => setSelectedLocation(location)}
                />
                {/* Location icon */}
                <motion.text
                  x={location.x}
                  y={location.y - 5}
                  textAnchor="middle"
                  fontSize="4"
                  className="pointer-events-none select-none"
                  initial={{ y: location.y - 5 }}
                  animate={{
                    y: hoveredLocation === location.id ? location.y - 7 : location.y - 5,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {location.icon}
                </motion.text>
              </g>
            ))}
            {/* Glow filter definition */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Location tooltips */}
        <AnimatePresence>
          {hoveredLocation && !selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-10 bg-black/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-white border border-purple-500/50"
              style={{
                left: `${locations.find(l => l.id === hoveredLocation)?.x}%`,
                top: `${(locations.find(l => l.id === hoveredLocation)?.y || 0) - 15}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {locations.find(l => l.id === hoveredLocation)?.name}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Selected location details */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute inset-x-0 bottom-0 transform translate-y-full mt-8"
          >
            <div className="bg-black/80 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">{selectedLocation.icon}</span>
                  {selectedLocation.name}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="space-y-2">
                <p className="text-purple-400 text-sm font-semibold mb-2">Activities:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.activities.map((activity, index) => (
                    <motion.span
                      key={activity}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                    >
                      {activity}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}