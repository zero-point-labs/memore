'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TripImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  location: string;
}

// Trip images data with actual Cyprus adventure photos
const tripImages: TripImage[] = [
  {
    id: 1,
    src: '/trip images/Kandi-Beach-Party-Ayia-Napa-Event.jpg',
    alt: 'Beach Party at Ayia Napa',
    title: 'Beach Party Vibes',
    description: 'Epic sunset parties on the golden beaches of Ayia Napa',
    location: 'Ayia Napa Beach'
  },
  {
    id: 2,
    src: '/trip images/yatch.jpg',
    alt: 'Yacht Party Experience',
    title: 'Luxury Yacht Adventures',
    description: 'Private yacht parties with DJ and open bar in crystal waters',
    location: 'Mediterranean Sea'
  },
  {
    id: 3,
    src: '/trip images/lluxury-club.jpeg',
    alt: 'VIP Club Experience',
    title: 'VIP Club Access',
    description: 'Skip the lines and party like royalty at exclusive venues',
    location: 'Castle Club'
  },
  {
    id: 4,
    src: '/trip images/colture.jpg',
    alt: 'Ancient Cyprus Culture',
    title: 'Cultural Discoveries',
    description: 'Explore ancient ruins and immerse in Cypriot heritage',
    location: 'Kourion Ruins'
  },
  {
    id: 5,
    src: '/trip images/waterports.jpg',
    alt: 'Water Sports Adventure',
    title: 'Thrilling Water Sports',
    description: 'Jet skiing, parasailing, and cliff jumping adventures',
    location: 'Cape Greco'
  }
];

interface TripImageCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showDots?: boolean;
  className?: string;
}

export default function TripImageCarousel({
  autoPlay = true,
  autoPlayInterval = 4000,
  showControls = true,
  showDots = true,
  className
}: TripImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tripImages.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tripImages.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tripImages.length) % tripImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-black/20 border border-purple-500/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={tripImages[currentIndex].src}
                alt={tripImages[currentIndex].alt}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-3"
              >
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {tripImages[currentIndex].title}
                </h3>

                {/* Description */}
                <p className="text-gray-200 text-sm sm:text-base max-w-lg leading-relaxed">
                  {tripImages[currentIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {showControls && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all duration-200 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all duration-200 group"
            >
              <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Progress indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-white text-sm font-medium">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-gray-400 text-sm">/</span>
            <span className="text-gray-400 text-sm">
              {String(tripImages.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      {showDots && (
        <div className="flex justify-center gap-2 mt-6">
          {tripImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                currentIndex === index
                  ? "w-8 h-2 bg-gradient-to-r from-purple-500 to-pink-500"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Navigation (Optional) */}
      <div className="hidden lg:flex gap-3 mt-6 justify-center">
        {tripImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => goToSlide(index)}
            className={cn(
              "relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300",
              currentIndex === index
                ? "border-purple-500 scale-110"
                : "border-transparent opacity-60 hover:opacity-80"
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {currentIndex === index && (
              <div className="absolute inset-0 bg-purple-500/20" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}