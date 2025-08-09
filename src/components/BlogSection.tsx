'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Clock, Heart, MessageCircle, Bookmark, TrendingUp, Sparkles as SparklesIcon } from 'lucide-react';
import { Meteors } from '@/components/magicui/meteors';
import NumberTicker from '@/components/magicui/number-ticker';
import OrbitingCircles from '@/components/magicui/orbiting-circles';
import BlurFade from '@/components/ui/BlurFade';
import GlitchText from '@/components/hero-elements/GlitchText';
import { cn } from '@/utils/cn';

// Blog Categories
const categories = [
  { id: 'all', label: 'All Stories', icon: '📚', color: 'from-purple-600 to-pink-600' },
  { id: 'tips', label: 'Travel Tips', icon: '💡', color: 'from-blue-600 to-cyan-600' },
  { id: 'experiences', label: 'Experiences', icon: '🌟', color: 'from-yellow-600 to-orange-600' },
  { id: 'guides', label: 'City Guides', icon: '🗺️', color: 'from-green-600 to-emerald-600' },
  { id: 'nightlife', label: 'Nightlife', icon: '🎊', color: 'from-pink-600 to-rose-600' },
];

// Featured Authors
const authors = [
  { name: 'Lora AI', avatar: '🤖', role: 'Trip Planner' },
  { name: 'Alex Chen', avatar: '👨', role: 'Adventure Guide' },
  { name: 'Sofia Kyriakou', avatar: '👩', role: 'Local Expert' },
  { name: 'Marcus Johnson', avatar: '👱', role: 'Party Coordinator' },
];

// Blog Posts Data
const blogPosts = [
  {
    id: 1,
    category: 'tips',
    title: 'Ultimate Packing List for Cyprus Summer',
    excerpt: 'Everything you need for 3 days of sun, sea, and unforgettable parties. From beach essentials to club outfits.',
    author: authors[0],
    date: 'Mar 15, 2024',
    readTime: 5,
    likes: 234,
    comments: 42,
    trending: true,
    image: '☀️',
    tags: ['Packing', 'Summer', 'Essentials'],
  },
  {
    id: 2,
    category: 'nightlife',
    title: 'Top 10 Beach Clubs You Can\'t Miss',
    excerpt: 'From exclusive VIP lounges to wild beach raves, discover where the party never stops in Cyprus.',
    author: authors[3],
    date: 'Mar 12, 2024',
    readTime: 8,
    likes: 567,
    comments: 89,
    trending: true,
    image: '🏖️',
    tags: ['Clubs', 'VIP', 'Nightlife'],
  },
  {
    id: 3,
    category: 'guides',
    title: 'Hidden Gems of Ayia Napa',
    excerpt: 'Beyond the parties: secret beaches, local tavernas, and Instagram-worthy spots only locals know.',
    author: authors[2],
    date: 'Mar 10, 2024',
    readTime: 6,
    likes: 345,
    comments: 56,
    image: '🏝️',
    tags: ['Ayia Napa', 'Hidden Gems', 'Local'],
  },
  {
    id: 4,
    category: 'experiences',
    title: 'My First Cyprus Adventure: A Student\'s Story',
    excerpt: 'From nervous first-timer to Cyprus veteran - how one trip changed everything.',
    author: authors[1],
    date: 'Mar 8, 2024',
    readTime: 12,
    likes: 892,
    comments: 123,
    trending: true,
    image: '✈️',
    tags: ['Personal', 'Adventure', 'Story'],
  },
  {
    id: 5,
    category: 'tips',
    title: 'Budget Hacks: Party Like VIP on a Student Budget',
    excerpt: 'Smart tips to experience luxury without breaking the bank. Early bird deals, group discounts, and more.',
    author: authors[0],
    date: 'Mar 5, 2024',
    readTime: 7,
    likes: 456,
    comments: 67,
    image: '💰',
    tags: ['Budget', 'Tips', 'Savings'],
  },
  {
    id: 6,
    category: 'guides',
    title: 'Limassol After Dark: Complete Guide',
    excerpt: 'Navigate the nightlife capital like a pro. Best bars, clubs, and late-night eats mapped out.',
    author: authors[2],
    date: 'Mar 3, 2024',
    readTime: 10,
    likes: 678,
    comments: 91,
    image: '🌃',
    tags: ['Limassol', 'Nightlife', 'Guide'],
  },
];

