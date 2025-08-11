'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import ImageUploadSimple from '@/components/ImageUploadSimple';
import { blogService } from '@/services/blogService';
import { BlogDocument, BLOG_CATEGORIES, AUTHORS, UpdateBlogData } from '@/types/blog';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function EditBlogPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState<BlogDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'tips' as 'tips' | 'experiences' | 'guides' | 'nightlife',
    author: AUTHORS[0] as typeof AUTHORS[number],
    image: '',
    tags: [] as string[],
    readTime: 5,
    trending: false,
    published: true,
  });
  const [tagInput, setTagInput] = useState('');

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

  useEffect(() => {
    const fetchBlog = async () => {
      if (params.id && isAdmin) {
        try {
          setLoading(true);
          const fetchedBlog = await blogService.getBlog(params.id as string);
          if (fetchedBlog) {
            setBlog(fetchedBlog);
            setFormData({
              title: fetchedBlog.title,
              content: fetchedBlog.content,
              excerpt: fetchedBlog.excerpt,
              category: fetchedBlog.category,
              author: AUTHORS.find(a => a.name === fetchedBlog.author.name) || AUTHORS[0],
              image: fetchedBlog.image,
              tags: fetchedBlog.tags,
              readTime: fetchedBlog.readTime,
              trending: fetchedBlog.trending,
              published: fetchedBlog.published,
            });
          } else {
            router.push('/admin/blogs');
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
          router.push('/admin/blogs');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBlog();
  }, [params.id, isAdmin, router]);

  const handleSave = async () => {
    if (!blog) return;

    try {
      setSaving(true);
      const updateData: UpdateBlogData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
      };

      await blogService.updateBlog(blog.$id, updateData);
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await blogService.deleteBlog(blog.$id);
        router.push('/admin/blogs');
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (authLoading || adminLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!blog) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Blog post not found</h1>
            <Link href="/admin/blogs" className="text-purple-400 hover:text-purple-300">
              ← Back to blogs
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-black p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blogs"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Blogs</span>
            </Link>
            <div className="w-px h-6 bg-purple-500/30" />
            <h1 className="text-2xl font-bold text-white">Edit Blog Post</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`/blog/${blog.$id}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              <Eye size={16} />
              <span>Preview</span>
            </button>
            
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter blog title..."
              />
            </div>

            {/* Excerpt */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                placeholder="Brief description of the blog post..."
              />
            </div>

            {/* Content */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-mono text-sm"
                placeholder="Write your blog content here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                You can use markdown formatting and line breaks will be preserved.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Published</label>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      formData.published ? "bg-purple-600" : "bg-gray-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formData.published ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">Trending</label>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, trending: !prev.trending }))}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      formData.trending ? "bg-orange-600" : "bg-gray-600"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formData.trending ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Category & Author */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Category & Author</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'tips' | 'experiences' | 'guides' | 'nightlife' }))}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  >
                    {BLOG_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                  <select
                    value={formData.author.name}
                    onChange={(e) => {
                      const author = AUTHORS.find(a => a.name === e.target.value) || AUTHORS[0];
                      setFormData(prev => ({ ...prev, author }));
                    }}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  >
                    {AUTHORS.map((author) => (
                      <option key={author.name} value={author.name}>
                        {author.avatar} {author.name} - {author.role}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Read Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Featured Image</h3>
              
              <ImageUploadSimple
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                aspectRatio="video"
              />
            </div>

            {/* Tags */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    className="flex-1 px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-purple-400 hover:text-purple-200 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}