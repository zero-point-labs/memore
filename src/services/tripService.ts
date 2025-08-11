import { ID, Query, Models } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { Trip, TripDocument, CreateTripData, UpdateTripData, UpdateTripAvailabilityData, calculateSpotsRemaining, determineBookingStatus } from '@/types/trip';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'trips';

export class TripService {
  // Get all trips with optional filters
  async getTrips(options?: {
    category?: string;
    published?: boolean;
    featured?: boolean;
    bookingStatus?: string;
    limit?: number;
    offset?: number;
  }): Promise<TripDocument[]> {
    try {
      const queries = [];
      
      if (options?.category && options.category !== 'all') {
        queries.push(Query.equal('category', options.category));
      }
      
      if (options?.published !== undefined) {
        queries.push(Query.equal('published', options.published));
      }
      
      if (options?.featured !== undefined) {
        queries.push(Query.equal('featured', options.featured));
      }
      
      if (options?.bookingStatus && options.bookingStatus !== 'all') {
        queries.push(Query.equal('availability.bookingStatus', options.bookingStatus));
      }
      
      // Order by creation date (newest first)
      queries.push(Query.orderDesc('$createdAt'));
      
      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return response.documents.map((doc: Models.Document): TripDocument => ({
        ...(doc as unknown as TripDocument),
        itinerary: JSON.parse((doc as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((doc as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((doc as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((doc as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((doc as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((doc as unknown as { pricing: string }).pricing),
        availability: JSON.parse((doc as unknown as { availability: string }).availability),
      }));
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  }

  // Get a single trip by ID
  async getTrip(id: string): Promise<TripDocument | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );

      return {
        ...(document as unknown as TripDocument),
        itinerary: JSON.parse((document as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((document as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((document as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((document as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((document as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((document as unknown as { pricing: string }).pricing),
        availability: JSON.parse((document as unknown as { availability: string }).availability),
      };
    } catch (error) {
      console.error('Error fetching trip:', error);
      return null;
    }
  }

  // Get featured trip (for homepage)
  async getFeaturedTrip(): Promise<TripDocument | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('published', true),
          Query.equal('featured', true),
          Query.orderDesc('$createdAt'),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) return null;

      const doc = response.documents[0];
      return {
        ...(doc as unknown as TripDocument),
        itinerary: JSON.parse((doc as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((doc as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((doc as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((doc as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((doc as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((doc as unknown as { pricing: string }).pricing),
        availability: JSON.parse((doc as unknown as { availability: string }).availability),
      };
    } catch (error) {
      console.error('Error fetching featured trip:', error);
      return null;
    }
  }

  // Get next upcoming trip based on start date
  async getNextTrip(): Promise<TripDocument | null> {
    try {
      const now = new Date().toISOString();
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('published', true),
          Query.greaterThan('startDate', now),
          Query.orderAsc('startDate'),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) return null;

      const doc = response.documents[0];
      return {
        ...(doc as unknown as TripDocument),
        itinerary: JSON.parse((doc as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((doc as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((doc as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((doc as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((doc as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((doc as unknown as { pricing: string }).pricing),
        availability: JSON.parse((doc as unknown as { availability: string }).availability),
      };
    } catch (error) {
      console.error('Error fetching next trip:', error);
      return null;
    }
  }

  // Get upcoming trips (excluding the next/main one)
  async getUpcomingTrips(excludeNextTrip: boolean = true): Promise<TripDocument[]> {
    try {
      const now = new Date().toISOString();
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('published', true),
          Query.greaterThan('startDate', now),
          Query.orderAsc('startDate'),
          Query.limit(50) // Reasonable limit
        ]
      );

      let trips = response.documents.map((doc: Models.Document): TripDocument => ({
        ...(doc as unknown as TripDocument),
        itinerary: JSON.parse((doc as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((doc as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((doc as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((doc as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((doc as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((doc as unknown as { pricing: string }).pricing),
        availability: JSON.parse((doc as unknown as { availability: string }).availability),
      }));

      // Exclude the first trip if requested (since it's the "next" trip)
      if (excludeNextTrip && trips.length > 0) {
        trips = trips.slice(1);
      }

      return trips;
    } catch (error) {
      console.error('Error fetching upcoming trips:', error);
      return [];
    }
  }

  // Get previous/past trips
  async getPreviousTrips(limit: number = 20): Promise<TripDocument[]> {
    try {
      const now = new Date().toISOString();
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('published', true),
          Query.lessThan('endDate', now),
          Query.orderDesc('startDate'),
          Query.limit(limit)
        ]
      );

      return response.documents.map((doc: Models.Document): TripDocument => ({
        ...(doc as unknown as TripDocument),
        itinerary: JSON.parse((doc as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((doc as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((doc as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((doc as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((doc as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((doc as unknown as { pricing: string }).pricing),
        availability: JSON.parse((doc as unknown as { availability: string }).availability),
      }));
    } catch (error) {
      console.error('Error fetching previous trips:', error);
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
      console.error('Error fetching all trips by date:', error);
      return { upcoming: [], previous: [] };
    }
  }

  // Create a new trip
  async createTrip(data: CreateTripData): Promise<TripDocument> {
    try {
      // Calculate spots remaining
      const spotsRemaining = calculateSpotsRemaining(data.availability.totalSpots, data.availability.spotsTaken);
      
      // Auto-determine booking status if not provided
      if (!data.availability.bookingStatus) {
        data.availability.bookingStatus = determineBookingStatus(spotsRemaining, data.availability.totalSpots);
      }
      
      // Set spots remaining
      data.availability.spotsRemaining = spotsRemaining;

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          ...data,
          itinerary: JSON.stringify(data.itinerary),
          gallery: JSON.stringify(data.gallery),
          highlights: JSON.stringify(data.highlights),
          whatsIncluded: JSON.stringify(data.whatsIncluded),
          whatsExcluded: JSON.stringify(data.whatsExcluded),
          pricing: JSON.stringify(data.pricing),
          availability: JSON.stringify(data.availability),
          published: data.published || false,
        }
      );

      return {
        ...(document as unknown as TripDocument),
        itinerary: JSON.parse((document as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((document as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((document as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((document as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((document as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((document as unknown as { pricing: string }).pricing),
        availability: JSON.parse((document as unknown as { availability: string }).availability),
      };
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  // Update a trip
  async updateTrip(id: string, data: UpdateTripData): Promise<TripDocument> {
    try {
      const updateData: Record<string, unknown> = { ...data };
      
      if (data.itinerary) {
        updateData.itinerary = JSON.stringify(data.itinerary);
      }
      
      if (data.gallery) {
        updateData.gallery = JSON.stringify(data.gallery);
      }
      
      if (data.highlights) {
        updateData.highlights = JSON.stringify(data.highlights);
      }
      
      if (data.whatsIncluded) {
        updateData.whatsIncluded = JSON.stringify(data.whatsIncluded);
      }
      
      if (data.whatsExcluded) {
        updateData.whatsExcluded = JSON.stringify(data.whatsExcluded);
      }
      
      if (data.pricing) {
        updateData.pricing = JSON.stringify(data.pricing);
      }
      
      if (data.availability) {
        // Calculate spots remaining if availability is being updated
        const spotsRemaining = calculateSpotsRemaining(data.availability.totalSpots, data.availability.spotsTaken);
        data.availability.spotsRemaining = spotsRemaining;
        
        // Auto-update booking status if not explicitly provided
        if (!data.availability.bookingStatus) {
          data.availability.bookingStatus = determineBookingStatus(spotsRemaining, data.availability.totalSpots);
        }
        
        updateData.availability = JSON.stringify(data.availability);
      }

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );

      return {
        ...(document as unknown as TripDocument),
        itinerary: JSON.parse((document as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((document as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((document as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((document as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((document as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((document as unknown as { pricing: string }).pricing),
        availability: JSON.parse((document as unknown as { availability: string }).availability),
      };
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  // Update trip availability only
  async updateTripAvailability(id: string, availabilityData: UpdateTripAvailabilityData): Promise<TripDocument> {
    try {
      // First get the current trip to merge availability data
      const currentTrip = await this.getTrip(id);
      if (!currentTrip) {
        throw new Error('Trip not found');
      }

      const updatedAvailability = {
        ...currentTrip.availability,
        ...availabilityData
      };

      // Calculate spots remaining
      const spotsRemaining = calculateSpotsRemaining(
        updatedAvailability.totalSpots, 
        updatedAvailability.spotsTaken
      );
      updatedAvailability.spotsRemaining = spotsRemaining;

      // Auto-update booking status if not explicitly provided
      if (!availabilityData.bookingStatus) {
        updatedAvailability.bookingStatus = determineBookingStatus(spotsRemaining, updatedAvailability.totalSpots);
      }

      return await this.updateTrip(id, { availability: updatedAvailability });
    } catch (error) {
      console.error('Error updating trip availability:', error);
      throw error;
    }
  }

  // Delete a trip
  async deleteTrip(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  // Toggle published status
  async togglePublished(id: string, published: boolean): Promise<TripDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        { published }
      );

      return {
        ...(document as unknown as TripDocument),
        itinerary: JSON.parse((document as unknown as { itinerary: string }).itinerary),
        gallery: JSON.parse((document as unknown as { gallery: string }).gallery),
        highlights: JSON.parse((document as unknown as { highlights: string }).highlights),
        whatsIncluded: JSON.parse((document as unknown as { whatsIncluded: string }).whatsIncluded),
        whatsExcluded: JSON.parse((document as unknown as { whatsExcluded: string }).whatsExcluded),
        pricing: JSON.parse((document as unknown as { pricing: string }).pricing),
        availability: JSON.parse((document as unknown as { availability: string }).availability),
      };
    } catch (error) {
      console.error('Error toggling published status:', error);
      throw error;
    }
  }



  // Book a spot (increment spots taken)
  async bookSpot(id: string, spotsToBook: number = 1): Promise<TripDocument> {
    try {
      const currentTrip = await this.getTrip(id);
      if (!currentTrip) {
        throw new Error('Trip not found');
      }

      const newSpotsTaken = currentTrip.availability.spotsTaken + spotsToBook;
      
      // Check if booking would exceed total spots
      if (newSpotsTaken > currentTrip.availability.totalSpots) {
        throw new Error('Not enough spots available');
      }

      return await this.updateTripAvailability(id, {
        spotsTaken: newSpotsTaken
      });
    } catch (error) {
      console.error('Error booking spot:', error);
      throw error;
    }
  }

  // Cancel a booking (decrement spots taken)
  async cancelBooking(id: string, spotsToCancel: number = 1): Promise<TripDocument> {
    try {
      const currentTrip = await this.getTrip(id);
      if (!currentTrip) {
        throw new Error('Trip not found');
      }

      const newSpotsTaken = Math.max(0, currentTrip.availability.spotsTaken - spotsToCancel);

      return await this.updateTripAvailability(id, {
        spotsTaken: newSpotsTaken
      });
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  }

  // Add to waiting list
  async addToWaitingList(id: string, count: number = 1): Promise<TripDocument> {
    try {
      const currentTrip = await this.getTrip(id);
      if (!currentTrip) {
        throw new Error('Trip not found');
      }

      const newWaitingListCount = currentTrip.availability.waitingListCount + count;

      return await this.updateTripAvailability(id, {
        waitingListCount: newWaitingListCount
      });
    } catch (error) {
      console.error('Error adding to waiting list:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const tripService = new TripService();

