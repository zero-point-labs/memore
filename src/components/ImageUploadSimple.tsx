'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, Trash2, Eye } from 'lucide-react';
import { imageService } from '@/services/imageService';
import { cn } from '@/utils/cn';

interface ImageUploadSimpleProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
}

// Removed local BUCKET_ID constant; handled centrally in imageService

export default function ImageUploadSimple({ 
  value, 
  onChange, 
  className,
  aspectRatio = 'video' 
}: ImageUploadSimpleProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPreview) {
        setShowPreview(false);
      }
    };

    if (showPreview) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showPreview]);

  const handleFileSelect = async (file: File) => {
    try {
      setUploading(true);
      console.log('ImageUploadSimple: Starting file upload...', { name: file.name, size: file.size, type: file.type });
      const url = await imageService.uploadImage(file);
      console.log('ImageUploadSimple: Upload successful, URL:', url);
      onChange(url);
    } catch (error) {
      console.error('ImageUploadSimple: Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please check console for details.';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = async () => {
    console.log('ImageUploadSimple: Attempting to remove image:', value);
    
    // Always clear the image from the form first for immediate UI feedback
    onChange('');
    
    if (value && imageService.isAppwriteStorageUrl(value)) {
      try {
        const fileId = imageService.getFileIdFromUrl(value);
        console.log('ImageUploadSimple: File ID extracted for deletion:', fileId);
        
        if (fileId) {
          console.log('ImageUploadSimple: Starting delete operation...');
          await imageService.deleteImage(fileId);
          console.log('ImageUploadSimple: Image deleted successfully from storage');
        } else {
          console.warn('ImageUploadSimple: Could not extract file ID from URL, only clearing reference');
        }
      } catch (error) {
        console.error('ImageUploadSimple: Error deleting image from storage:', error);
        console.error('ImageUploadSimple: Delete error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          url: value,
          extractedFileId: imageService.getFileIdFromUrl(value)
        });
        // Don't show alert as the UI has already been updated
        console.log('ImageUploadSimple: Image reference cleared from UI, but storage deletion failed');
      }
    } else {
      console.log('ImageUploadSimple: Not an Appwrite storage URL, only clearing the reference');
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    auto: 'aspect-auto min-h-[200px]'
  }[aspectRatio];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Image Display */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-3"
          >
            {/* Clickable Image */}
            <div
              className={cn(
                "relative rounded-lg overflow-hidden bg-gray-800 group cursor-pointer",
                aspectRatioClass
              )}
              onClick={() => setShowPreview(true)}
            >
              <img
                src={value}
                alt="Uploaded image"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  console.error('ImageUploadSimple: Image load error for URL:', value);
                  // Instead of hiding the image, show a placeholder or fallback
                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="100%" height="100%" fill="%23374151"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%239CA3AF" text-anchor="middle" dy=".3em">Image failed to load</text></svg>';
                }}
              />
              
              {/* Preview Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                  <Eye size={20} />
                  <span className="text-sm font-medium">Click to preview</span>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRemove}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete Image</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer",
          dragOver
            ? "border-purple-400 bg-purple-500/10"
            : "border-purple-500/30 hover:border-purple-500/50",
          uploading && "pointer-events-none opacity-50",
          !value && aspectRatioClass
        )}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <div className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50" />
                <Upload className="relative w-12 h-12 text-purple-400" />
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {uploading ? 'Uploading...' : 'Upload Image'}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                Drag and drop an image here, or click to browse
              </p>
              <p className="text-gray-500 text-xs">
                Supports: JPEG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        {uploading && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2 }}
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400"
          />
        )}
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* URL Input Fallback */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
        />
        <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>

      {/* Image Preview Modal - Rendered via Portal */}
      {mounted && showPreview && value && typeof window !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-2"
          onClick={() => setShowPreview(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-[98vw] h-[98vh] bg-black/95 rounded-lg overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 p-3 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors z-10 text-xl"
            >
              <X size={24} />
            </button>

            {/* Image */}
            <img
              src={value}
              alt="Image preview"
              className="max-w-[96vw] max-h-[96vh] object-contain"
              onError={(e) => {
                console.error('Preview image load error:', value);
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="100%" height="100%" fill="%23374151"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%239CA3AF" text-anchor="middle" dy=".3em">Image failed to load</text></svg>';
              }}
            />
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}