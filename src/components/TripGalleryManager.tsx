'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  Trash2, 
  Eye, 
  Edit, 
  Plus, 
  GripVertical, 
  Save,
  AlertCircle
} from 'lucide-react';
import { imageService } from '@/services/imageService';
import { TripGalleryImage } from '@/types/trip';
import { cn } from '@/utils/cn';

interface TripGalleryManagerProps {
  images: string[] | TripGalleryImage[];
  onImagesChange: (images: TripGalleryImage[]) => void;
  maxImages?: number;
  className?: string;
}

interface EditingImage {
  id: string;
  title: string;
  description: string;
  altText: string;
}

export default function TripGalleryManager({ 
  images, 
  onImagesChange, 
  maxImages = 15,
  className 
}: TripGalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<EditingImage | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert images to enhanced format
  const galleryImages: TripGalleryImage[] = images.map((img, index) => {
    if (typeof img === 'string') {
      return {
        id: `img-${index}-${Date.now()}`,
        url: img,
        title: '',
        description: '',
        altText: '',
        order: index
      };
    }
    return img;
  }).sort((a, b) => a.order - b.order);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPreview) setShowPreview(null);
        if (editingImage) setEditingImage(null);
      }
    };

    if (showPreview || editingImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showPreview, editingImage]);

  const handleFileSelect = async (files: FileList) => {
    if (galleryImages.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can add ${maxImages - galleryImages.length} more.`);
      return;
    }

    try {
      setUploading(true);
      const newImages: TripGalleryImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        console.log(`Uploading image ${i + 1}/${files.length}:`, file.name);
        const url = await imageService.uploadImage(file, 'trip');
        
        newImages.push({
          id: `img-${Date.now()}-${i}`,
          url,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for title
          description: '',
          altText: '',
          order: galleryImages.length + newImages.length
        });
      }

      onImagesChange([...galleryImages, ...newImages]);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    const imageToRemove = galleryImages.find(img => img.id === imageId);
    if (!imageToRemove) return;

    // Remove from UI immediately
    const updatedImages = galleryImages
      .filter(img => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index })); // Reorder
    
    onImagesChange(updatedImages);

    // Try to delete from storage if it's an Appwrite URL
    if (imageService.isAppwriteStorageUrl(imageToRemove.url)) {
      try {
        const fileId = imageService.getFileIdFromUrl(imageToRemove.url);
        if (fileId) {
          await imageService.deleteImage(fileId, 'trip');
        }
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }
  };

  const handleReorder = (newOrder: TripGalleryImage[]) => {
    const reorderedImages = newOrder.map((img, index) => ({
      ...img,
      order: index
    }));
    onImagesChange(reorderedImages);
  };

  const handleEditImage = (image: TripGalleryImage) => {
    setEditingImage({
      id: image.id,
      title: image.title || '',
      description: image.description || '',
      altText: image.altText || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingImage) return;

    const updatedImages = galleryImages.map(img => 
      img.id === editingImage.id 
        ? {
            ...img,
            title: editingImage.title,
            description: editingImage.description,
            altText: editingImage.altText
          }
        : img
    );

    onImagesChange(updatedImages);
    setEditingImage(null);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
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

  return (
    <div className={cn("space-y-6", className)}>
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
          galleryImages.length >= maxImages && "opacity-50 pointer-events-none"
        )}
        onClick={() => !uploading && galleryImages.length < maxImages && fileInputRef.current?.click()}
      >
        <div className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            {uploading ? (
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 blur-lg opacity-50" />
                <Plus className="relative w-12 h-12 text-purple-400" />
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {uploading ? 'Uploading Images...' : 'Add Trip Images'}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                {galleryImages.length >= maxImages 
                  ? `Maximum ${maxImages} images reached`
                  : `Drag and drop images here, or click to browse (${galleryImages.length}/${maxImages})`
                }
              </p>
              <p className="text-gray-500 text-xs">
                Supports: JPEG, PNG, GIF, WebP (max 10MB each)
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
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Gallery Grid with Reorder */}
      {galleryImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Trip Gallery</h3>
            <span className="text-sm text-gray-400">({galleryImages.length} images)</span>
          </div>

          <Reorder.Group
            axis="y"
            values={galleryImages}
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {galleryImages.map((image) => (
                <Reorder.Item
                  key={image.id}
                  value={image}
                  className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4"
                >
                  <motion.div
                    layout
                    className="flex gap-4"
                  >
                    {/* Drag Handle */}
                    <div className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} />
                    </div>

                    {/* Image Thumbnail */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img
                        src={image.url}
                        alt={image.altText || image.title || 'Trip image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" fill="%23374151"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%239CA3AF" text-anchor="middle" dy=".3em">Error</text></svg>';
                        }}
                      />
                    </div>

                    {/* Image Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-white truncate">
                            {image.title || 'Untitled Image'}
                          </h4>
                          {image.description && (
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                              {image.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {!image.title && !image.description && (
                              <span className="flex items-center gap-1 text-xs text-yellow-400">
                                <AlertCircle size={12} />
                                No title or description
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setShowPreview(image.url)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleEditImage(image)}
                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                            title="Edit Details"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleRemoveImage(image.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      )}

      {/* Image Preview Modal */}
      {mounted && showPreview && typeof window !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowPreview(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-[95vw] max-h-[95vh] bg-black/95 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(null)}
              className="absolute top-4 right-4 p-3 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <img
              src={showPreview}
              alt="Preview"
              className="max-w-[95vw] max-h-[95vh] object-contain"
            />
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Edit Image Modal */}
      {mounted && editingImage && typeof window !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4"
          onClick={() => setEditingImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-md bg-black/95 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Edit Image Details</h3>
                <button
                  onClick={() => setEditingImage(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingImage.title}
                    onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    placeholder="Enter image title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingImage.description}
                    onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                    placeholder="Describe this image..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={editingImage.altText}
                    onChange={(e) => setEditingImage({ ...editingImage, altText: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    placeholder="Alt text for screen readers..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}
