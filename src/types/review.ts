import { Models } from 'appwrite';

export interface Review {
  id?: string;
  
  // References
  userId: string;        // Links to Appwrite user
  userProfileId: string; // Links to user profile
  
  // Review content
  title: string;
  content: string;
  rating: number;        // 1-5 stars
  
  // Optional trip reference (if reviewing a specific trip)
  tripId?: string;
  
  // Review metadata
  published: boolean;
  featured: boolean;     // For highlighting great reviews
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export type ReviewDocument = Models.Document & Review;

export interface CreateReviewData {
  userId: string;
  userProfileId: string;
  title: string;
  content: string;
  rating: number;
  tripId?: string;
  published?: boolean;
  featured?: boolean;
}

export type UpdateReviewData = Partial<CreateReviewData>;
