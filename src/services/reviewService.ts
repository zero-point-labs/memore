import { ID, Query, Models } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { 
  Review, 
  ReviewDocument, 
  CreateReviewData, 
  UpdateReviewData 
} from '@/types/review';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'reviews';

export class ReviewService {
  // Get all published reviews
  async getAll(published: boolean = true): Promise<ReviewDocument[]> {
    try {
      const queries = published ? [Query.equal('published', true)] : [];
      queries.push(Query.orderDesc('$createdAt'));
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return response.documents as ReviewDocument[];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  // Get reviews by user ID
  async getByUserId(userId: string): Promise<ReviewDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );

      return response.documents as ReviewDocument[];
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }
  }

  // Get reviews by trip ID
  async getByTripId(tripId: string): Promise<ReviewDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('tripId', tripId),
          Query.equal('published', true),
          Query.orderDesc('$createdAt')
        ]
      );

      return response.documents as ReviewDocument[];
    } catch (error) {
      console.error('Error fetching trip reviews:', error);
      return [];
    }
  }

  // Get featured reviews
  async getFeatured(limit: number = 3): Promise<ReviewDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('featured', true),
          Query.equal('published', true),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );

      return response.documents as ReviewDocument[];
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      return [];
    }
  }

  // Get review by ID
  async getById(id: string): Promise<ReviewDocument | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );

      return response as ReviewDocument;
    } catch (error) {
      console.error('Error fetching review:', error);
      return null;
    }
  }

  // Create new review
  async create(data: CreateReviewData): Promise<ReviewDocument> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          userId: data.userId,
          userProfileId: data.userProfileId,
          title: data.title,
          content: data.content,
          tripId: data.tripId || null,
        }
      );

      return response as ReviewDocument;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Update review
  async update(id: string, data: UpdateReviewData): Promise<ReviewDocument> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {
          ...data,
          tripId: data.tripId || null,
        }
      );

      return response as ReviewDocument;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Delete review
  async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Get average rating for a trip
  async getAverageRating(tripId: string): Promise<number> {
    try {
      const reviews = await this.getByTripId(tripId);
      if (reviews.length === 0) return 0;
      
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }
}
