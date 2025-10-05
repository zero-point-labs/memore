import { ID, Query, Models } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { 
  Event, 
  EventDocument, 
  CreateEventData, 
  UpdateEventData, 
  UpdateEventCapacityData,
  calculateCapacityRemaining, 
  determineEventBookingStatus,
  generateSlug
} from '@/types/event';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'events';

export class EventService {
  // Helper to parse event document
  private parseEventDocument(doc: Models.Document): EventDocument {
    return {
      ...(doc as unknown as EventDocument),
      eventDetails: JSON.parse((doc as unknown as { eventDetails: string }).eventDetails),
      venueInfo: JSON.parse((doc as unknown as { venueInfo: string }).venueInfo),
      pricing: JSON.parse((doc as unknown as { pricing: string }).pricing),
      capacity: JSON.parse((doc as unknown as { capacity: string }).capacity),
      eventContent: JSON.parse((doc as unknown as { eventContent: string }).eventContent),
    };
  }

  // Get all events with optional filters
  async getEvents(options?: {
    eventType?: string;
    city?: string;
    published?: boolean;
    featured?: boolean;
    bookingStatus?: string;
    limit?: number;
    offset?: number;
  }): Promise<EventDocument[]> {
    try {
      const queries = [];
      
      if (options?.eventType && options.eventType !== 'all') {
        queries.push(Query.equal('eventType', options.eventType));
      }
      
      if (options?.city && options.city !== 'all') {
        queries.push(Query.equal('city', options.city));
      }
      
      if (options?.published !== undefined) {
        queries.push(Query.equal('published', options.published));
      }
      
      if (options?.featured !== undefined) {
        queries.push(Query.equal('featured', options.featured));
      }
      
      if (options?.bookingStatus && options.bookingStatus !== 'all') {
        queries.push(Query.equal('bookingStatus', options.bookingStatus));
      }
      
      queries.push(Query.orderAsc('eventDate'));
      
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

      return response.documents.map(doc => this.parseEventDocument(doc));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get a single event by ID
  async getEvent(id: string): Promise<EventDocument | null> {
    try {
      const document = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );

      return this.parseEventDocument(document);
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  // Get event by slug
  async getEventBySlug(slug: string): Promise<EventDocument | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('slug', slug),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) return null;
      return this.parseEventDocument(response.documents[0]);
    } catch (error) {
      console.error('Error fetching event by slug:', error);
      return null;
    }
  }

