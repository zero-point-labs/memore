'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Clock, Heart, MessageCircle, Bookmark, TrendingUp, Search, Filter, ArrowRight, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Meteors } from '@/components/magicui/meteors';

import OrbitingCircles from '@/components/magicui/orbiting-circles';
import BlurFade from '@/components/ui/BlurFade';
import GlitchText from '@/components/hero-elements/GlitchText';
import { cn } from '@/utils/cn';

// Extended Blog Categories
const categories = [
  { id: 'all', label: 'All Stories', icon: '📚', color: 'from-purple-600 to-pink-600', count: 47 },
  { id: 'tips', label: 'Travel Tips', icon: '💡', color: 'from-blue-600 to-cyan-600', count: 12 },
  { id: 'experiences', label: 'Experiences', icon: '🌟', color: 'from-yellow-600 to-orange-600', count: 18 },
  { id: 'guides', label: 'City Guides', icon: '🗺️', color: 'from-green-600 to-emerald-600', count: 8 },
  { id: 'nightlife', label: 'Nightlife', icon: '🎊', color: 'from-pink-600 to-rose-600', count: 9 },
];

// Featured Authors
const authors = [
  { 
    name: 'Lora AI', 
    avatar: '🤖', 
    role: 'AI Trip Planner',
    bio: 'Your intelligent travel companion with insights from thousands of Cyprus adventures.',
    posts: 15,
    followers: 2400
  },
  { 
    name: 'Alex Chen', 
    avatar: '👨', 
    role: 'Adventure Guide',
    bio: 'Professional adventure guide with 8 years of Cyprus exploration experience.',
    posts: 12,
    followers: 1890
  },
  { 
    name: 'Sofia Kyriakou', 
    avatar: '👩', 
    role: 'Local Expert',
    bio: 'Born and raised in Cyprus, sharing the best hidden gems and local secrets.',
    posts: 8,
    followers: 3200
  },
  { 
    name: 'Marcus Johnson', 
    avatar: '👱', 
    role: 'Party Coordinator',
    bio: 'Nightlife expert who knows every club, bar, and party scene in Cyprus.',
    posts: 10,
    followers: 1567
  },
];

