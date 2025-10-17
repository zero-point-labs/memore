'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewService } from '@/services/reviewService';
import { UserProfileService } from '@/services/userProfileService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
  onReviewAdded?: () => void; // Add callback for when review is added
}

export default function ReviewModal({ isOpen, onClose, tripId, onReviewAdded }: ReviewModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || formData.rating === 0 || !formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get user profile
      const userProfileService = new UserProfileService();
      const userProfile = await userProfileService.getByUserId(user.$id);
      
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Create review
      const reviewService = new ReviewService();
      await reviewService.create({
        userId: user.$id,
        userProfileId: userProfile.$id,
        title: formData.title.trim(),
        content: `Rating: ${formData.rating}/5 stars\n\n${formData.content.trim()}`,
        rating: formData.rating,
        tripId: tripId,
        published: true,
        featured: false,
      });

      // Reset form and close modal
      setFormData({ title: '', content: '', rating: 0 });
      onClose();
      
      // Notify parent component that a review was added
      if (onReviewAdded) {
        onReviewAdded();
      }
      
      // Show success message (you could add a toast notification here)
      alert('Thank you for sharing your Cyprus story! Your review has been submitted.');
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isActive = starNumber <= (hoveredRating || formData.rating);
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => handleRatingClick(starNumber)}
          onMouseEnter={() => handleRatingHover(starNumber)}
          onMouseLeave={handleRatingLeave}
          className="transition-colors duration-200"
        >
          <Star
            size={32}
            className={`${
              isActive 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-400 hover:text-yellow-300'
            } transition-colors duration-200`}
          />
        </button>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Share Your Cyprus Story
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Help others discover the magic of Cyprus
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    How was your experience? *
                  </label>
                  <div className="flex gap-2">
                    {renderStars()}
                  </div>
                  {formData.rating > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      {formData.rating === 1 && 'Poor'}
                      {formData.rating === 2 && 'Fair'}
                      {formData.rating === 3 && 'Good'}
                      {formData.rating === 4 && 'Very Good'}
                      {formData.rating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Amazing Cyprus Adventure!"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Your Story *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Tell us about your Cyprus experience... What made it special? Any tips for future travelers?"
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors resize-none"
                    rows={6}
                    required
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.content.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg text-white font-medium hover:bg-gray-700/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.rating === 0 || !formData.title.trim() || !formData.content.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Share Story
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
