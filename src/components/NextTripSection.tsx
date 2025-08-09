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

// Student Reviews
const studentReviews = [
  {
    id: 1,
    name: 'Emma Thompson',
    university: 'University of Manchester',
    rating: 5,
    review: 'Absolutely insane 3 days! The beach parties were unreal and Lora helped us skip every queue. Already planning my next trip!',
    avatar: '👩‍🎓',
    tripDate: 'July 2023',
  },
  {
    id: 2,
    name: 'Jake Wilson',
    university: 'Kings College London',
    rating: 5,
    review: 'Best uni trip ever! The VIP treatment at every club, yacht parties, and cliff jumping - literally everything was perfect.',
    avatar: '👨‍🎓',
    tripDate: 'August 2023',
  },
  {
    id: 3,
    name: 'Sophia Chen',
    university: 'UCL',
    rating: 5,
    review: 'Met so many amazing people! The sunset boat party was magical. Lora made everything so easy - just had to show up and party!',
    avatar: '👩‍💼',
    tripDate: 'June 2023',
  },
  {
    id: 4,
    name: 'Alex Martinez',
    university: 'University of Edinburgh',
    rating: 5,
    review: 'Cyprus with this crew hits different! Every moment was Instagram-worthy. The villa parties were next level 🔥',
    avatar: '🧑‍🎓',
    tripDate: 'July 2023',
  },
  {
    id: 5,
    name: 'Mia Anderson',
    university: 'University of Bristol',
    rating: 5,
    review: 'Worth every penny! VIP everywhere, no waiting, just pure vibes. The group chat before the trip got everyone hyped!',
    avatar: '👩‍🎤',
    tripDate: 'August 2023',
  },
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
  // const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);

  // Prevent flash by ensuring component is mounted
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % studentReviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
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

            {/* Student Reviews Carousel */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-20"
            >
              {/* Section Title */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  What Students Are Saying
                </h3>
                <p className="text-gray-400">Real experiences from the Cyprus squad</p>
              </div>

              {/* Review Carousel Container */}
              <div className="relative max-w-4xl mx-auto">
                {/* Reviews */}
                <div className="relative overflow-hidden">
                  <div className="flex transition-transform duration-500 ease-out"
                       style={{ transform: `translateX(-${currentReview * 100}%)` }}>
                    {studentReviews.map((review) => (
                      <div
                        key={review.id}
                        className="w-full flex-shrink-0 px-4"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 text-center relative overflow-hidden"
                        >
                          {/* Background Sparkles Effect */}
                          <div className="absolute inset-0 opacity-20">
                            <Sparkles density={15} color="#a855f7" speed={0.5} />
                          </div>
                          
                          {/* Quote Icon */}
                          <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 10 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute top-4 left-4 text-purple-500/20 text-6xl"
                          >
                            &quot;
                          </motion.div>
                          
                          {/* Rating Stars */}
                          <div className="flex justify-center gap-1 mb-4 relative z-10">
                            {[...Array(5)].map((_, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1 * i, type: "spring", stiffness: 200 }}
                                className="text-yellow-400 text-xl"
                              >
                                ⭐
                              </motion.span>
                            ))}
                          </div>
                          
                          {/* Review Text */}
                          <p className="text-gray-300 text-lg mb-6 italic relative z-10 max-w-2xl mx-auto">
                            &quot;{review.review}&quot;
                          </p>
                          
                          {/* Reviewer Info */}
                          <div className="flex items-center justify-center gap-4 relative z-10">
                            <motion.span 
                              className="text-4xl"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {review.avatar}
                            </motion.span>
                            <div className="text-left">
                              <p className="text-white font-semibold">{review.name}</p>
                              <p className="text-gray-400 text-sm">{review.university}</p>
                              <p className="text-purple-400 text-xs flex items-center gap-1">
                                <span>🌴</span> {review.tripDate}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentReview((prev) => (prev - 1 + studentReviews.length) % studentReviews.length)}
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 transition-colors pointer-events-auto"
                  >
                    ←
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentReview((prev) => (prev + 1) % studentReviews.length)}
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 transition-colors pointer-events-auto"
                  >
                    →
                  </motion.button>
                </div>

                {/* Manual Navigation Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {studentReviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentReview === index
                          ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-purple-500/30 hover:bg-purple-500/60"
                      )}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Submit Review Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 font-medium hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-500/50 transition-all duration-300 group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">✍️</span>
                    <span>Share Your Cyprus Story</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-purple-400"
                    >
                      →
                    </motion.span>
                  </motion.button>
                </motion.div>
              </div>
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