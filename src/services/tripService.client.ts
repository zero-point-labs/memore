// Client-side trip service that uses API endpoints instead of direct Appwrite calls
// This bypasses any client-side CORS or permission issues

import { TripDocument } from '@/types/trip';

export class ClientTripService {
  // Get all trips via API endpoint
  async getTrips(options?: {
    category?: string;
    published?: boolean;
    featured?: boolean;
    bookingStatus?: string;
    limit?: number;
    offset?: number;
  }): Promise<TripDocument[]> {
    try {
      const params = new URLSearchParams();
      
      if (options?.category && options.category !== 'all') {
        params.append('category', options.category);
      }
      
      if (options?.published !== undefined) {
        params.append('published', options.published.toString());
      }
      
      if (options?.featured !== undefined) {
        params.append('featured', options.featured.toString());
      }
      
      if (options?.bookingStatus && options.bookingStatus !== 'all') {
        params.append('bookingStatus', options.bookingStatus);
      }
      
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (options?.offset) {
        params.append('offset', options.offset.toString());
      }

      const url = `/api/trips${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch trips');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching trips via API:', error);
      throw error;
    }
  }

  // Get a single trip by ID via API
  async getTrip(id: string): Promise<TripDocument | null> {
    try {
      const response = await fetch(`/api/trips/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        return null;
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching trip via API:', error);
      return null;
    }
  }

  // Get featured trip (for homepage)
  async getFeaturedTrip(): Promise<TripDocument | null> {
    try {
      const trips = await this.getTrips({ 
        published: true, 
        featured: true, 
        limit: 1 
      });
      
      return trips.length > 0 ? trips[0] : null;
    } catch (error) {
      console.error('Error fetching featured trip via API:', error);
      return null;
    }
  }

  // Get next upcoming trip based on start date
  async getNextTrip(): Promise<TripDocument | null> {
    try {
      const now = new Date().toISOString();
      const trips = await this.getTrips({ published: true });
      
      // Filter and sort upcoming trips
      const upcomingTrips = trips
        .filter(trip => new Date(trip.startDate) > new Date(now))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      
      return upcomingTrips.length > 0 ? upcomingTrips[0] : null;
    } catch (error) {
      console.error('Error fetching next trip via API:', error);
      return null;
    }
  }

  // Get upcoming trips (excluding the next/main one)
  async getUpcomingTrips(excludeNextTrip: boolean = true): Promise<TripDocument[]> {
    try {
      const now = new Date().toISOString();
      const trips = await this.getTrips({ published: true });
      
      // Filter and sort upcoming trips
      let upcomingTrips = trips
        .filter(trip => new Date(trip.startDate) > new Date(now))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      
      // Exclude the first trip if requested (since it's the "next" trip)
      if (excludeNextTrip && upcomingTrips.length > 0) {
        upcomingTrips = upcomingTrips.slice(1);
      }

      return upcomingTrips;
    } catch (error) {
      console.error('Error fetching upcoming trips via API:', error);
      return [];
    }
  }

  // Get previous/past trips
  async getPreviousTrips(limit: number = 20): Promise<TripDocument[]> {
    try {
      const now = new Date().toISOString();
      const trips = await this.getTrips({ published: true });
      
      // Filter and sort past trips
      const pastTrips = trips
        .filter(trip => new Date(trip.endDate) < new Date(now))
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, limit);
      
      return pastTrips;
    } catch (error) {
      console.error('Error fetching previous trips via API:', error);
      return [];
    }
  }

  // Get all trips ordered by date (upcoming first, then past)
  async getAllTripsByDate(): Promise<{upcoming: TripDocument[], previous: TripDocument[]}> {
    try {
      const [upcoming, previous] = await Promise.all([
        this.getUpcomingTrips(false), // Include next trip
        this.getPreviousTrips()
      ]);

      return { upcoming, previous };
    } catch (error) {
      console.error('Error fetching all trips by date via API:', error);
      return { upcoming: [], previous: [] };
    }
  }
}

// Export a singleton instance for client-side use
export const clientTripService = new ClientTripService();