// Extended Blog Posts Data
const blogPosts = [
  {
    id: 1,
    category: 'tips',
    title: 'Ultimate Packing List for Cyprus Summer',
    slug: 'ultimate-packing-list-cyprus-summer',
    excerpt: 'Everything you need for 3 days of sun, sea, and unforgettable parties. From beach essentials to club outfits.',
    content: `Planning a trip to Cyprus? Here's your complete packing guide for the ultimate Mediterranean adventure...`,
    author: authors[0],
    date: 'Mar 15, 2024',
    readTime: 5,
    likes: 234,
    comments: 42,
    views: 1890,
    trending: true,
    featured: true,
    image: '☀️',
    tags: ['Packing', 'Summer', 'Essentials', 'Tips'],
  },
  {
    id: 2,
    category: 'nightlife',
    title: 'Top 10 Beach Clubs You Can&apos;t Miss',
    slug: 'top-10-beach-clubs-cyprus',
    excerpt: 'From exclusive VIP lounges to wild beach raves, discover where the party never stops in Cyprus.',
    content: `Cyprus nightlife is legendary, and these beach clubs are where the magic happens...`,
    author: authors[3],
    date: 'Mar 12, 2024',
    readTime: 8,
    likes: 567,
    comments: 89,
    views: 3240,
    trending: true,
    featured: false,
    image: '🏖️',
    tags: ['Clubs', 'VIP', 'Nightlife', 'Beach'],
  },
  {
    id: 3,
    category: 'guides',
    title: 'Hidden Gems of Ayia Napa',
    slug: 'hidden-gems-ayia-napa',
    excerpt: 'Beyond the parties: secret beaches, local tavernas, and Instagram-worthy spots only locals know.',
    content: `Ayia Napa is famous for its nightlife, but there's so much more to discover...`,
    author: authors[2],
    date: 'Mar 10, 2024',
    readTime: 6,
    likes: 345,
    comments: 56,
    views: 2100,
    trending: false,
    featured: true,
    image: '🏝️',
    tags: ['Ayia Napa', 'Hidden Gems', 'Local', 'Beach'],
  },
  {
    id: 4,
    category: 'experiences',
    title: 'My First Cyprus Adventure: A Student\'s Story',
    slug: 'first-cyprus-adventure-student-story',
    excerpt: 'From nervous first-timer to Cyprus veteran - how one trip changed everything.',
    content: `I never expected Cyprus to change my life, but here's how it happened...`,
    author: authors[1],
    date: 'Mar 8, 2024',
    readTime: 12,
    likes: 892,
    comments: 123,
    views: 4560,
    trending: true,
    featured: true,
    image: '✈️',
    tags: ['Personal', 'Adventure', 'Story', 'Student'],
  },
  {
    id: 5,
    category: 'tips',
    title: 'Budget Hacks: Party Like VIP on a Student Budget',
    slug: 'budget-hacks-vip-student-budget',
    excerpt: 'Smart tips to experience luxury without breaking the bank. Early bird deals, group discounts, and more.',
    content: `You don't need to be rich to live like VIP in Cyprus. Here are my proven strategies...`,
    author: authors[0],
    date: 'Mar 5, 2024',
    readTime: 7,
    likes: 456,
    comments: 67,
    views: 2890,
    trending: false,
    featured: false,
    image: '💰',
    tags: ['Budget', 'Tips', 'Savings', 'VIP'],
  },
  {
    id: 6,
    category: 'guides',
    title: 'Limassol After Dark: Complete Guide',
    slug: 'limassol-after-dark-complete-guide',
    excerpt: 'Navigate the nightlife capital like a pro. Best bars, clubs, and late-night eats mapped out.',
    content: `Limassol transforms after sunset. Here's your complete guide to the city's nightlife...`,
    author: authors[2],
    date: 'Mar 3, 2024',
    readTime: 10,
    likes: 678,
    comments: 91,
    views: 3450,
    trending: false,
    featured: false,
    image: '🌃',
    tags: ['Limassol', 'Nightlife', 'Guide', 'Bars'],
  },
  {
    id: 7,
    category: 'experiences',
    title: 'Cliff Jumping at Cape Greco: Adrenaline Rush',
    slug: 'cliff-jumping-cape-greco-adrenaline',
    excerpt: 'The ultimate thrill-seeker\'s guide to Cyprus\' most epic cliff jumping spots.',
    content: `Standing on the edge of a 15-meter cliff, looking down at crystal blue waters...`,
    author: authors[1],
    date: 'Feb 28, 2024',
    readTime: 6,
    likes: 523,
    comments: 78,
    views: 2340,
    trending: false,
    featured: false,
    image: '🏔️',
    tags: ['Adventure', 'Cliff Jumping', 'Adrenaline', 'Cape Greco'],
  },
  {
    id: 8,
    category: 'tips',
    title: 'Cyprus Food Guide: What to Eat and Where',
    slug: 'cyprus-food-guide-what-eat-where',
    excerpt: 'From traditional meze to modern fusion, discover the flavors that make Cyprus special.',
    content: `Cyprus cuisine is a delicious blend of Greek, Turkish, and Middle Eastern influences...`,
    author: authors[2],
    date: 'Feb 25, 2024',
    readTime: 9,
    likes: 389,
    comments: 54,
    views: 1980,
    trending: false,
    featured: false,
    image: '🍽️',
    tags: ['Food', 'Cuisine', 'Local', 'Restaurants'],
  },
];

// Newsletter signup component
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
        <p className="text-gray-400">Get the latest Cyprus travel tips and adventure stories delivered to your inbox.</p>
      </div>
      
      {isSubscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <span className="text-4xl mb-4 block">✅</span>
          <h4 className="text-white font-bold mb-2">Welcome to the crew!</h4>
          <p className="text-gray-400">You&apos;ll receive our latest stories and tips soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
            required
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white"
          >
            Subscribe to Newsletter
          </motion.button>
        </form>
      )}
    </div>
  );
}

