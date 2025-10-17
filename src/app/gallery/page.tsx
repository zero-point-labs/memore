'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Users, Heart, Eye, Share2, Download, Search, Grid, List, Play, X, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
import BlurFade from '@/components/ui/BlurFade';
import { cn } from '@/utils/cn';

// Extended Gallery Categories - Cyprus Locations
const categories = [
  { id: 'all', label: 'All Memories', icon: '✨', count: 234 },
  { id: 'ayia-napa', label: 'Ayia Napa', icon: '🏖️', count: 67 },
  { id: 'protaras', label: 'Protaras', icon: '🌊', count: 45 },
  { id: 'limassol', label: 'Limassol', icon: '🏛️', count: 89 },
  { id: 'nicosia', label: 'Nicosia', icon: '🏰', count: 34 },
  { id: 'paphos', label: 'Paphos', icon: '🏺', count: 28 },
  { id: 'troodos', label: 'Troodos', icon: '⛰️', count: 23 },
  { id: 'larnaca', label: 'Larnaca', icon: '✈️', count: 41 },
  { id: 'lofou', label: 'Lofou', icon: '🏘️', count: 15 },
  { id: 'kyrenia', label: 'Kyrenia', icon: '🏔️', count: 18 },
];

// Extended Gallery Items with more metadata
const galleryItems = [
  {
    id: 1,
    category: 'ayia-napa',
    type: 'image',
    src: '/gallery/nissibeach.jpg',
    title: 'Golden Hour at Nissi Beach',
    location: 'Ayia Napa',
    date: 'July 15, 2023',
    time: '19:30',
    likes: 342,
    views: 1250,
    attendees: 45,
    photographer: 'Alex Chen',
    tags: ['sunset', 'beach', 'friends', 'memories'],
    description: 'The most incredible sunset with the entire group. The golden light reflecting off the crystal clear waters was absolutely magical.',
  },
  {
    id: 2,
    category: 'limassol',
    type: 'image',
    src: '/gallery/castleclub.jpg',
    thumbnail: '/gallery/castleclub.jpg',
    title: 'VIP Night at Castle Club',
    location: 'Limassol',
    date: 'July 16, 2023',
    time: '23:45',
    likes: 567,
    views: 2340,
    attendees: 120,
    photographer: 'Sarah Johnson',
    tags: ['club', 'vip', 'dancing', 'nightlife'],
    description: 'Epic night at Cyprus\' hottest club! The energy was unreal and everyone was on the dance floor until sunrise.',
    duration: '0:45',
  },
  {
    id: 3,
    category: 'ayia-napa',
    type: 'image',
    src: '/gallery/cliffjump.jpg',
    title: 'Cliff Jumping Adventures',
    location: 'Cape Greco, Ayia Napa',
    date: 'July 17, 2023',
    time: '14:20',
    likes: 423,
    views: 1890,
    attendees: 30,
    photographer: 'Mike Rodriguez',
    tags: ['adrenaline', 'cliff', 'jumping', 'courage'],
    description: 'Nothing beats the rush of jumping off 15-meter cliffs into the crystal blue Mediterranean!',
  },
  {
    id: 4,
    category: 'limassol',
    type: 'image',
    src: '/gallery/kourion.jpg',
    title: 'Exploring Ancient Kourion',
    location: 'Limassol District',
    date: 'July 18, 2023',
    time: '11:00',
    likes: 289,
    views: 980,
    attendees: 25,
    photographer: 'Elena Dimitriou',
    tags: ['history', 'ancient', 'architecture', 'culture'],
    description: 'Walking through 2000-year-old ruins and connecting with Cyprus\' incredible ancient history.',
  },
  {
    id: 5,
    category: 'larnaca',
    type: 'image',
    src: '/gallery/yatch.avif',
    thumbnail: '/gallery/yatch.avif',
    title: 'Luxury Yacht Experience',
    location: 'Larnaca Bay',
    date: 'July 19, 2023',
    time: '16:00',
    likes: 678,
    views: 3200,
    attendees: 50,
    photographer: 'Chris Alexandrou',
    tags: ['yacht', 'luxury', 'sea', 'celebration'],
    description: 'Private yacht charter with the best crew ever! Dancing on deck with the Mediterranean as our backdrop.',
    duration: '1:20',
  },
  {
    id: 6,
    category: 'protaras',
    type: 'image',
    src: '/gallery/poolparty.jpg',
    title: 'Exclusive Pool Party',
    location: 'Private Villa, Protaras',
    date: 'July 20, 2023',
    time: '17:30',
    likes: 445,
    views: 1560,
    attendees: 80,
    photographer: 'Anna Petrou',
    tags: ['pool', 'villa', 'exclusive', 'summer'],
    description: 'Private villa pool party with the most amazing views and vibes. This is what Cyprus dreams are made of!',
  },
];

// View modes
const viewModes = [
  { id: 'grid', label: 'Grid View', icon: Grid },
  { id: 'list', label: 'List View', icon: List },
];

// Sort options
const sortOptions = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'most-liked', label: 'Most Liked' },
  { id: 'most-viewed', label: 'Most Viewed' },
];

