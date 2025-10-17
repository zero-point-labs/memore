import { ReviewDocument } from '@/types/review';

export class ClientReviewService {
  // Get all published reviews
  async getAll(): Promise<ReviewDocument[]> {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  // Get featured reviews
  async getFeatured(limit: number = 5): Promise<ReviewDocument[]> {
    try {
      const response = await fetch(`/api/reviews/featured?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured reviews');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      return [];
    }
  }

  // Get reviews by trip ID
  async getByTripId(tripId: string): Promise<ReviewDocument[]> {
    try {
      const response = await fetch(`/api/reviews/trip/${tripId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip reviews');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trip reviews:', error);
      return [];
    }
  }
}

export const clientReviewService = new ClientReviewService();
