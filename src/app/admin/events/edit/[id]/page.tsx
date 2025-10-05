'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import ImageUploadSimple from '@/components/ImageUploadSimple';
import { eventService } from '@/services/eventService';
import { EVENT_TYPES, EVENT_CITIES, UpdateEventData, EventType, EventCity } from '@/types/event';

export default function EditEventPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const router = useRouter();
  const params = useParams();
  const [saving, setSaving] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'club-night' as EventType,
    city: 'ayia-napa' as EventCity,
    eventDate: '',
    venue: '',
    venueAddress: '',
    startTime: '22:00',
    endTime: '04:00',
    duration: 6,
    ageRestriction: 18,
    generalPrice: 45,
    vipPrice: 75,
    generalCapacity: 100,
    vipCapacity: 30,
    generalTaken: 0,
    vipTaken: 0,
    includes: [] as string[],
    highlights: [] as string[],
    lineup: [] as string[],
    category: [] as string[],
    dresscode: '',
    paymentType: 'full-upfront' as 'full-upfront' | 'split-50-50' | 'deposit-30-70',
    published: false,
    featured: false,
    featuredImage: '',
    gallery: [] as string[],
  });

  const [includeInput, setIncludeInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string);
    }
  }, [params.id]);

  const fetchEvent = async (id: string) => {
    try {
      const event = await eventService.getEvent(id);
      if (event) {
        setFormData({
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          city: event.city,
          eventDate: event.eventDate,
          venue: event.venueInfo.venue,
          venueAddress: event.venueInfo.venueAddress || '',
          startTime: event.eventDetails.startTime,
          endTime: event.eventDetails.endTime,
          duration: event.eventDetails.duration,
          ageRestriction: event.eventDetails.ageRestriction,
          generalPrice: event.pricing.general.price,
          vipPrice: event.pricing.vip?.price || 0,
          generalCapacity: event.capacity.general,
          vipCapacity: event.capacity.vip,
          generalTaken: event.capacity.generalTaken,
          vipTaken: event.capacity.vipTaken,
          includes: event.eventContent.includes,
          highlights: event.eventContent.highlights,
          lineup: event.eventContent.lineup || [],
          category: event.eventContent.category,
          dresscode: event.eventDetails.dresscode || '',
          paymentType: event.eventDetails.paymentType,
          published: event.published,
          featured: event.featured,
          featuredImage: event.eventContent.featuredImage,
          gallery: event.eventContent.gallery,
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.venue || !formData.eventDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const updateData: UpdateEventData = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        city: formData.city,
        eventDate: formData.eventDate,
        published: formData.published,
        featured: formData.featured,
        eventDetails: {
          startTime: formData.startTime,
          endTime: formData.endTime,
          duration: formData.duration,
          ageRestriction: formData.ageRestriction,
          dresscode: formData.dresscode || undefined,
          paymentType: formData.paymentType,
          organizer: 'Memora Events Team',
        },
        venueInfo: {
          venue: formData.venue,
          venueAddress: formData.venueAddress || undefined,
        },
        pricing: {
          general: {
            price: formData.generalPrice,
            currency: 'EUR',
            available: true,
          },
          vip: formData.vipPrice > 0 ? {
            price: formData.vipPrice,
            currency: 'EUR',
            available: true,
            benefits: ['Skip the line', 'VIP area access', 'Free welcome drink'],
          } : undefined,
        },
        capacity: {
          general: formData.generalCapacity,
          vip: formData.vipCapacity,
          generalTaken: formData.generalTaken,
          vipTaken: formData.vipTaken,
          generalRemaining: formData.generalCapacity - formData.generalTaken,
          vipRemaining: formData.vipCapacity - formData.vipTaken,
        },
        eventContent: {
          includes: formData.includes,
          highlights: formData.highlights,
          lineup: formData.lineup.length > 0 ? formData.lineup : undefined,
          category: formData.category,
          featuredImage: formData.featuredImage,
          gallery: formData.gallery,
          videoUrl: undefined,
        },
      };

      await eventService.updateEvent(params.id as string, updateData);
      router.push('/admin/events');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  const addToList = (listName: 'includes' | 'highlights', value: string) => {
    if (value.trim() && !formData[listName].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [listName]: [...prev[listName], value.trim()]
      }));
    }
  };

  const removeFromList = (listName: 'includes' | 'highlights', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  if (authLoading || adminLoading || loadingEvent) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-purple-400">Loading...</div></div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-white">Edit Event</h1>
              <p className="text-gray-400">Update event details</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>

        {/* Form - Same as Create */}
        <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-8">
          <div className="space-y-8">
            
            {/* Featured Image */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-purple-500/20 pb-3">Event Image</h3>
              <ImageUploadSimple
                value={formData.featuredImage}
                onChange={(url) => setFormData({...formData, featuredImage: url})}
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-purple-500/20 pb-3">Basic Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Event Type *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value as EventType})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                    style={{ colorScheme: 'dark' }}
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>

            {/* Date & Venue */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-purple-500/20 pb-3">Date & Venue</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate.split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const [hours, minutes] = formData.startTime.split(':');
                      date.setHours(parseInt(hours), parseInt(minutes));
                      setFormData({...formData, eventDate: date.toISOString()});
                    }}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Venue *</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value as EventCity})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                    style={{ colorScheme: 'dark' }}
                  >
                    {EVENT_CITIES.map((city) => (
                      <option key={city.id} value={city.id}>{city.icon} {city.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-purple-500/20 pb-3">Pricing & Capacity</h3>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">General Price (€)</label>
                  <input
                    type="number"
                    value={formData.generalPrice}
                    onChange={(e) => setFormData({...formData, generalPrice: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">VIP Price (€)</label>
                  <input
                    type="number"
                    value={formData.vipPrice}
                    onChange={(e) => setFormData({...formData, vipPrice: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">General Capacity</label>
                  <input
                    type="number"
                    value={formData.generalCapacity}
                    onChange={(e) => setFormData({...formData, generalCapacity: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                  <div className="text-xs text-gray-400 mt-1">Taken: {formData.generalTaken}</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">VIP Capacity</label>
                  <input
                    type="number"
                    value={formData.vipCapacity}
                    onChange={(e) => setFormData({...formData, vipCapacity: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                  <div className="text-xs text-gray-400 mt-1">Taken: {formData.vipTaken}</div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-purple-500/20 pb-3">What's Included</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('includes', includeInput);
                      setIncludeInput('');
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  placeholder="Entry fee, Welcome drink, etc."
                />
                <button
                  onClick={() => { addToList('includes', includeInput); setIncludeInput(''); }}
                  className="px-6 py-3 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="text-green-400 text-sm">{item}</span>
                    <button onClick={() => removeFromList('includes', index)} className="text-green-400 hover:text-green-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-purple-500/20 pb-3">Event Highlights</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addToList('highlights', highlightInput);
                      setHighlightInput('');
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  placeholder="World-class DJs, Beach access, etc."
                />
                <button
                  onClick={() => { addToList('highlights', highlightInput); setHighlightInput(''); }}
                  className="px-6 py-3 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                    <span className="text-purple-400 text-sm">{item}</span>
                    <button onClick={() => removeFromList('highlights', index)} className="text-purple-400 hover:text-purple-300">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-purple-500/20 pb-3">Additional Settings</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Dress Code</label>
                  <input
                    type="text"
                    value={formData.dresscode}
                    onChange={(e) => setFormData({...formData, dresscode: e.target.value})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Payment Type</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value as 'full-upfront' | 'split-50-50' | 'deposit-30-70'})}
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/60"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="full-upfront">Full Payment Upfront</option>
                    <option value="split-50-50">Split 50/50</option>
                    <option value="deposit-30-70">Deposit 30% / Balance 70%</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({...formData, published: e.target.checked})}
                    className="w-5 h-5 rounded border-purple-500/30 bg-black/40"
                  />
                  <span className="text-white font-semibold">Publish Event</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="w-5 h-5 rounded border-purple-500/30 bg-black/40"
                  />
                  <span className="text-white font-semibold">Featured Event</span>
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

