'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NextTripLink from '@/components/NextTripLink';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  School,
  Save,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Search,
  Home,
  Compass
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { StudentStatus } from '@/types/booking';

// Country data for phone numbers
const countries = [
  { code: '+357', name: 'Cyprus', flag: '🇨🇾', key: 'CY' },
  { code: '+30', name: 'Greece', flag: '🇬🇷', key: 'GR' },
  { code: '+1', name: 'United States', flag: '🇺🇸', key: 'US' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', key: 'GB' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', key: 'DE' },
  { code: '+33', name: 'France', flag: '🇫🇷', key: 'FR' },
];

// Cyprus Universities
const cyprusUniversities = [
  'University of Cyprus',
  'Open University of Cyprus', 
  'Cyprus University of Technology',
  'Frederick University',
  'European University Cyprus',
  'University of Nicosia',
  'Neapolis University Paphos',
  'UCLan Cyprus',
  'American University of Cyprus',
  'University of Limassol',
  'Other'
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, updateProfile, createProfile, isProfileComplete } = useUserProfile();
  
  const [editing, setEditing] = useState(!isProfileComplete);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    phoneCountryCode: profile?.phoneCountryCode || '+357',
    university: profile?.university || '',
    studentStatus: (profile?.studentStatus || 'college') as StudentStatus,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (profile) {
        await updateProfile(formData);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        await createProfile(formData);
        setMessage({ type: 'success', text: 'Profile created successfully!' });
      }
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
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
              
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-white">My Profile</h1>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
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
              {/* Profile Completion Status */}
              {!isProfileComplete && (
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Complete Your Profile</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Complete your profile to unlock all booking features and receive important notifications.
                  </p>
                </div>
              )}

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
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-400" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-400" />
                      Contact Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-4 py-3 bg-gray-600/20 border border-gray-500/20 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Phone Number *</label>
                        <div className="flex gap-2">
                          <select
                            name="phoneCountryCode"
                            value={formData.phoneCountryCode}
                            onChange={handleInputChange}
                            disabled={!editing}
                            className="px-3 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                          >
                            {countries.map((country) => (
                              <option key={country.key} value={country.code} className="bg-black text-white">
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!editing}
                            placeholder="Enter phone number"
                            className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Information */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <School className="w-5 h-5 text-purple-400" />
                      Student Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Student Status *</label>
                        <select
                          name="studentStatus"
                          value={formData.studentStatus}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                          required
                        >
                          <option value="college" className="bg-black text-white">College/University Student</option>
                          <option value="youth" className="bg-black text-white">Youth (18-28, Not in College)</option>
                        </select>
                      </div>

                      {formData.studentStatus === 'college' && (
                        <div>
                          <label className="block text-white font-medium mb-2">University *</label>
                          <select
                            name="university"
                            value={formData.university}
                            onChange={handleInputChange}
                            disabled={!editing}
                            className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40 disabled:opacity-50"
                            required
                          >
                            <option value="" className="bg-black text-white">Select your university</option>
                            {cyprusUniversities.map((uni) => (
                              <option key={uni} value={uni} className="bg-black text-white">{uni}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {editing && (
                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setMessage(null);
                          // Reset form data
                          setFormData({
                            firstName: profile?.firstName || '',
                            lastName: profile?.lastName || '',
                            phone: profile?.phone || '',
                            phoneCountryCode: profile?.phoneCountryCode || '+357',
                            university: profile?.university || '',
                            studentStatus: (profile?.studentStatus || 'college') as StudentStatus,
                          });
                        }}
                        className="px-6 py-3 bg-gray-600 rounded-lg text-white font-medium hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      
                      <motion.button
                        type="submit"
                        disabled={saving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </motion.button>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 space-y-4"
            >
              <NextTripLink className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Compass className="w-5 h-5" />
                  Book Your Adventure
                </motion.button>
              </NextTripLink>

              <Link href="/" className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-gray-500/25 transition-all"
                >
                  <Home className="w-5 h-5" />
                  Go to Homepage
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
