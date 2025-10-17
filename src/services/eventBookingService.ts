import { Databases, ID, Query } from 'appwrite';
import { client } from '@/lib/appwrite';
import { 
  EventBookingDocument, 
  CreateEventBookingData, 
  UpdateEventBookingData,
  EventBookingStatus,
  generateBookingReference 
} from '@/types/event';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = 'event_bookings';

const databases = new Databases(client);

export class EventBookingService {
  // Create new event booking
  async createBooking(data: CreateEventBookingData): Promise<EventBookingDocument> {
    try {
      const bookingData = {
        ...data,
        currency: data.currency || 'EUR',
        bookingStatus: 'confirmed' as EventBookingStatus,
        bookingReference: data.bookingReference || generateBookingReference(),
      };

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        bookingData
      );

      return document as EventBookingDocument;
    } catch (error) {
      console.error('Error creating event booking:', error);
      throw error;
    }
  }

  // Get booking by ID
  async getBooking(id: string): Promise<EventBookingDocument | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
      return document as EventBookingDocument;
    } catch (error) {
      console.error('Error getting event booking:', error);
      return null;
    }
  }

  // Get bookings by event ID
  async getBookingsByEvent(eventId: string): Promise<EventBookingDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('eventId', eventId)]
      );
      return response.documents as EventBookingDocument[];
    } catch (error) {
      console.error('Error getting bookings by event:', error);
      return [];
    }
  }

  // Get bookings by user ID
  async getBookingsByUser(userId: string): Promise<EventBookingDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      return response.documents as EventBookingDocument[];
    } catch (error) {
      console.error('Error getting bookings by user:', error);
      return [];
    }
  }

  // Get confirmed bookings by event ID
  async getConfirmedBookingsByEvent(eventId: string): Promise<EventBookingDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('eventId', eventId),
          Query.equal('bookingStatus', 'confirmed')
        ]
      );
      return response.documents as EventBookingDocument[];
    } catch (error) {
      console.error('Error getting confirmed bookings by event:', error);
      return [];
    }
  }

  // Update booking
  async updateBooking(id: string, data: UpdateEventBookingData): Promise<EventBookingDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        data
      );
      return document as EventBookingDocument;
    } catch (error) {
      console.error('Error updating event booking:', error);
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(id: string): Promise<EventBookingDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        { bookingStatus: 'cancelled' as EventBookingStatus }
      );
      return document as EventBookingDocument;
    } catch (error) {
      console.error('Error cancelling event booking:', error);
      throw error;
    }
  }

  // Delete booking (permanent)
  async deleteBooking(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error('Error deleting event booking:', error);
      throw error;
    }
  }

  // Get booking statistics for an event
  async getEventBookingStats(eventId: string): Promise<{
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    generalTicketsSold: number;
    vipTicketsSold: number;
    totalRevenue: number;
  }> {
    try {
      const bookings = await this.getBookingsByEvent(eventId);
      
      const stats = {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.bookingStatus === 'confirmed').length,
        cancelledBookings: bookings.filter(b => b.bookingStatus === 'cancelled').length,
        generalTicketsSold: bookings
          .filter(b => b.bookingStatus === 'confirmed' && b.ticketType === 'general')
          .reduce((sum, b) => sum + b.quantity, 0),
        vipTicketsSold: bookings
          .filter(b => b.bookingStatus === 'confirmed' && b.ticketType === 'vip')
          .reduce((sum, b) => sum + b.quantity, 0),
        totalRevenue: bookings
          .filter(b => b.bookingStatus === 'confirmed')
          .reduce((sum, b) => sum + b.totalPrice, 0)
      };

      return stats;
    } catch (error) {
      console.error('Error getting event booking stats:', error);
      return {
        totalBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        generalTicketsSold: 0,
        vipTicketsSold: 0,
        totalRevenue: 0
      };
    }
  }

  // Check if user has already booked this event
  async hasUserBookedEvent(eventId: string, userId: string): Promise<boolean> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('eventId', eventId),
          Query.equal('userId', userId),
          Query.equal('bookingStatus', 'confirmed')
        ]
      );
      return response.documents.length > 0;
    } catch (error) {
      console.error('Error checking if user has booked event:', error);
      return false;
    }
  }

  // Get all bookings with pagination
  async getAllBookings(options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }): Promise<{
    bookings: EventBookingDocument[];
    total: number;
  }> {
    try {
      const queries = [];
      
      if (options?.limit) {
        queries.push(Query.limit(options.limit));
      }
      
      if (options?.offset) {
        queries.push(Query.offset(options.offset));
      }
      
      if (options?.orderBy) {
        queries.push(Query.orderDesc(options.orderBy));
      } else {
        queries.push(Query.orderDesc('$createdAt'));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      return {
        bookings: response.documents as EventBookingDocument[],
        total: response.total
      };
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return {
        bookings: [],
        total: 0
      };
    }
  }
}

// Export singleton instance
export const eventBookingService = new EventBookingService();
