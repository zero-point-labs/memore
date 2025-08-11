'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { FileText, Plus, Edit, Trash2, Eye, TrendingUp, Globe, Clock } from 'lucide-react';
import { blogService } from '@/services/blogService';
import { BlogDocument, BLOG_CATEGORIES } from '@/types/blog';
import { cn } from '@/utils/cn';

export default function AdminBlogsPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, adminLoading, router]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const fetchedBlogs = await blogService.getBlogs({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        published: filter === 'published' ? true : filter === 'drafts' ? false : undefined,
      });
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchBlogs();
    }
  }, [isAdmin, filter, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(id);
        await fetchBlogs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await blogService.togglePublished(id, !currentStatus);
      await fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error toggling published status:', error);
      alert('Failed to update published status');
    }
  };

  const toggleTrending = async (id: string, currentStatus: boolean) => {
    try {
      await blogService.toggleTrending(id, !currentStatus);
      await fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Error toggling trending status:', error);
      alert('Failed to update trending status');
    }
  };

  const publishedBlogs = blogs.filter(blog => blog.published);
  const draftBlogs = blogs.filter(blog => !blog.published);
  const trendingBlogs = blogs.filter(blog => blog.trending);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Blog Management</h1>
            <p className="text-gray-400">Manage blog posts and content</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/blogs/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Plus size={18} />
            <span>New Blog Post</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{blogs.length}</div>
                <div className="text-sm text-gray-400">Total Posts</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{publishedBlogs.length}</div>
                <div className="text-sm text-gray-400">Published</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{draftBlogs.length}</div>
                <div className="text-sm text-gray-400">Drafts</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{trendingBlogs.length}</div>
                <div className="text-sm text-gray-400">Trending</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All Posts' },
                  { key: 'published', label: 'Published' },
                  { key: 'drafts', label: 'Drafts' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key as 'all' | 'published' | 'drafts')}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      filter === item.key
                        ? "bg-purple-600 text-white"
                        : "bg-black/30 text-gray-400 hover:bg-black/50 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-black/30 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Categories</option>
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Blog Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-purple-500/20">
            <h2 className="text-xl font-bold text-white">Blog Posts</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="text-gray-400">Loading blogs...</div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No blog posts found</p>
              <p className="text-gray-500 text-sm">Create your first blog post to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-purple-500/20">
              {blogs.map((blog) => (
                <div key={blog.$id} className="p-6 hover:bg-purple-500/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {blog.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {blog.trending && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </span>
                          )}
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded-full flex items-center gap-1",
                              blog.published
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            )}
                          >
                            {blog.published ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {blog.readTime} min read
                        </span>
                        <span>
                          Category: {BLOG_CATEGORIES.find(c => c.id === blog.category)?.label}
                        </span>
                        <span>
                          By: {blog.author.name}
                        </span>
                        <span>
                          {new Date(blog.$createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(`/blog/${blog.$id}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleTrending(blog.$id, blog.trending)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          blog.trending
                            ? "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                            : "text-gray-400 hover:text-orange-400 hover:bg-orange-500/10"
                        )}
                        title="Toggle Trending"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => togglePublished(blog.$id, blog.published)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          blog.published
                            ? "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            : "text-yellow-400 hover:text-green-400 hover:bg-green-500/10"
                        )}
                        title={blog.published ? "Unpublish" : "Publish"}
                      >
                        <Globe className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => router.push(`/admin/blogs/edit/${blog.$id}`)}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(blog.$id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}