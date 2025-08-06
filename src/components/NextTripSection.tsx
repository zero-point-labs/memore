'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import InteractiveCyprusMap from '@/components/trip-elements/InteractiveCyprusMap';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
// Removed AnimatedList - using static list instead
import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import Sparkles from '@/components/ui/Sparkles';
import { cn } from '@/utils/cn';

// Trip Stats
const tripStats = [
  { label: 'Students Joined', value: 500, icon: '👥' },
  { label: 'Activities Planned', value: 24, icon: '🎉' },
  { label: 'Locations', value: 4, icon: '📍' },
  { label: 'Hours of Fun', value: 72, icon: '⏰' },
];

// Daily Itinerary
const itinerary = [
  {
    day: 'Day 1',
    title: 'Arrival & Beach Vibes',
    items: [
      { time: '14:00', activity: 'Airport Pickup & Welcome', icon: '✈️' },
      { time: '16:00', activity: 'Check-in at Beachfront Hotel', icon: '🏨' },
      { time: '18:00', activity: 'Sunset Beach Party', icon: '🌅' },
      { time: '22:00', activity: 'VIP Club Night at Castle Club', icon: '🎊' },
    ]
  },
  {
    day: 'Day 2',
    title: 'Adventure & Culture',
    items: [
      { time: '09:00', activity: 'Breakfast & Recovery', icon: '☕' },
      { time: '11:00', activity: 'Water Sports & Cliff Jumping', icon: '🏄' },
      { time: '15:00', activity: 'Ancient Ruins Tour', icon: '🏛️' },
      { time: '20:00', activity: 'Traditional Cypriot Dinner', icon: '🍽️' },
      { time: '23:00', activity: 'Bar Crawl in Limassol', icon: '🍻' },
    ]
  },
  {
    day: 'Day 3',
    title: 'Boat Party & Farewell',
    items: [
      { time: '10:00', activity: 'Morning Boat Party', icon: '🚤' },
      { time: '14:00', activity: 'Beach Hopping', icon: '🏖️' },
      { time: '17:00', activity: 'Wine Tasting Experience', icon: '🍷' },
      { time: '20:00', activity: 'Farewell Dinner & Awards', icon: '🏆' },
    ]
  }
];

// Activities for orbiting circles
const activities = [
  { id: 1, name: 'Nightlife', icon: '🎉', color: 'from-purple-400 to-pink-400' },
  { id: 2, name: 'Beach', icon: '🏖️', color: 'from-blue-400 to-cyan-400' },
  { id: 3, name: 'Adventure', icon: '🚁', color: 'from-orange-400 to-red-400' },
  { id: 4, name: 'Culture', icon: '🏛️', color: 'from-green-400 to-emerald-400' },
];

export default function NextTripSection() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent flash by ensuring component is mounted
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <section className="relative bg-black min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          {/* Simple loading state with background */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-purple-400">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-black min-h-screen overflow-hidden">
        {/* Meteors Background - Very slow and subtle */}
        <div className="absolute inset-0 overflow-hidden">
          <Meteors number={4} />
        </div>

        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient Overlays */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/40 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.6, 1.0, 0.6],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/50 rounded-full blur-[120px]"
          />
          
          {/* Middle-top pink glow - Enhanced for better visibility */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-pink-500/70 to-purple-500/50 rounded-full blur-[120px]"
          />
          
          {/* Extra pink orb for mobile - Enhanced */}
          <motion.div
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.7, 1.0, 0.7],
            }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[450px] h-[350px] bg-gradient-to-t from-pink-500/80 to-purple-500/60 rounded-full blur-[100px] block md:hidden"
          />
          
          {/* Additional side glows for mobile */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 11, repeat: Infinity }}
            className="absolute top-1/3 -left-20 w-[300px] h-[500px] bg-gradient-to-r from-pink-500/60 to-purple-500/40 rounded-full blur-[100px] block md:hidden"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 13, repeat: Infinity }}
            className="absolute top-1/3 -right-20 w-[300px] h-[500px] bg-gradient-to-l from-pink-500/60 to-purple-500/40 rounded-full blur-[100px] block md:hidden"
          />
          
          {/* Desktop additional glow for more vibrancy */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 14, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-pink-500/30 via-purple-500/40 to-pink-500/30 rounded-full blur-[150px] hidden md:block"
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

        {/* Content */}
        <div className="relative z-10 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 relative"
            >
              {/* Sparkles around the title */}
              <Sparkles 
                className="z-0" 
                density={25} 
                color="#ec4899" 
                speed={0.8}
                size={3}
              />
              
              <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 relative z-10">
                <span className="text-white">CYPRUS ADVENTURE </span>
                <motion.span
                  className="text-transparent bg-clip-text"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ 
                    backgroundSize: '200% auto',
                    backgroundImage: 'linear-gradient(to right, #8b5cf6, #ec4899, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    textShadow: '0 0 20px rgba(236, 72, 153, 0.8)'
                  }}
                >
                  AWAITS
                </motion.span>
              </motion.h2>
              
              <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                3 days of non-stop action, from sunrise boat parties to sunset beach clubs. 
                Every moment designed for maximum memories.
              </p>
            </motion.div>

            {/* Stats Section with Number Tickers */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            >
              {tripStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center group hover:border-purple-500/40 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-2">
                    <NumberTicker value={stat.value} />
                    <span className="text-purple-400">+</span>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Cyprus Map with Orbiting Activities */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative flex items-center justify-center min-h-[500px]">
                  {/* Orbiting Activities */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {activities.map((activity, index) => (
                      <OrbitingCircles
                        key={activity.id}
                        className="h-[50px] w-[50px] border-purple-500/20 bg-black/30"
                        duration={30 + index * 8}
                        delay={index * 3}
                        radius={120 + index * 25}
                        reverse={index % 2 === 1}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-2xl">{activity.icon}</span>
                          <span className={cn(
                            "text-xs font-medium bg-gradient-to-r bg-clip-text text-transparent",
                            activity.color
                          )}>
                            {activity.name}
                          </span>
                        </div>
                      </OrbitingCircles>
                    ))}
                  </div>
                  
                  {/* Cyprus Map in Center */}
                  <div className="relative z-10 w-full max-w-md">
                    <InteractiveCyprusMap />
                  </div>
                </div>
              </motion.div>

              {/* Right: Animated Itinerary */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Trip Itinerary</h3>
                
                {/* Day Selector */}
                <div className="flex gap-4 mb-8">
                  {itinerary.map((day, index) => (
                    <motion.button
                      key={day.day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDay(index)}
                      className={cn(
                        "px-6 py-3 rounded-full font-semibold transition-all duration-300",
                        selectedDay === index
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-black/40 border border-purple-500/30 text-gray-300 hover:border-purple-500/50"
                      )}
                    >
                      {day.day}
                    </motion.button>
                  ))}
                </div>

                {/* Day Details */}
                <motion.div
                  key={selectedDay}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
                >
                  <h4 className="text-xl font-bold text-purple-400 mb-4">
                    {itinerary[selectedDay].title}
                  </h4>
                  
                  <div className="space-y-4">
                    {itinerary[selectedDay].items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-purple-300 font-semibold">{item.time}</p>
                          <p className="text-gray-300">{item.activity}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
                <span className="relative z-10">RESERVE YOUR ADVENTURE NOW</span>
              </motion.button>
              
              <motion.p 
                className="text-gray-400 text-sm mt-4"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Only <NumberTicker value={12} className="text-purple-400 font-bold" /> spots left • Early bird pricing ends soon
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
  );
}