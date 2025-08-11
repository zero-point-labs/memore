'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Heart, MessageCircle, Share2, User, Calendar } from 'lucide-react';
import { blogService } from '@/services/blogService';
import { BlogDocument, BLOG_CATEGORIES } from '@/types/blog';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogDocument[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (params.id) {
          const fetchedBlog = await blogService.getBlog(params.id as string);
          if (fetchedBlog && fetchedBlog.published) {
            setBlog(fetchedBlog);
            
            // Fetch related blogs
            const related = await blogService.getBlogs({
              category: fetchedBlog.category,
              published: true,
              limit: 3,
            });
            setRelatedBlogs(related.filter(b => b.$id !== fetchedBlog.$id));
          } else {
            router.push('/blog');
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id, router]);

  const handleLike = async () => {
    if (blog) {
      try {
        await blogService.updateEngagement(blog.$id, blog.likes + 1, blog.comments);
        setBlog({ ...blog, likes: blog.likes + 1 });
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or sharing failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog post not found</h1>
          <Link href="/blog" className="text-purple-400 hover:text-purple-300">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const category = BLOG_CATEGORIES.find(c => c.id === blog.category);

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
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to blog</span>
            </Link>
          </motion.div>

          {/* Blog Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Category */}
            {category && (
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${category.color} mb-6`}
              >
                {category.icon} {category.label}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{blog.author.avatar}</span>
                <div className="text-left">
                  <div className="text-white font-medium">{blog.author.name}</div>
                  <div className="text-sm">{blog.author.role}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{blog.readTime} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {blog.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="prose prose-lg prose-invert max-w-none"
            >
              <div className="text-gray-300 leading-relaxed markdown-content prose prose-lg prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold text-white mb-3 mt-5">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-lg font-bold text-white mb-2 mt-4">{children}</h4>,
                    p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="text-gray-100 italic">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 mb-4">{children}</blockquote>,
                    code: ({ children }) => <code className="bg-gray-800 text-purple-300 px-2 py-1 rounded text-sm">{children}</code>,
                    pre: ({ children }) => <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4 overflow-x-auto">{children}</pre>,
                    a: ({ href, children }) => <a href={href} className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            </motion.div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 pt-8 border-t border-purple-500/20"
              >
                <h4 className="text-white font-semibold mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Engagement Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-purple-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Heart size={20} />
                    <span>{blog.likes}</span>
                  </button>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageCircle size={20} />
                    <span>{blog.comments}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 border-t border-purple-500/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Related Posts
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog, index) => (
                  <motion.div
                    key={relatedBlog.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <Link href={`/blog/${relatedBlog.$id}`}>
                      <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all group">
                        <img
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-6">
                          <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {relatedBlog.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{relatedBlog.readTime} min read</span>
                            <span>{new Date(relatedBlog.$createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}