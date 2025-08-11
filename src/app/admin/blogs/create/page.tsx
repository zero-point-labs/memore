'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import ImageUploadSimple from '@/components/ImageUploadSimple';
import { blogService } from '@/services/blogService';
import { BLOG_CATEGORIES, AUTHORS, CreateBlogData } from '@/types/blog';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function CreateBlogPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
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
    published: false, // Default to draft for new posts
  });
  const [tagInput, setTagInput] = useState('');

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
      alert('Please fill in the title, excerpt, and content fields');
      return;
    }

    try {
      setSaving(true);
      const createData: CreateBlogData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
      };

      await blogService.createBlog(createData);
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog post');
    } finally {
      setSaving(false);
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

  if (authLoading || adminLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    router.push('/admin');
    return null;
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
            <h1 className="text-2xl font-bold text-white">Create New Blog Post</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, published: false }))}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                !formData.published
                  ? "bg-yellow-600/20 text-yellow-300"
                  : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
              )}
            >
              <span>Save as Draft</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Creating...' : formData.published ? 'Create & Publish' : 'Create Draft'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title*</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter an engaging blog title..."
              />
            </div>

            {/* Excerpt */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt*</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                placeholder="Write a compelling summary that will make readers want to click..."
              />
            </div>

            {/* Content */}
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Content*</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-mono text-sm"
                placeholder="Start writing your amazing blog content here...

# You can use markdown formatting like:
- **Bold text**
- *Italic text*
- ## Headings
- > Blockquotes
- [Links](url)

Remember to make it engaging and valuable for your readers!"
              />
              <p className="text-xs text-gray-500 mt-2">
                You can use markdown formatting. Line breaks will be preserved in the final post.
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
                  <label className="text-sm font-medium text-gray-300">Publish Immediately</label>
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
                  <label className="text-sm font-medium text-gray-300">Mark as Trending</label>
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
                
                {!formData.published && (
                  <p className="text-xs text-yellow-400 bg-yellow-400/10 rounded-lg p-3">
                    💡 This post will be saved as a draft. You can publish it later from the blogs list.
                  </p>
                )}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Read Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Roughly 200 words per minute</p>
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
              
              <p className="text-xs text-gray-500 mt-3">
                💡 Tip: Upload directly from your computer or paste a URL. Recommended size: 1200x630px
              </p>
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
                    <Plus size={16} />
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
                
                <p className="text-xs text-gray-500">
                  Add relevant tags to help readers find your content. Press Enter or click + to add.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}