// Blog Card Component
function BlogCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-300">
        {/* Trending Badge */}
        {post.trending && (
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-xs font-bold"
            >
              <TrendingUp className="w-3 h-3" />
              Trending
            </motion.div>
          </div>
        )}

        {/* Bookmark Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
        >
          <Bookmark 
            className={cn(
              "w-4 h-4 transition-colors",
              isBookmarked ? "text-purple-400 fill-purple-400" : "text-white/70"
            )} 
          />
        </motion.button>

        {/* Image/Icon Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className="text-6xl"
              animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {post.image}
            </motion.span>
          </div>
          
          {/* Hover Gradient Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category & Read Time */}
          <div className="flex items-center justify-between mb-3">
            <span className={cn(
              "text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r",
              categories.find(c => c.id === post.category)?.color,
              "text-white"
            )}>
              {categories.find(c => c.id === post.category)?.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {post.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* Author */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{post.author.avatar}</span>
              <div>
                <p className="text-sm font-medium text-white">{post.author.name}</p>
                <p className="text-xs text-gray-400">{post.date}</p>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <NumberTicker value={post.likes} className="text-gray-400" />
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments}
              </span>
            </div>
          </div>
        </div>

        {/* Read More Hover Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-purple-600/20 to-transparent"
            >
              <motion.button
                whileHover={{ x: 5 }}
                className="text-purple-300 text-sm font-medium flex items-center gap-2"
              >
                Read Full Story
                <span>→</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === categoryId));
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Top Separator Line */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>
      
      {/* Bottom Separator Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>
      
      {/* Gradient Background - Not Black! */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900/50 to-pink-950">
        {/* Static gradient orbs for depth */}
        <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/10 to-pink-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/10 to-purple-600/5 rounded-full blur-[100px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Limited meteors for ambiance */}
        <div className="absolute inset-0">
          <Meteors number={8} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 relative">
          {/* Decorative Orbiting Elements */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none hidden lg:block">
            <OrbitingCircles
              className="h-[35px] w-[35px] border-purple-500/20"
              duration={25}
              delay={0}
              radius={160}
            >
              <SparklesIcon className="w-4 h-4 text-purple-400" />
            </OrbitingCircles>
            <OrbitingCircles
              className="h-[35px] w-[35px] border-pink-500/20"
              duration={30}
              delay={7}
              radius={190}
              reverse
            >
              <span className="text-xl">✍️</span>
            </OrbitingCircles>
          </div>

          <BlurFade delay={0.1}>
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
                <GlitchText 
                  text="CYPRUS"
                  className="text-white"
                />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> STORIES</span>
              </h2>
            </motion.div>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Tips, guides, and unforgettable experiences from the Cyprus student community
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
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2",
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20"
                )}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </BlurFade>

        {/* Blog Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Upcoming Events - Smaller Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Upcoming Cyprus Events
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { date: 'Apr 15', title: 'Spring Break Takeover', location: 'Ayia Napa', spots: 12 },
                { date: 'May 2', title: 'Sunset Yacht Party', location: 'Limassol', spots: 8 },
                { date: 'May 20', title: 'Beach Club Weekend', location: 'Larnaca', spots: 15 },
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-purple-400 text-sm font-semibold">{event.date}</div>
                    <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {event.spots} spots left
                    </div>
                  </div>
                  <h4 className="text-white font-semibold mb-1">{event.title}</h4>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <span>📍</span> {event.location}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
              >
                View All Events →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}