'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function PreferencesPage() {
  const { user } = useAuth();
  const { profile, loading, updateCommunicationPreferences } = useUserProfile();
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [preferences, setPreferences] = useState({
    emailOptIn: profile?.emailOptIn ?? true,
    smsOptIn: profile?.smsOptIn ?? true,
    marketingOptIn: profile?.marketingOptIn ?? false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await updateCommunicationPreferences(preferences);
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
    } catch (error) {
      console.error('Error updating preferences:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update preferences' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              <Link href="/account" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                <span>Back to Account</span>
              </Link>
              
              <h1 className="text-xl font-bold text-white">Communication Preferences</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
            >
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${
                    message.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {message.type === 'success' ? 
                    <CheckCircle className="w-5 h-5" /> : 
                    <AlertCircle className="w-5 h-5" />
                  }
                  {message.text}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Email Preferences */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-purple-400" />
                      Email Notifications
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-black/30 rounded-lg">
                        <input
                          type="checkbox"
                          id="emailOptIn"
                          checked={preferences.emailOptIn}
                          onChange={() => handleToggle('emailOptIn')}
                          className="w-5 h-5 text-purple-600 bg-white/5 border-purple-500/20 rounded mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="emailOptIn" className="text-white font-medium cursor-pointer">
                            Essential Email Notifications
                          </label>
                          <p className="text-gray-400 text-sm mt-1">
                            Booking confirmations, payment receipts, and trip updates
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-black/30 rounded-lg">
                        <input
                          type="checkbox"
                          id="marketingOptIn"
                          checked={preferences.marketingOptIn}
                          onChange={() => handleToggle('marketingOptIn')}
                          className="w-5 h-5 text-purple-600 bg-white/5 border-purple-500/20 rounded mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="marketingOptIn" className="text-white font-medium cursor-pointer">
                            Marketing & Promotions
                          </label>
                          <p className="text-gray-400 text-sm mt-1">
                            Information about new trips, special offers, and exclusive deals
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SMS Preferences */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      SMS Notifications
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-black/30 rounded-lg">
                        <input
                          type="checkbox"
                          id="smsOptIn"
                          checked={preferences.smsOptIn}
                          onChange={() => handleToggle('smsOptIn')}
                          className="w-5 h-5 text-purple-600 bg-white/5 border-purple-500/20 rounded mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="smsOptIn" className="text-white font-medium cursor-pointer">
                            Important SMS Updates
                          </label>
                          <p className="text-gray-400 text-sm mt-1">
                            Payment reminders, trip updates, and urgent notifications
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Privacy & Data</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      We respect your privacy. You can change these preferences at any time. 
                      Essential notifications (booking confirmations, payment receipts) may still be sent 
                      for security and legal reasons.
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6">
                    <motion.button
                      type="submit"
                      disabled={saving}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