// Blog Card Component
function BlogCard({ post, featured = false }: { 
  post: typeof blogPosts[0]; 
  featured?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group lg:col-span-2 cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
          {/* Trending Badge */}
          {post.trending && (
            <div className="absolute top-6 left-6 z-10">
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
            className="absolute top-6 right-6 z-10 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
          >
            <Bookmark 
              className={cn(
                "w-5 h-5 transition-colors",
                isBookmarked ? "text-purple-400 fill-purple-400" : "text-white/70"
              )} 
            />
          </motion.button>

          <div className="grid lg:grid-cols-2">
            {/* Image/Icon Section */}
            <div className="relative h-64 lg:h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-8xl"
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
            <div className="p-8">
              {/* Category & Read Time */}
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r",
                  categories.find(c => c.id === post.category)?.color,
                  "text-white"
                )}>
                  {categories.find(c => c.id === post.category)?.label}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-gray-400 text-lg mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Author and stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{post.author.avatar}</span>
                  <div>
                    <p className="text-white font-medium">{post.author.name}</p>
                    <p className="text-gray-400 text-sm">{post.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </span>
                </div>
              </div>

              {/* Read More */}
              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300 transition-colors"
              >
                Read Full Article
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
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
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
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
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [showAuthors, setShowAuthors] = useState(false);

  // Filter posts based on category and search
  const handleFilter = () => {
    let filtered = blogPosts;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  };

  // Apply filters when dependencies change
  useState(() => {
    handleFilter();
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900/50 to-pink-950">
          <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/10 to-pink-600/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/10 to-purple-600/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0">
            <Meteors number={8} />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16 relative">
            {/* Decorative Orbiting Elements */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none hidden lg:block">
              <OrbitingCircles
                className="h-[40px] w-[40px] border-purple-500/20"
                duration={25}
                delay={0}
                radius={160}
              >
                <span className="text-2xl">✍️</span>
              </OrbitingCircles>
              <OrbitingCircles
                className="h-[40px] w-[40px] border-pink-500/20"
                duration={30}
                delay={7}
                radius={190}
                reverse
              >
                <span className="text-2xl">📖</span>
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
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black">
                  <GlitchText 
                    text="CYPRUS"
                    className="text-white"
                  />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> STORIES</span>
                </h1>
              </motion.div>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
                Discover insider tips, unforgettable experiences, and expert guides from the Cyprus adventure community
              </p>
            </BlurFade>
          </div>

          {/* Search and Filter */}
          <BlurFade delay={0.2}>
            <div className="max-w-4xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stories, tips, and guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-purple-500/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40"
                  />
                </div>
                
                {/* Authors Toggle */}
                <button
                  onClick={() => setShowAuthors(!showAuthors)}
                  className="px-6 py-4 bg-white/5 border border-purple-500/20 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <Filter className="w-5 h-5 inline mr-2" />
                  Authors
                </button>
              </div>

              {/* Authors Section */}
              <AnimatePresence>
                {showAuthors && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                  >
                    {authors.map((author) => (
                      <motion.div
                        key={author.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                      >
                        <div className="text-center">
                          <span className="text-4xl mb-3 block">{author.avatar}</span>
                          <h3 className="text-white font-bold mb-1">{author.name}</h3>
                          <p className="text-purple-400 text-sm mb-2">{author.role}</p>
                          <p className="text-gray-400 text-xs mb-3 line-clamp-2">{author.bio}</p>
                          <div className="flex justify-center gap-4 text-xs text-gray-400">
                            <span>{author.posts} posts</span>
                            <span>{author.followers} followers</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
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
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="relative py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <BlurFade delay={0.1}>
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Stories</h2>
            </BlurFade>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Blog Grid */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {regularPosts.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">📝</span>
              <h3 className="text-2xl font-bold text-white mb-2">No stories found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <BlurFade delay={0.1}>
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Latest Stories</h2>
              </BlurFade>
              
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}