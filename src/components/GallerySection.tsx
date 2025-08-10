'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
import BlurFade from '@/components/ui/BlurFade';
import { cn } from '@/utils/cn';
import { Calendar, MapPin, Users, Heart, Eye, Share2 } from 'lucide-react';

// Gallery Categories
const categories = [
  { id: 'all', label: 'All Moments', icon: '✨' },
  { id: 'beach', label: 'Beach Vibes', icon: '🏖️' },
  { id: 'party', label: 'Night Life', icon: '🎉' },
  { id: 'adventure', label: 'Adventures', icon: '🏄' },
  { id: 'culture', label: 'Culture', icon: '🏛️' },
];

// Gallery Items with metadata
const galleryItems = [
  {
    id: 1,
    category: 'beach',
    image: '/gallery/nissibeach.jpg',
    title: 'Golden Hour at Nissi Beach',
    location: 'Ayia Napa',
    date: 'July 15',
    likes: 342,
    views: 1250,
    attendees: 45,
  },
  {
    id: 2,
    category: 'party',
    image: '/gallery/castleclub.jpg',
    title: 'VIP Night at Castle Club',
    location: 'Limassol',
    date: 'July 16',
    likes: 567,
    views: 2340,
    attendees: 120,
  },
  {
    id: 3,
    category: 'adventure',
    image: '/gallery/cliffjump.jpg',
    title: 'Cliff Jumping Adventures',
    location: 'Cape Greco',
    date: 'July 17',
    likes: 423,
    views: 1890,
    attendees: 30,
  },
  {
    id: 4,
    category: 'culture',
    image: '/gallery/kourion.jpg',
    title: 'Exploring Ancient Kourion',
    location: 'Limassol District',
    date: 'July 18',
    likes: 289,
    views: 980,
    attendees: 25,
  },
  {
    id: 5,
    category: 'beach',
    image: '/gallery/yatch.avif',
    title: 'Luxury Yacht Experience',
    location: 'Larnaca Bay',
    date: 'July 19',
    likes: 678,
    views: 3200,
    attendees: 50,
  },
  {
    id: 6,
    category: 'party',
    image: '/gallery/poolparty.jpg',
    title: 'Exclusive Pool Party',
    location: 'Private Villa',
    date: 'July 20',
    likes: 445,
    views: 1560,
    attendees: 80,
  },
];

// Gallery Item Component
function GalleryItem({ item, index }: { item: typeof galleryItems[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Check if image is already loaded (cached)
  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight !== 0) {
      setImageLoaded(true);
    }
  }, []);

  // Fallback timer to mark image as loaded if onLoad doesn't fire
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!imageLoaded && !imageError) {
        console.log(`Fallback loading for image: ${item.image}`);
        setImageLoaded(true);
      }
    }, 3000); // 3 second fallback

    return () => clearTimeout(timer);
  }, [imageLoaded, imageError, item.image]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm border border-purple-500/20">
        {/* Image Container */}
        <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
          {/* Placeholder gradient while loading */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
          )}
          
          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-gray-500/20 flex items-center justify-center">
              <span className="text-white/60 text-sm">Image not available</span>
            </div>
          )}
          
          {/* Actual Image */}
          <img
            ref={imgRef}
            src={item.image}
            alt={item.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-300",
              imageLoaded && !imageError ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
              console.error(`Failed to load image: ${item.image}`);
            }}
          />

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
              >
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </motion.button>
                </div>

                {/* Hover Stats */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <NumberTicker value={item.likes} className="text-white" />
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <NumberTicker value={item.views} className="text-white" />
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {item.attendees}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-white mb-2">{item.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {item.date}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState(galleryItems);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === categoryId));
    }
  };

  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Static Gradient Background - Performance Optimized */}
      <div className="absolute inset-0 z-0">
        {/* Static gradient orbs */}
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 to-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-purple-600/15 rounded-full blur-[120px]" />
        
        {/* Subtle meteor effect - limited for performance */}
        <div className="absolute inset-0">
          <Meteors number={10} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header with Orbiting Elements */}
        <div className="text-center mb-16 relative">
          {/* Decorative Orbiting Elements */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none hidden lg:block">
            <OrbitingCircles
              className="h-[30px] w-[30px] border-purple-500/20"
              duration={20}
              delay={0}
              radius={150}
            >
              <span className="text-lg">📸</span>
            </OrbitingCircles>
            <OrbitingCircles
              className="h-[30px] w-[30px] border-pink-500/20"
              duration={25}
              delay={5}
              radius={180}
              reverse
            >
              <span className="text-lg">🌟</span>
            </OrbitingCircles>
          </div>

          <BlurFade delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-white">EPIC </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MOMENTS
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Relive the unforgettable memories from our Cyprus adventures
            </p>
          </BlurFade>
        </div>

        {/* Category Filter */}
        <BlurFade delay={0.2}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-6 py-3 rounded-full font-medium transition-all duration-300",
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.label}
                </span>
              </motion.button>
            ))}
          </div>
        </BlurFade>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <GalleryItem key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats Section */}
        <BlurFade delay={0.4}>
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Memories', value: 2456, icon: '📸' },
              { label: 'Happy Students', value: 523, icon: '😊' },
              { label: 'Epic Parties', value: 47, icon: '🎉' },
              { label: 'Adventures', value: 89, icon: '🏄' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20"
              >
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <div className="text-3xl font-bold text-white mb-1">
                  <NumberTicker value={stat.value} />
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </BlurFade>


      </div>
    </section>
  );
}