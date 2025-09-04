'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { isMobile } from '@/utils/isMobile';
import Mascot3D from '@/components/trip-elements/Mascot3D';
import TripImageCarousel from '@/components/trip-elements/TripImageCarousel';
// import TripAboutCard from '@/components/trip-elements/TripAboutCard';
import SwipableTripCard from '@/components/SwipableTripCard';
import BookingFormPopup from '@/components/BookingFormPopup';
import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import Sparkles from '@/components/ui/Sparkles';
import { cn } from '@/utils/cn';
import { tripService } from '@/services/tripService';
import { TripDocument } from '@/types/trip';

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


const TripSectionContent = ({ isHomepage, featuredTrip }: { isHomepage: boolean, featuredTrip: TripDocument }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  // Device detection for responsive rotation
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);
  
  // Responsive rotation: Both mobile and desktop start facing front (0)
  const rotation = useTransform(
    scrollYProgress, 
    [0, 1], 
    isMobileDevice ? [0, Math.PI * 2] : [0, Math.PI * 2]
  );

  const [selectedDay, setSelectedDay] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % studentReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="next-trip" ref={sectionRef} className="relative bg-black min-h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Meteors number={4} />
        </div>
        <div className="absolute inset-0">
          {/* Simplified background animations - fewer elements, longer durations for better performance */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/35 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-pink-500/20 via-purple-500/25 to-pink-500/20 rounded-full blur-[150px] hidden md:block"
          />
          {/* Static grid overlay - no animation to reduce performance load */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(purple 1px, transparent 1px), linear-gradient(90deg, purple 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
            }} />
          </div>
        </div>
        <div className="relative z-10 py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 relative"
            >
              <Sparkles 
                className="z-0" 
                density={25} 
                color="#ec4899" 
                speed={0.8}
                size={3}
              />
              <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 relative z-10">
                <span className="text-white">CYPRUS </span>
                <motion.span
                  className="text-transparent bg-clip-text"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ 
                    backgroundSize: '200% auto',
                    backgroundImage: 'linear-gradient(to right, #8b5cf6, #ec4899, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    textShadow: '0 0 20px rgba(236, 72, 153, 0.8)'
                  }}
                >
                  ADVENTURES
                </motion.span>
              </motion.h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
                Swipe through our incredible Cyprus experiences and find your perfect adventure
              </p>
            </motion.div>
{isHomepage ? (
              // Homepage Layout: Desktop - Side by side (Harley left, About right), Mobile - Original stacked order
              <>
                {/* Swipable Trip Card - Top Center, Large */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-center mb-16"
                >
                  <div className="w-full max-w-4xl">
                    <SwipableTripCard 
                      onBookingClick={() => setIsBookingPopupOpen(true)}
                    />
                  </div>
                </motion.div>

                {/* 3D Mascot - Centered Below */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col items-center mb-20"
                >
                  <div className="relative max-w-4xl w-full">
                    {/* 3D Mascot */}
                    <Mascot3D 
                      modelPath="/varley-queen-v2.glb" 
                      characterName="Harley Queen" 
                      scale={[2.0, 2.0, 2.0]} 
                      rotation={rotation} 
                    />
                  </div>

                  {/* Explore More Button - Below 3D Mascot */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="relative flex justify-center mt-8 z-20"
                  >
                      {/* Simplified Floating Particles around button */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Minimal orbiting particles */}
                        {Array.from({ length: 4 }).map((_, i) => {
                          const angle = (i / 4) * Math.PI * 2;
                          const radius = 90;
                          return (
                            <motion.div
                              key={`orbit-${i}`}
                              className="absolute"
                              style={{
                                left: '50%',
                                top: '50%',
                                width: 6,
                                height: 6,
                              }}
                              animate={{
                                x: [Math.cos(angle) * radius, Math.cos(angle + Math.PI * 2) * radius],
                                y: [Math.sin(angle) * radius, Math.sin(angle + Math.PI * 2) * radius],
                                opacity: [0.4, 0.8, 0.4],
                              }}
                              transition={{
                                duration: 8 + i,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.5,
                              }}
                            >
                              <div 
                                className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{
                                  boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)',
                                }}
                              />
                            </motion.div>
                          );
                        })}
                        
                        {/* Minimal floating sparkles */}
                        {Array.from({ length: 6 }).map((_, i) => {
                          const positions = [
                            { x: -50, y: -30 }, { x: 50, y: -30 }, 
                            { x: -70, y: 0 }, { x: 70, y: 0 },
                            { x: -50, y: 30 }, { x: 50, y: 30 }
                          ];
                          const pos = positions[i];
                          
                          return (
                            <motion.div
                              key={`sparkle-${i}`}
                              className="absolute"
                              style={{
                                left: '50%',
                                top: '50%',
                                fontSize: '12px',
                                color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f472b6' : '#8b5cf6',
                                textShadow: `0 0 8px currentColor`,
                              }}
                              animate={{
                                x: [pos.x * 0.8, pos.x * 1.2, pos.x * 0.8],
                                y: [pos.y * 0.8, pos.y * 1.2, pos.y * 0.8],
                                opacity: [0.3, 0.9, 0.3],
                                scale: [0.8, 1.1, 0.8],
                              }}
                              transition={{
                                duration: 4 + (i % 2),
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut",
                              }}
                            >
                              ✨
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      <motion.a
                        href="/next-trip"
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-semibold text-lg shadow-2xl hover:from-purple-600/40 hover:to-pink-600/40 hover:border-purple-400/70 hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden z-10"
                      >
                        {/* Animated background gradient */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        {/* Icon with animation */}
                        <motion.span 
                          className="relative z-10 text-2xl"
                          animate={{ 
                            rotateY: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                        >
                          🌟
                        </motion.span>
                        
                        <span className="relative z-10">Explore More</span>
                        
                        {/* Animated arrow */}
                        <motion.span
                          className="relative z-10 text-purple-300 group-hover:text-white transition-colors"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                        
                        {/* Enhanced sparkle effects */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.3 }}
                        >
                          <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" />
                          <div className="absolute bottom-3 right-6 w-1 h-1 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                          <div className="absolute top-1/2 right-3 w-0.5 h-0.5 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                          <div className="absolute top-3 right-8 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
                        </motion.div>
                      </motion.a>
                    </motion.div>
                </motion.div>
                
                {/* Gallery Section - Below both columns */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-20"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">
                      <span className="text-white">Cyprus </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Adventure</span>
                      <span className="text-white"> Gallery</span>
                    </h3>
                    <p className="text-gray-400">Get a taste of what awaits you in paradise</p>
                  </div>
                  <TripImageCarousel 
                    images={featuredTrip.gallery} 
                    className="max-w-full sm:max-w-lg lg:max-w-2xl mx-auto" 
                  />
                </motion.div>
              </>
            ) : (
              // Subpage Layout: Gallery → 3D Mascot + Itinerary
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-20"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">
                      <span className="text-white">Cyprus </span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Adventure</span>
                      <span className="text-white"> Gallery</span>
                    </h3>
                    <p className="text-gray-400">Get a taste of what awaits you in paradise</p>
                  </div>
                  <TripImageCarousel 
                    images={featuredTrip.gallery} 
                    className="max-w-full sm:max-w-lg lg:max-w-2xl mx-auto" 
                  />
                </motion.div>
                
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <Mascot3D rotation={rotation} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">Trip Itinerary</h3>
                    <div className="flex gap-4 mb-8 overflow-x-auto">
                      {featuredTrip.itinerary.map((day, index) => (
                        <motion.button
                          key={day.day}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDay(index)}
                          className={cn(
                            "px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap",
                            selectedDay === index
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                              : "bg-black/40 border border-purple-500/30 text-gray-300 hover:border-purple-500/50"
                          )}
                        >
                          {day.day}
                        </motion.button>
                      ))}
                    </div>
                    {featuredTrip.itinerary.length > 0 && featuredTrip.itinerary[selectedDay] && (
                      <motion.div
                        key={selectedDay}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6"
                      >
                        <h4 className="text-xl font-bold text-purple-400 mb-4">
                          {featuredTrip.itinerary[selectedDay].title}
                        </h4>
                        {featuredTrip.itinerary[selectedDay].theme && (
                          <p className="text-gray-400 mb-4 italic">
                            {featuredTrip.itinerary[selectedDay].theme}
                          </p>
                        )}
                        <div className="space-y-4">
                          {featuredTrip.itinerary[selectedDay].items.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.3 }}
                              className="flex items-start gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                            >
                              <span className="text-2xl flex-shrink-0">{item.icon}</span>
                              <div className="flex-1">
                                <p className="text-purple-300 font-semibold">{item.time}</p>
                                <p className="text-gray-300 font-medium">{item.activity}</p>
                                {item.description && (
                                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                                )}
                                {item.included && item.included.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.included.map((include, i) => (
                                      <span
                                        key={i}
                                        className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full"
                                      >
                                        ✓ {include}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </>
            )}
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
                onClick={() => setIsBookingPopupOpen(true)}
                className="relative px-6 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white text-sm sm:text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 overflow-hidden group"
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
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                Only <NumberTicker value={featuredTrip.availability.spotsRemaining} className="text-purple-400 font-bold" /> spots left 
                {featuredTrip.pricing.earlyBird && featuredTrip.pricing.earlyBird.deadline && (
                  <span> • Early bird pricing ends {new Date(featuredTrip.pricing.earlyBird.deadline).toLocaleDateString()}</span>
                )}
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  What Students Are Saying
                </h3>
                <p className="text-gray-400 text-lg">Real experiences from the Cyprus squad</p>
              </div>
              <div className="relative max-w-4xl mx-auto">
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
                          <div className="absolute inset-0 opacity-20">
                            <Sparkles density={15} color="#a855f7" speed={0.5} />
                          </div>
                          <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 10 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute top-4 left-4 text-purple-500/20 text-6xl"
                          >
                            &ldquo;
                          </motion.div>
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
                          <p className="text-gray-300 text-lg mb-6 italic relative z-10 max-w-2xl mx-auto">
                            &ldquo;{review.review}&rdquo;
                          </p>
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
          </div>
        </div>
        <BookingFormPopup 
          isOpen={isBookingPopupOpen}
          onClose={() => setIsBookingPopupOpen(false)}
        />
      </section>
  );
}

export default function NextTripSection({ isHomepage = false }: { isHomepage?: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredTrip, setFeaturedTrip] = useState<TripDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextTrip = async () => {
      try {
        const trip = await tripService.getNextTrip();
        setFeaturedTrip(trip);
      } catch (error) {
        console.error('Error fetching next trip:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNextTrip();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded || loading) {
    return (
      <section className="relative bg-black min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-purple-400">Loading trip data...</div>
        </div>
      </section>
    );
  }

  if (!featuredTrip) {
    return (
      <section className="relative bg-black min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-purple-400 text-xl mb-4">No featured trip available</div>
            <div className="text-gray-400">Check back soon for our next amazing adventure!</div>
          </div>
        </div>
      </section>
    );
  }

  return <TripSectionContent isHomepage={isHomepage} featuredTrip={featuredTrip} />;
}
