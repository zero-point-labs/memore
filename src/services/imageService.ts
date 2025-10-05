import { ID } from 'appwrite';
import { storage, account } from '@/lib/appwrite';

// Bucket configuration - supports both single bucket (free plan) and separate buckets (paid plan)
const BLOG_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BLOG_BUCKET_ID || 'blog_images';
const TRIP_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_TRIP_BUCKET_ID || 'blog_images'; // Falls back to same bucket
const EVENT_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_EVENT_BUCKET_ID || 'blog_images'; // Falls back to same bucket
const USE_SEPARATE_BUCKETS = process.env.NEXT_PUBLIC_USE_SEPARATE_BUCKETS === 'true';

// Image types for organization
export type ImageType = 'blog' | 'trip' | 'event';

// Helper function to get bucket ID based on image type and plan
function getBucketId(type: ImageType = 'blog'): string {
  if (USE_SEPARATE_BUCKETS) {
    // Paid plan: use separate buckets
    switch (type) {
      case 'blog':
        return BLOG_BUCKET_ID;
      case 'trip':
        return TRIP_BUCKET_ID;
      case 'event':
        return EVENT_BUCKET_ID;
      default:
        return BLOG_BUCKET_ID;
    }
  } else {
    // Free plan: use single bucket for all
    return BLOG_BUCKET_ID;
  }
}

// Helper function to get file prefix (only used when using single bucket)
// NOTE: Appwrite file IDs cannot contain slashes, so we use underscores instead
function getFilePrefix(type: ImageType = 'blog'): string {
  if (USE_SEPARATE_BUCKETS) {
    // Separate buckets: no prefix needed
    return '';
  } else {
    // Single bucket: use underscore prefixes (no slashes - Appwrite limitation)
    switch (type) {
      case 'blog':
        return 'blog_';
      case 'trip':
        return 'trip_';
      case 'event':
        return 'event_';
      default:
        return 'blog_';
    }
  }
}

