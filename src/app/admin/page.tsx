'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, Lock } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loginAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!adminLoading && isAdmin) {
      router.push('/admin/blogs');
    }
  }, [isAdmin, adminLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = loginAdmin(password);
    if (success) {
      router.push('/admin/blogs');
    } else {
      setError('Invalid admin password');
    }
    setLoading(false);
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isAdmin) {
    return null; // Will redirect to /admin/blogs
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full mb-4"
            >
              <Shield className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Admin Access
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Enter admin password to continue</p>
          </div>

          {/* Password Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Enter admin password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {loading ? 'Verifying...' : 'Access Admin Panel'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-xs">
                Authorized personnel only
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}