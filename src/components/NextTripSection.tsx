'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
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
              // Homepage Layout: Swipable Trip Card centered
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
              </>
            ) : (
              // Subpage Layout: Gallery → Itinerary
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
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 max-w-4xl mx-auto"
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
