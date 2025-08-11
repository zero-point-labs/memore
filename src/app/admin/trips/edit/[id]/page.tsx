'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Calendar, Users, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import TripGalleryManager from '@/components/TripGalleryManager';
import { tripService } from '@/services/tripService';
import { TRIP_CATEGORIES, UpdateTripData, TripItineraryDay, TripItineraryItem, TripDocument, TripGalleryImage } from '@/types/trip';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function EditTripPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const params = useParams();
  const tripId = params.id as string;
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [trip, setTrip] = useState<TripDocument | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    duration: 3,
    category: 'mixed' as 'beach-party' | 'cultural-tour' | 'adventure' | 'luxury' | 'mixed',
    highlights: [] as string[],
    whatsIncluded: [] as string[],
    whatsExcluded: [] as string[],
    gallery: [] as TripGalleryImage[],
    itinerary: [] as TripItineraryDay[],
    pricing: {
      standard: 0,
      premium: 0,
      vip: 0,
      currency: 'EUR',
      earlyBird: {
        price: 0,
        deadline: ''
      }
    },
    availability: {
      totalSpots: 50,
      spotsTaken: 0,
      spotsRemaining: 50,
      apartmentsAvailable: 10,
      apartmentCapacity: 5,
      waitingListCount: 0,
      bookingStatus: 'open' as 'open' | 'limited' | 'closed' | 'sold-out'
    },
    published: false,
  });

  // Input states for lists
  const [highlightInput, setHighlightInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [excludedInput, setExcludedInput] = useState('');

  // Fetch trip data
  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      
      try {
        const tripData = await tripService.getTrip(tripId);
        if (tripData) {
          setTrip(tripData);
          
          // Convert gallery format if needed (from string[] to TripGalleryImage[])
          let galleryData: TripGalleryImage[] = [];
          if (tripData.gallery) {
            galleryData = tripData.gallery.map((item, index) => {
              if (typeof item === 'string') {
                return {
                  id: `img-${index}-${Date.now()}`,
                  url: item,
                  title: '',
                  description: '',
                  altText: '',
                  order: index
                };
              }
              return item;
            });
          }
          
          // Populate form with existing data
          setFormData({
            title: tripData.title,
            description: tripData.description,
            location: tripData.location,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            duration: tripData.duration,
            category: tripData.category,
            highlights: tripData.highlights || [],
            whatsIncluded: tripData.whatsIncluded || [],
            whatsExcluded: tripData.whatsExcluded || [],
            gallery: galleryData,
            itinerary: tripData.itinerary || [],
            pricing: {
              standard: tripData.pricing?.standard || 0,
              premium: tripData.pricing?.premium || 0,
              vip: tripData.pricing?.vip || 0,
              currency: tripData.pricing?.currency || 'EUR',
              earlyBird: tripData.pricing?.earlyBird || { price: 0, deadline: '' }
            },
            availability: tripData.availability || {
              totalSpots: 50,
              spotsTaken: 0,
              spotsRemaining: 50,
              apartmentsAvailable: 10,
              apartmentCapacity: 5,
              waitingListCount: 0,
              bookingStatus: 'open'
            },
            published: tripData.published,
          });
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
        alert('Failed to load trip data');
        router.push('/admin/trips');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin && tripId) {
      fetchTrip();
    }
  }, [isAdmin, tripId, router]);

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

  const handleSave = async () => {
    if (!trip) return;
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      alert('Please fill in the title, description, and location fields');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert('Please select start and end dates');
      return;
    }

    try {
      setSaving(true);
      const updateData: UpdateTripData = {
        ...formData,
        gallery: formData.gallery.map(img => img.url),
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        whatsIncluded: formData.whatsIncluded.filter(i => i.trim() !== ''),
        whatsExcluded: formData.whatsExcluded.filter(e => e.trim() !== ''),
      };

      await tripService.updateTrip(trip.$id, updateData);
      router.push('/admin/trips');
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip');
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for managing lists
  const addToList = (listName: 'highlights' | 'whatsIncluded' | 'whatsExcluded', value: string) => {
    if (value.trim() && !formData[listName].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }));
    }
  };

  const removeFromList = (listName: 'highlights' | 'whatsIncluded' | 'whatsExcluded', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  // Itinerary management
  const addItineraryDay = () => {
    const newDay: TripItineraryDay = {
      day: `Day ${formData.itinerary.length + 1}`,
      date: '',
      title: '',
      theme: '',
      items: []
    };
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay]
    }));
  };

  const updateItineraryDay = (dayIndex: number, field: keyof TripItineraryDay, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const removeItineraryDay = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, index) => index !== dayIndex)
    }));
  };

  const addItineraryItem = (dayIndex: number) => {
    const newItem: TripItineraryItem = {
      time: '',
      activity: '',
      icon: '🌟',
      description: '',
      included: []
    };
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, items: [...day.items, newItem] } : day
      )
    }));
  };

  const updateItineraryItem = (dayIndex: number, itemIndex: number, field: keyof TripItineraryItem, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, dIndex) =>
        dIndex === dayIndex ? {
          ...day,
          items: day.items.map((item, iIndex) =>
            iIndex === itemIndex ? { ...item, [field]: value } : item
          )
        } : day
      )
    }));
  };

  const removeItineraryItem = (dayIndex: number, itemIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex ? {
          ...day,
          items: day.items.filter((_, iIndex) => iIndex !== itemIndex)
        } : day
      )
    }));
  };

  if (authLoading || adminLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading trip data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || !isAdmin || !trip) {
    return null;
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'pricing', label: 'Pricing & Availability', icon: Users },
    { id: 'media', label: 'Media & Gallery', icon: Plus },
  ];

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
              href="/admin/trips"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Trips</span>
            </Link>
            <div className="w-px h-6 bg-purple-500/30" />
            <h1 className="text-2xl font-bold text-white">Edit Trip: {trip.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                formData.published
                  ? "bg-green-600/20 text-green-300"
                  : "bg-yellow-600/20 text-yellow-300"
              )}
            >
              <span>{formData.published ? 'Published' : 'Draft'}</span>
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

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "bg-black/30 text-gray-400 hover:bg-black/50 hover:text-white"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title & Description */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trip Title*</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all mb-4"
                    placeholder="e.g., Cyprus Adventure 2024"
                  />
                  
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description*</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Describe the amazing experience students will have..."
                  />
                </div>

                {/* Location & Dates */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location*</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                        placeholder="e.g., Ayia Napa, Cyprus"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 3 }))}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date*</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">End Date*</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Trip Highlights</h3>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToList('highlights', highlightInput);
                          setHighlightInput('');
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm"
                      placeholder="Add a highlight..."
                    />
                    <button
                      onClick={() => {
                        addToList('highlights', highlightInput);
                        setHighlightInput('');
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center justify-between bg-purple-500/10 rounded-lg p-3">
                        <span className="text-gray-300">{highlight}</span>
                        <button
                          onClick={() => removeFromList('highlights', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
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
                    

                  </div>
                </div>

                {/* Category */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Category</h3>
                  
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'beach-party' | 'cultural-tour' | 'adventure' | 'luxury' | 'mixed' }))}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  >
                    {TRIP_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs will be completed next */}
          {activeTab === 'itinerary' && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Trip Itinerary</h3>
                <button
                  onClick={addItineraryDay}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Day
                </button>
              </div>

              {formData.itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-purple-400">{day.day}</h4>
                    <button
                      onClick={() => removeItineraryDay(dayIndex)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                      <input
                        type="text"
                        value={day.date}
                        onChange={(e) => updateItineraryDay(dayIndex, 'date', e.target.value)}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                        placeholder="e.g., Friday, May 24th"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                        placeholder="e.g., Arrival & Welcome Party"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                    <input
                      type="text"
                      value={day.theme}
                      onChange={(e) => updateItineraryDay(dayIndex, 'theme', e.target.value)}
                      className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                      placeholder="e.g., Welcome to Paradise"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-md font-medium text-white">Activities</h5>
                      <button
                        onClick={() => addItineraryItem(dayIndex)}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
                      >
                        <Plus size={14} />
                        Add Activity
                      </button>
                    </div>

                    {day.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-purple-500/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-400">Activity {itemIndex + 1}</span>
                          <button
                            onClick={() => removeItineraryItem(dayIndex, itemIndex)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Time</label>
                            <input
                              type="text"
                              value={item.time}
                              onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'time', e.target.value)}
                              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
                              placeholder="e.g., 14:00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Icon</label>
                            <input
                              type="text"
                              value={item.icon}
                              onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'icon', e.target.value)}
                              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
                              placeholder="e.g., ✈️"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Activity</label>
                            <input
                              type="text"
                              value={item.activity}
                              onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'activity', e.target.value)}
                              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
                              placeholder="e.g., Airport Pickup"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                            placeholder="Describe what's included in this activity..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">What&apos;s Included (comma-separated)</label>
                          <input
                            type="text"
                            value={item.included.join(', ')}
                            onChange={(e) => updateItineraryItem(dayIndex, itemIndex, 'included', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-white text-sm focus:outline-none focus:border-purple-500/50"
                            placeholder="e.g., VIP access, Welcome drink, Transportation"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Pricing */}
              <div className="space-y-6">
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                      <select
                        value={formData.pricing.currency}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, currency: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Standard Price</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.pricing.standard || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, standard: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Premium Price</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.pricing.premium || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, premium: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">VIP Price</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.pricing.vip || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, vip: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Early Bird Price</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.pricing.earlyBird?.price || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              earlyBird: {
                                ...prev.pricing.earlyBird,
                                price: parseFloat(e.target.value) || 0
                              }
                            }
                          }))}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Early Bird Deadline</label>
                        <input
                          type="date"
                          value={formData.pricing.earlyBird?.deadline || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              earlyBird: {
                                ...prev.pricing.earlyBird,
                                deadline: e.target.value
                              }
                            }
                          }))}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* What's Included/Excluded */}
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">What&apos;s Included</h3>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={includedInput}
                      onChange={(e) => setIncludedInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToList('whatsIncluded', includedInput);
                          setIncludedInput('');
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm"
                      placeholder="Add included item..."
                    />
                    <button
                      onClick={() => {
                        addToList('whatsIncluded', includedInput);
                        setIncludedInput('');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.whatsIncluded.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-500/10 rounded-lg p-3">
                        <span className="text-gray-300">✓ {item}</span>
                        <button
                          onClick={() => removeFromList('whatsIncluded', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">What&apos;s Excluded</h3>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={excludedInput}
                      onChange={(e) => setExcludedInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToList('whatsExcluded', excludedInput);
                          setExcludedInput('');
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm"
                      placeholder="Add excluded item..."
                    />
                    <button
                      onClick={() => {
                        addToList('whatsExcluded', excludedInput);
                        setExcludedInput('');
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.whatsExcluded.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-red-500/10 rounded-lg p-3">
                        <span className="text-gray-300">✗ {item}</span>
                        <button
                          onClick={() => removeFromList('whatsExcluded', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-6">
                <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Availability Management</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Total Spots</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.availability.totalSpots}
                          onChange={(e) => {
                            const totalSpots = parseInt(e.target.value) || 0;
                            setFormData(prev => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                totalSpots,
                                spotsRemaining: totalSpots - prev.availability.spotsTaken
                              }
                            }));
                          }}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Spots Taken</label>
                        <input
                          type="number"
                          min="0"
                          max={formData.availability.totalSpots}
                          value={formData.availability.spotsTaken}
                          onChange={(e) => {
                            const spotsTaken = parseInt(e.target.value) || 0;
                            setFormData(prev => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                spotsTaken,
                                spotsRemaining: prev.availability.totalSpots - spotsTaken
                              }
                            }));
                          }}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-purple-500/10 rounded-lg">
                      <div className="text-sm text-gray-300">
                        <span className="font-medium">Spots Remaining:</span> {formData.availability.spotsRemaining}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Apartments Available</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.availability.apartmentsAvailable}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              apartmentsAvailable: parseInt(e.target.value) || 0
                            }
                          }))}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Apartment Capacity</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.availability.apartmentCapacity}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              apartmentCapacity: parseInt(e.target.value) || 0
                            }
                          }))}
                          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Waiting List Count</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.availability.waitingListCount}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            waitingListCount: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Booking Status</label>
                      <select
                        value={formData.availability.bookingStatus}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            bookingStatus: e.target.value as 'open' | 'limited' | 'closed' | 'sold-out'
                          }
                        }))}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                      >
                        <option value="open">Open</option>
                        <option value="limited">Limited Spots</option>
                        <option value="closed">Closed</option>
                        <option value="sold-out">Sold Out</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Trip Gallery</h3>
                <p className="text-gray-400">Upload and manage images that showcase the trip experience. You can add titles, descriptions, and reorder images.</p>
              </div>
              
              <TripGalleryManager
                images={formData.gallery}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, gallery: images }))}
                maxImages={15}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AdminLayout>
  );
}
