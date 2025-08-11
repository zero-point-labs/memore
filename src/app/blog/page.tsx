'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Eye, TrendingUp } from 'lucide-react';
import { blogService } from '@/services/blogService';
import { BlogDocument, BLOG_CATEGORIES } from '@/types/blog';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogDocument[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const fetchedBlogs = await blogService.getBlogs({
          published: true,
          limit: 50,
        });
        setBlogs(fetchedBlogs);
        setFilteredBlogs(fetchedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, selectedCategory, searchTerm]);

const categories = [
    { id: 'all', label: 'All Posts', icon: '📚' },
    ...BLOG_CATEGORIES,
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900/50 to-pink-950" />
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>
      
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Cyprus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Stories</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Discover insider tips, amazing experiences, and everything you need to know for your Cyprus adventure
            </p>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Loading amazing stories...</div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No stories found</div>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <p className="text-gray-400">
                  Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'}
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
                </p>
              </motion.div>

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, index) => (
    <motion.article
                    key={blog.$id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${blog.$id}`}>
                      <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 group-hover:transform group-hover:scale-[1.02]">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
        {/* Trending Badge */}
                          {blog.trending && (
                            <div className="absolute top-4 left-4">
                              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              Trending
                              </div>
          </div>
        )}

                          {/* Category Badge */}
                          <div className="absolute top-4 right-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${
                                BLOG_CATEGORIES.find(c => c.id === blog.category)?.color || 'from-gray-600 to-gray-700'
                              }`}
                            >
                              {BLOG_CATEGORIES.find(c => c.id === blog.category)?.label}
                            </span>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Read More Button */}
                          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm font-medium">Read Story</span>
                              <div className="flex items-center gap-2 text-white text-sm">
                                <Eye className="w-4 h-4" />
                                <span>Read</span>
                              </div>
                            </div>
                          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
                          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                            {blog.title}
                          </h2>

          {/* Excerpt */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            {blog.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                                className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md"
              >
                #{tag}
              </span>
            ))}
                            {blog.tags.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded-md">
                                +{blog.tags.length - 3} more
                              </span>
                            )}
          </div>

          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
            {/* Author */}
            <div className="flex items-center gap-2">
                              <span className="text-lg">{blog.author.avatar}</span>
              <div>
                                <p className="text-sm font-medium text-white">{blog.author.name}</p>
                                <p className="text-xs text-gray-400">{blog.author.role}</p>
              </div>
            </div>

                            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{blog.readTime} min</span>
            </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
          </div>
        </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}