// Gallery Item Component
function GalleryItem({ item, viewMode, onItemClick }: { 
  item: typeof galleryItems[0]; 
  viewMode: string;
  onItemClick: (item: typeof galleryItems[0]) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-6 p-6 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all duration-300 cursor-pointer"
        onClick={() => onItemClick(item)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
          )}
          <Image
            src={item.src}
            alt={item.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error('Image failed to load:', item.src, e);
              setImageLoaded(true); // Still show the container even if image fails
            }}
          />
          {item.type === 'video' && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="flex-shrink-0 ml-2"
            >
              <Heart className={cn("w-5 h-5 transition-colors", isLiked ? "text-red-500 fill-red-500" : "text-gray-400")} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {item.date}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {item.attendees}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm line-clamp-2 mb-3">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {item.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {item.views}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-purple-500/20 rounded-md text-purple-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group cursor-pointer"
      onClick={() => onItemClick(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
          )}
          
          <Image
            src={item.src}
            alt={item.title}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error('Image failed to load:', item.src, e);
              setImageLoaded(true); // Still show the container even if image fails
            }}
          />

          {/* Video indicator */}
          {item.type === 'video' && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full p-2">
              <Play className="w-4 h-4 text-white" />
            </div>
          )}

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
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Heart className={cn("w-4 h-4", isLiked ? "text-red-500 fill-red-500" : "text-white")} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </motion.button>
                </div>

                {/* Hover Stats */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-4 text-white/80 text-sm mb-2">
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
                  <p className="text-white text-sm line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {item.date.split(',')[0]}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-purple-500/20 rounded-md text-purple-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Modal Component for detailed view
function MediaModal({ item, isOpen, onClose }: {
  item: typeof galleryItems[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);

  if (!item || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-2xl bg-black/80 border border-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="grid lg:grid-cols-2 h-full">
            {/* Media */}
            <div className="relative bg-black flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
              {item.type === 'video' ? (
                <div className="w-full h-full relative">
                  <Image
                    src={item.thumbnail || item.src}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Details */}
            <div className="p-8 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{item.title}</h2>
                  <p className="text-gray-400">{item.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Location</span>
                    <p className="text-white flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date</span>
                    <p className="text-white flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Photographer</span>
                    <p className="text-white">{item.photographer}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Attendees</span>
                    <p className="text-white flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {item.attendees} people
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex items-center gap-2 hover:text-red-400 transition-colors"
                    >
                      <Heart className={cn("w-5 h-5", isLiked ? "text-red-500 fill-red-500" : "text-gray-400")} />
                      <span className="text-white">{item.likes}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye className="w-5 h-5" />
                    <span>{item.views}</span>
                  </div>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>

                <div>
                  <span className="text-gray-500 text-sm">Tags</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm px-3 py-1 bg-purple-500/20 rounded-full text-purple-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(galleryItems);
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Get current category info
  const currentCategory = categories.find(cat => cat.id === activeCategory) || categories[0];

  // Filter and sort items
  useEffect(() => {
    let filtered = galleryItems;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'most-liked':
          return b.likes - a.likes;
        case 'most-viewed':
          return b.views - a.views;
        default: // newest
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    setFilteredItems(filtered);
  }, [activeCategory, searchQuery, sortBy]);

  const handleItemClick = (item: typeof galleryItems[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown')) {
        setIsCategoryDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Meteors number={8} />
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 to-pink-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-purple-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16 relative">
            {/* Decorative Orbiting Elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none hidden lg:block">
              <OrbitingCircles
                className="h-[40px] w-[40px] border-purple-500/20"
                duration={20}
                delay={0}
                radius={150}
              >
                <span className="text-2xl">📸</span>
              </OrbitingCircles>
              <OrbitingCircles
                className="h-[40px] w-[40px] border-pink-500/20"
                duration={25}
                delay={5}
                radius={180}
                reverse
              >
                <span className="text-2xl">🌟</span>
              </OrbitingCircles>
              <OrbitingCircles
                className="h-[40px] w-[40px] border-cyan-500/20"
                duration={30}
                delay={10}
                radius={210}
              >
                <span className="text-2xl">🎉</span>
              </OrbitingCircles>
            </div>

            <BlurFade delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6">
                <span className="text-white">CYPRUS </span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MEMORIES
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
                Relive every magical moment from our unforgettable Cyprus adventures. From sunrise to sunset, every memory captured.
              </p>
            </BlurFade>
          </div>

          {/* Stats */}
          <BlurFade delay={0.2}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { label: 'Total Photos', value: 1247, icon: '📸' },
                { label: 'Videos', value: 89, icon: '🎬' },
                { label: 'Happy Moments', value: 2456, icon: '😊' },
                { label: 'Memories Created', value: 9999, icon: '✨' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20"
                >
                  <span className="text-4xl mb-3 block">{stat.icon}</span>
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

      {/* Filters and Controls */}
      <section className="relative py-8 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-purple-500/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
              />
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={cn(
                    "p-3 rounded-lg transition-colors",
                    viewMode === mode.id
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  )}
                >
                  <mode.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id} className="bg-black">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Category Filter - Mobile First Dropdown */}
      <section className="relative py-8 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <BlurFade delay={0.1}>
            <div className="flex justify-center mb-8">
              <div className="relative w-full max-w-sm category-dropdown z-50">
                {/* Dropdown Button */}
                <motion.button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{currentCategory.icon}</span>
                    <span className="font-medium">{currentCategory.label}</span>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                      {currentCategory.count}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isCategoryDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isCategoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-xl shadow-2xl z-[9999] overflow-hidden"
                    >
                      <div className="max-h-80 overflow-y-auto">
                        {categories.map((category, index) => (
                          <motion.button
                            key={category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              setActiveCategory(category.id);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors",
                              activeCategory === category.id
                                ? "bg-purple-600/20 text-purple-300"
                                : "text-gray-300 hover:text-white"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{category.icon}</span>
                              <span className="font-medium">{category.label}</span>
                            </div>
                            <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded-full">
                              {category.count}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-2xl font-bold text-white mb-2">No memories found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <motion.div
              layout
              className={cn(
                "gap-6",
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-6"
              )}
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <GalleryItem 
                    key={item.id} 
                    item={item} 
                    viewMode={viewMode}
                    onItemClick={handleItemClick}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Media Modal */}
      <MediaModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
}