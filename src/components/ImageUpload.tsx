'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { imageService } from '@/services/imageService';
import { cn } from '@/utils/cn';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
}

export default function ImageUpload({ 
  value, 
  onChange, 
  className,
  aspectRatio = 'video' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setUploading(true);
      const url = await imageService.uploadImage(file);
      onChange(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
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
    if (value && imageService.isAppwriteStorageUrl(value)) {
      try {
        const fileId = imageService.getFileIdFromUrl(value);
        if (fileId) {
          await imageService.deleteImage(fileId);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    onChange('');
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
            className={cn(
              "relative rounded-lg overflow-hidden bg-gray-800 group",
              aspectRatioClass
            )}
          >
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Remove Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </motion.button>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                Supports: JPEG, PNG, GIF, WebP, SVG (max 10MB)
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
    </div>
  );
}