  // Get featured events (for homepage)
  async getFeaturedEvents(limit: number = 4): Promise<EventDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('published', true),
          Query.equal('featured', true),
          Query.orderAsc('eventDate'),
          Query.limit(limit)
        ]
      );

      return response.documents.map(doc => this.parseEventDocument(doc));
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  }

  // Get upcoming events
  async getUpcomingEvents(limit: number = 20): Promise<EventDocument[]> {
    try {
      const now = new Date().toISOString();
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('published', true),
          Query.greaterThan('eventDate', now),
          Query.orderAsc('eventDate'),
          Query.limit(limit)
        ]
      );

      return response.documents.map(doc => this.parseEventDocument(doc));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  // Create a new event
  async createEvent(data: CreateEventData): Promise<EventDocument> {
    try {
      // Auto-generate slug if not provided
      if (!data.slug) {
        data.slug = generateSlug(data.title);
      }

      // Calculate capacity remaining
      const generalRemaining = calculateCapacityRemaining(data.capacity.general, data.capacity.generalTaken);
      const vipRemaining = calculateCapacityRemaining(data.capacity.vip, data.capacity.vipTaken);
      
      data.capacity.generalRemaining = generalRemaining;
      data.capacity.vipRemaining = vipRemaining;

      // Auto-determine booking status if not provided
      if (!data.bookingStatus) {
        data.bookingStatus = determineEventBookingStatus(
          generalRemaining, 
          vipRemaining, 
          data.capacity.general, 
          data.capacity.vip
        );
      }

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          title: data.title,
          slug: data.slug,
          description: data.description,
          eventType: data.eventType,
          city: data.city,
          eventDate: data.eventDate,
          bookingStatus: data.bookingStatus,
          published: data.published || false,
          featured: data.featured || false,
          eventDetails: JSON.stringify(data.eventDetails),
          venueInfo: JSON.stringify(data.venueInfo),
          pricing: JSON.stringify(data.pricing),
          capacity: JSON.stringify(data.capacity),
          eventContent: JSON.stringify(data.eventContent),
        }
      );

      return this.parseEventDocument(document);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update an event
  async updateEvent(id: string, data: UpdateEventData): Promise<EventDocument> {
    try {
      const updateData: Record<string, unknown> = {};
      
      // Direct fields
      if (data.title !== undefined) updateData.title = data.title;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.eventType !== undefined) updateData.eventType = data.eventType;
      if (data.city !== undefined) updateData.city = data.city;
      if (data.eventDate !== undefined) updateData.eventDate = data.eventDate;
      if (data.bookingStatus !== undefined) updateData.bookingStatus = data.bookingStatus;
      if (data.published !== undefined) updateData.published = data.published;
      if (data.featured !== undefined) updateData.featured = data.featured;
      
      // JSON fields
      if (data.eventDetails) {
        updateData.eventDetails = JSON.stringify(data.eventDetails);
      }
      
      if (data.venueInfo) {
        updateData.venueInfo = JSON.stringify(data.venueInfo);
      }
      
      if (data.pricing) {
        updateData.pricing = JSON.stringify(data.pricing);
      }
      
      if (data.capacity) {
        const generalRemaining = calculateCapacityRemaining(data.capacity.general, data.capacity.generalTaken);
        const vipRemaining = calculateCapacityRemaining(data.capacity.vip, data.capacity.vipTaken);
        
        data.capacity.generalRemaining = generalRemaining;
        data.capacity.vipRemaining = vipRemaining;
        
        if (!data.bookingStatus) {
          updateData.bookingStatus = determineEventBookingStatus(
            generalRemaining, 
            vipRemaining, 
            data.capacity.general, 
            data.capacity.vip
          );
        }
        
        updateData.capacity = JSON.stringify(data.capacity);
      }
      
      if (data.eventContent) {
        updateData.eventContent = JSON.stringify(data.eventContent);
      }

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );

      return this.parseEventDocument(document);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Update event capacity only
  async updateEventCapacity(id: string, capacityData: UpdateEventCapacityData): Promise<EventDocument> {
    try {
      const currentEvent = await this.getEvent(id);
      if (!currentEvent) {
        throw new Error('Event not found');
      }

      const updatedCapacity = {
        ...currentEvent.capacity,
        generalTaken: capacityData.generalTaken ?? currentEvent.capacity.generalTaken,
        vipTaken: capacityData.vipTaken ?? currentEvent.capacity.vipTaken,
      };

      const generalRemaining = calculateCapacityRemaining(
        updatedCapacity.general, 
        updatedCapacity.generalTaken
      );
      const vipRemaining = calculateCapacityRemaining(
        updatedCapacity.vip, 
        updatedCapacity.vipTaken
      );
      
      updatedCapacity.generalRemaining = generalRemaining;
      updatedCapacity.vipRemaining = vipRemaining;

      const bookingStatus = capacityData.bookingStatus || determineEventBookingStatus(
        generalRemaining, 
        vipRemaining, 
        updatedCapacity.general, 
        updatedCapacity.vip
      );

      return await this.updateEvent(id, { 
        capacity: updatedCapacity,
        bookingStatus 
      });
    } catch (error) {
      console.error('Error updating event capacity:', error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(id: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Toggle published status
  async togglePublished(id: string, published: boolean): Promise<EventDocument> {
    return await this.updateEvent(id, { published });
  }

  // Book a ticket (increment taken count)
  async bookTicket(id: string, ticketType: 'general' | 'vip', quantity: number = 1): Promise<EventDocument> {
    try {
      const currentEvent = await this.getEvent(id);
      if (!currentEvent) {
        throw new Error('Event not found');
      }

      const field = ticketType === 'general' ? 'generalTaken' : 'vipTaken';
      const newTaken = currentEvent.capacity[field] + quantity;
      const totalCapacity = ticketType === 'general' ? currentEvent.capacity.general : currentEvent.capacity.vip;
      
      if (newTaken > totalCapacity) {
        throw new Error(`Not enough ${ticketType} tickets available`);
      }

      return await this.updateEventCapacity(id, {
        [field]: newTaken
      });
    } catch (error) {
      console.error('Error booking ticket:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const eventService = new EventService();
