'use client';

import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { TripDocument } from '@/types/trip';
import { useTripNavigation, getTripStatus, getTripPosition } from '@/hooks/useTripNavigation';
import { BorderBeam } from '@/components/magicui/border-beam';
import { cn } from '@/utils/cn';
import { isMobile } from '@/utils/isMobile';

interface SwipableTripCardProps {
  onBookingClick?: () => void;
  className?: string;
}

// Swipe threshold constants
const SWIPE_CONFIDENCE_THRESHOLD = 10000;

// Animation variants for smooth card transitions
const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? -15 : 15,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? -15 : 15,
  }),
};

// Swipe hint animation
const swipeHintVariants = {
  idle: { x: 0, opacity: 0.7 },
  hint: { 
    x: [0, 10, 0, -10, 0], 
    opacity: [0.7, 1, 0.7, 1, 0.7],
  },
};

function SwipeHints({ hasNext, hasPrevious }: { hasNext: boolean; hasPrevious: boolean }) {
  const [showHints, setShowHints] = useState(true);

  useEffect(() => {
    // Hide hints after 6 seconds or on first interaction
    const timer = setTimeout(() => setShowHints(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!showHints || isMobile()) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {hasPrevious && (
        <motion.div
          variants={swipeHintVariants}
          initial="idle"
          animate="hint"
          transition={{ 
            duration: 2, 
            repeat: 3,
            ease: "easeInOut" 
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg text-white text-sm">
            <ChevronLeft className="w-4 h-4" />
            <span>Swipe right for previous</span>
          </div>
        </motion.div>
      )}
      
      {hasNext && (
        <motion.div
          variants={swipeHintVariants}
          initial="idle"
          animate="hint"
          transition={{ 
            duration: 2, 
            repeat: 3,
            ease: "easeInOut" 
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg text-white text-sm">
            <span>Swipe left for next</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function NavigationDots({ 
  currentIndex, 
  totalTrips, 
  onDotClick 
}: { 
  currentIndex: number; 
  totalTrips: number; 
  onDotClick: (index: number) => void;
}) {
  if (totalTrips <= 1) return null;

  // Show max 7 dots, with current trip in center when possible
  const maxDots = 7;
  const startIndex = Math.max(0, Math.min(currentIndex - Math.floor(maxDots / 2), totalTrips - maxDots));
  const endIndex = Math.min(totalTrips, startIndex + maxDots);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {startIndex > 0 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDotClick(0)}
            className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
          />
          <span className="text-white/50 text-xs">...</span>
        </div>
      )}
      
      {Array.from({ length: endIndex - startIndex }, (_, i) => {
        const index = startIndex + i;
        const isActive = index === currentIndex;
        
        return (
          <motion.button
            key={index}
            onClick={() => onDotClick(index)}
            className={cn(
              "relative rounded-full transition-all duration-300",
              isActive 
                ? "w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500" 
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeDot"
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
      
      {endIndex < totalTrips && (
        <div className="flex items-center gap-1">
          <span className="text-white/50 text-xs">...</span>
          <button
            onClick={() => onDotClick(totalTrips - 1)}
            className="w-2 h-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
          />
        </div>
      )}
    </div>
  );
}

function DesktopNavigationButtons({ 
  hasNext, 
  hasPrevious, 
  onNext, 
  onPrevious 
}: {
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <>
      {/* Previous Button */}
      <AnimatePresence>
        {hasPrevious && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={onPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/80 hover:border-purple-500/50 transition-all duration-300 group hidden md:flex"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <AnimatePresence>
        {hasNext && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/80 hover:border-purple-500/50 transition-all duration-300 group hidden md:flex"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function TripStatusBadge({ trip }: { trip: TripDocument }) {
  const status = getTripStatus(trip);
  
  const statusConfig = {
    upcoming: { label: 'Upcoming', color: 'from-blue-500 to-cyan-500', icon: '🚀' },
    current: { label: 'Happening Now', color: 'from-green-500 to-emerald-500', icon: '🔥' },
    past: { label: 'Past Adventure', color: 'from-gray-500 to-slate-500', icon: '📸' },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r",
        config.color
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </motion.div>
  );
}

export default function SwipableTripCard({ onBookingClick, className }: SwipableTripCardProps) {
  const {
    currentTrip,
    currentTripIndex,
    totalTrips,
    hasNext,
    hasPrevious,
    isLoading,
    direction,
    allTrips,
    goToNext,
    goToPrevious,
    goToTrip
  } = useTripNavigation();

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobileDevice(isMobile());
  }, []);

  // Preload adjacent trip images for smoother transitions
  useEffect(() => {
    if (allTrips.length === 0) return;

    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    // Preload previous and next trip images
    if (hasPrevious && allTrips[currentTripIndex - 1]) {
      const prevTrip = allTrips[currentTripIndex - 1];
      const prevImage = Array.isArray(prevTrip.gallery) 
        ? (typeof prevTrip.gallery[0] === 'string' ? prevTrip.gallery[0] : prevTrip.gallery[0]?.url)
        : '';
      if (prevImage) preloadImage(prevImage);
    }
    if (hasNext && allTrips[currentTripIndex + 1]) {
      const nextTrip = allTrips[currentTripIndex + 1];
      const nextImage = Array.isArray(nextTrip.gallery) 
        ? (typeof nextTrip.gallery[0] === 'string' ? nextTrip.gallery[0] : nextTrip.gallery[0]?.url)
        : '';
      if (nextImage) preloadImage(nextImage);
    }
  }, [currentTripIndex, allTrips, hasNext, hasPrevious]);

  // Handle swipe gestures
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    // Left swipe (negative offset) = go to next trip
    // Right swipe (positive offset) = go to previous trip
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD && hasNext) {
      goToNext();
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD && hasPrevious) {
      goToPrevious();
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className={cn("relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-3xl overflow-hidden", className)}>
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-lg">Loading next adventure...</div>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className={cn("relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-3xl overflow-hidden", className)}>
        <div className="flex items-center justify-center h-96 text-center p-8">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">No Trips Available</h3>
            <p className="text-gray-300">Check back soon for amazing adventures!</p>
          </div>
        </div>
      </div>
    );
  }

  const tripPosition = getTripPosition(currentTrip, allTrips);

  return (
    <div className={cn("relative", className)}>
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-3xl overflow-hidden border-2 border-purple-400/40 backdrop-blur-sm">
        
        {/* Desktop Navigation Buttons */}
        <DesktopNavigationButtons 
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />

        {/* Swipe Hints */}
        <SwipeHints hasNext={hasNext} hasPrevious={hasPrevious} />


        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-600/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        </div>

        {/* Animated Card Content */}
        <div className="relative h-[550px] sm:h-[600px] md:h-[700px]">
          <AnimatePresence initial={false} custom={direction === 'next' ? 1 : -1}>
            <motion.div
              key={currentTrip.$id}
              custom={direction === 'next' ? 1 : -1}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
                rotateY: { duration: 0.2 },
              }}
              drag={isMobileDevice ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              {/* Background Image - More prominent */}
              <div className="absolute top-0 left-0 right-0 h-60 sm:h-72 md:h-96">
                <img
                  src={(() => {
                    if (!Array.isArray(currentTrip.gallery) || currentTrip.gallery.length === 0) return '';
                    const firstImage = currentTrip.gallery[0];
                    return typeof firstImage === 'string' ? firstImage : firstImage?.url || '';
                  })()}
                  alt={currentTrip.title}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80 rounded-t-3xl" />
                
                {/* Title and Status Badge - Bottom Right */}
                <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 xl:bottom-32 right-4 text-right">
                  <TripStatusBadge trip={currentTrip} />
                  <div className="mt-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">
                      {currentTrip.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
                
                {/* Position indicator - top right */}
                <div className="absolute top-6 right-6">
                  <div className="text-right text-white/80 text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                    {tripPosition.position} of {tripPosition.total}
                  </div>
                </div>

                {/* Spacer to push content below image */}
                <div className="h-64 sm:h-68 md:h-80 lg:h-96 xl:h-[28rem]"></div>

                {/* Main Content Section */}
                <div className="bg-black/50 backdrop-blur-md rounded-2xl p-3 sm:p-6 md:p-8 mt-4 relative z-20 border border-purple-500/20">
                  
                  {/* Description with Read More */}
                  <motion.div
                    key={currentTrip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4 sm:mb-6"
                  >
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      An incredible {currentTrip.duration}-day journey through the Mediterranean paradise...
                      <Link 
                        href={`/trip/${currentTrip.$id}`}
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium ml-1"
                      >
                        read more
                      </Link>
                    </p>
                  </motion.div>

                  {/* Date Display - Standalone */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    <div className="flex items-center gap-2 text-pink-400">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold text-sm">
                        {new Date(currentTrip.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} - {new Date(currentTrip.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </motion.div>

                  {/* Trip Details - Simplified Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 sm:mb-6"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Location */}
                      <div className="flex items-center gap-2 text-purple-400">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold text-sm">{currentTrip.location}</span>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-2 text-green-400">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold text-sm">
                          {currentTrip.availability.spotsRemaining} / {currentTrip.availability.totalSpots}
                        </span>
                      </div>
                    </div>
                  </motion.div>


                  {/* Pricing */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 sm:mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        €{currentTrip.pricing.standard || currentTrip.pricing.premium || 'TBA'}
                      </span>
                      <span className="text-gray-400 text-sm">per person</span>
                      {currentTrip.pricing.earlyBird && (
                        <div className="px-2 py-1 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border border-yellow-500/25 rounded-md">
                          <span className="text-yellow-400 text-xs font-medium">EARLY BIRD</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    {/* Main CTA Button - Dynamic Based on Trip Status */}
                    {(() => {
                      const status = getTripStatus(currentTrip);
                      
                      if (status === 'past') {
                        return (
                          <Link href={`/trip/${currentTrip.$id}`}>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-5 py-2.5 bg-gradient-to-r from-gray-600/80 to-slate-600/80 backdrop-blur-sm border border-gray-500/30 rounded-lg font-medium text-sm text-white hover:from-gray-600 hover:to-slate-600 hover:border-gray-400/50 transition-all duration-300"
                            >
                              View Gallery
                            </motion.button>
                          </Link>
                        );
                      } else if (status === 'current') {
                        return (
                          <Link href={`/book/${currentTrip.$id}`}>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-5 py-2.5 bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm border border-green-500/30 rounded-lg font-medium text-sm text-white hover:from-green-600 hover:to-emerald-600 hover:border-green-400/50 transition-all duration-300"
                            >
                              Join Now
                            </motion.button>
                          </Link>
                        );
                      } else {
                        // upcoming
                        return (
                          <Link href={`/trip/${currentTrip.$id}`} className="text-purple-300 hover:text-purple-200 transition-colors duration-200 text-sm font-medium">
                            More Details →
                          </Link>
                        );
                      }
                    })()}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Dots */}
      <NavigationDots 
        currentIndex={currentTripIndex}
        totalTrips={totalTrips}
        onDotClick={goToTrip}
      />
    </div>
  );
}