export class ImageService {
  // Upload an image file
  async uploadImage(file: File, imageType: ImageType = 'blog'): Promise<string> {
    try {
      console.log('Starting image upload...', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      // Ensure the user has an active session (creates anonymous session if not logged-in)
      try {
        const user = await account.get();
        console.log('User session active:', user.email || 'anonymous');
      } catch (error) {
        console.log('No active session, creating anonymous session...');
        try {
          // First try to delete any existing session that might be stale
          try {
            await account.deleteSession('current');
          } catch (deleteError) {
            // Ignore delete errors - session might not exist
            console.log('No existing session to delete');
          }
          
          // Now create a fresh anonymous session
          const session = await account.createAnonymousSession();
          console.log('Anonymous session created successfully:', session.$id);
        } catch (sessionError) {
          console.error('Failed to create anonymous session:', sessionError);
          const errorDetails = sessionError as Error;
          console.error('Session error details:', {
            message: errorDetails.message,
            code: (sessionError as { code?: string })?.code,
            type: (sessionError as { type?: string })?.type
          });
          throw new Error(`Unable to authenticate for file upload: ${errorDetails.message}`);
        }
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, WebP, or SVG image.');
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File too large. Please upload an image smaller than 10MB.');
      }

      // Generate unique file ID with prefix for organization (if using single bucket)
      const filePrefix = getFilePrefix(imageType);
      const uniqueId = ID.unique();
      const fileId = `${filePrefix}${uniqueId}`;
      const bucketId = getBucketId(imageType);
      
      console.log('Generated file ID:', fileId);
      console.log('Using bucket ID:', bucketId, 'for image type:', imageType);
      if (!USE_SEPARATE_BUCKETS) {
        console.log('Single bucket mode - using prefix:', filePrefix);
      } else {
        console.log('Separate buckets mode - no prefix needed');
      }
      
      // Upload file
      console.log('Uploading file to Appwrite storage...');
      const uploadedFile = await storage.createFile(
        bucketId,
        fileId,
        file
      );
      console.log('File uploaded successfully:', uploadedFile.$id);

      // Return the file URL - use direct view URL for better compatibility
      try {
        // Use getFileView for direct access (more reliable for public access)
        const viewUrl = storage.getFileView(bucketId, uploadedFile.$id);
        
        let finalUrl: string;
        if (viewUrl && typeof viewUrl === 'object' && 'href' in viewUrl) {
          finalUrl = (viewUrl as { href: string }).href;
        } else if (typeof viewUrl === 'string') {
          finalUrl = viewUrl;
        } else {
          // Manual URL construction as fallback
          finalUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        }

        console.log('Generated final URL:', finalUrl);
        return finalUrl;
      } catch (urlError) {
        console.error('Error generating file URL:', urlError);
        // Last resort: construct URL manually with project ID
        const manualUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        console.log('Using manual URL construction:', manualUrl);
        return manualUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Delete an image
  async deleteImage(fileId: string, imageType: ImageType = 'blog'): Promise<void> {
    try {
      const bucketId = getBucketId(imageType);
      console.log('Attempting to delete file:', fileId, 'from bucket:', bucketId, 'for image type:', imageType);
      
      // Ensure the user has an active session for delete operations
      try {
        const user = await account.get();
        console.log('User session active for delete:', user.email || 'anonymous');
      } catch (error) {
        console.log('No active session, creating anonymous session for delete...');
        try {
          // First try to delete any existing session that might be stale
          try {
            await account.deleteSession('current');
          } catch (deleteError) {
            // Ignore delete errors - session might not exist
            console.log('No existing session to delete');
          }
          
          // Now create a fresh anonymous session
          const session = await account.createAnonymousSession();
          console.log('Anonymous session created for delete operation:', session.$id);
        } catch (sessionError) {
          console.error('Failed to create anonymous session for delete:', sessionError);
          const errorDetails = sessionError as Error;
          console.error('Delete session error details:', {
            message: errorDetails.message,
            code: (sessionError as { code?: string })?.code,
            type: (sessionError as { type?: string })?.type
          });
          throw new Error(`Unable to authenticate for file deletion: ${errorDetails.message}`);
        }
      }
      
      await storage.deleteFile(bucketId, fileId);
      console.log('File deleted successfully:', fileId);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Get file ID from URL
  getFileIdFromUrl(url: string): string | null {
    try {
      console.log('Extracting file ID from URL:', url);
      
      // Extract file ID from Appwrite storage URL supporting both /preview and /view endpoints
      // Match patterns:
      // - /storage/buckets/{bucketId}/files/{fileId}/view
      // - /storage/buckets/{bucketId}/files/{fileId}/preview
      // - /storage/buckets/{bucketId}/files/{fileId}/view?project=...
      // - /storage/buckets/{bucketId}/files/{fileId}/preview?...
      const match = url.match(/\/files\/([a-zA-Z0-9]+)(?:\/(?:view|preview))?(?:\?|$)/);
      const fileId = match ? match[1] : null;
      
      console.log('Extracted file ID:', fileId);
      return fileId;
    } catch (error) {
      console.error('Error extracting file ID from URL:', error);
      return null;
    }
  }

  // Check if URL is from our storage
  isAppwriteStorageUrl(url: string): boolean {
    const isAppwriteUrl = url.includes('/storage/buckets/') && url.includes('/files/');
    console.log('Checking if URL is Appwrite storage URL:', url, 'Result:', isAppwriteUrl);
    return isAppwriteUrl;
  }

  // Get optimized image URL
  getOptimizedImageUrl(fileId: string, width: number = 800, height: number = 600, imageType: ImageType = 'blog'): string {
    try {
      const bucketId = getBucketId(imageType);
      // Use direct view URL for better compatibility
      const viewUrl = storage.getFileView(bucketId, fileId);
      
      if (viewUrl && typeof viewUrl === 'object' && 'href' in viewUrl) {
        return (viewUrl as { href: string }).href;
      } else if (typeof viewUrl === 'string') {
        return viewUrl;
      } else {
        // Manual URL construction as fallback
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      }
    } catch (error) {
      console.error('Error generating optimized URL:', error);
      const bucketId = getBucketId(imageType);
      // Manual URL construction as fallback
      return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    }
  }
}

// Export singleton instance
export const imageService = new ImageService();