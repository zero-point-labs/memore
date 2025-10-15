import { ID, Query } from 'node-appwrite';
import { serverDatabases } from '@/lib/appwrite-server';
import { 
  Booking, 
  BookingDocument, 
  CreateBookingData, 
  UpdateBookingData,
  BookingStatus,
  PaymentStatus
} from '@/types/booking';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'bookings';

export class ServerBookingService {
  // Helper function to deserialize paymentInfo
  private deserializeBooking(doc: any): BookingDocument {
    const booking = doc as BookingDocument;
    
    // Deserialize paymentInfo if it exists
    if (booking.paymentInfo && typeof booking.paymentInfo === 'string') {
      try {
        booking.paymentInfo = JSON.parse(booking.paymentInfo);
      } catch (parseError) {
        console.warn(`Failed to parse paymentInfo JSON for booking ${booking.$id}:`, parseError);
        booking.paymentInfo = undefined;
      }
    }
    
    return booking;
  }

  // Get booking by ID
  async getById(id: string): Promise<BookingDocument | null> {
    try {
      const document = await serverDatabases.getDocument(DATABASE_ID, COLLECTION_ID, id);
      return this.deserializeBooking(document);
    } catch (error) {
      console.error('Error fetching booking (server):', error);
      return null;
    }
  }

  // Create new booking
  async create(data: CreateBookingData): Promise<BookingDocument> {
    try {
      // Use the payment amounts passed from the API (already calculated with correct settings)
      const bookingData = {
        ...data,
        currency: data.currency || 'EUR',
        bookingStatus: data.bookingStatus || 'pending' as BookingStatus,
        paymentStatus: data.paymentStatus || 'pending' as PaymentStatus,
      };

      const document = await serverDatabases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        bookingData
      );

      return document as BookingDocument;
    } catch (error) {
      console.error('Error creating booking (server):', error);
      throw error;
    }
  }

  // Update booking
  async update(id: string, data: UpdateBookingData): Promise<BookingDocument> {
    try {
      // Serialize paymentInfo if it exists
      const updateData = { ...data };
      if (updateData.paymentInfo) {
        updateData.paymentInfo = JSON.stringify(updateData.paymentInfo);
      }

      const document = await serverDatabases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );

      return document as BookingDocument;
    } catch (error) {
      console.error('Error updating booking (server):', error);
      throw error;
    }
  }

  // Update payment information
  async updatePaymentInfo(id: string, paymentInfo: {
    depositPaymentIntentId?: string;
    balancePaymentIntentId?: string;
    paymentMethodId?: string;
    paymentStatus?: PaymentStatus;
  }): Promise<BookingDocument> {
    try {
      return await this.update(id, paymentInfo);
    } catch (error) {
      console.error('Error updating payment info (server):', error);
      throw error;
    }
  }

  // Mark deposit as paid
  async markDepositPaid(id: string, paymentIntentId: string, paymentMethodId?: string): Promise<BookingDocument> {
    try {
      return await this.update(id, {
        bookingStatus: 'deposit_paid',
        paymentStatus: 'succeeded',
        depositPaymentIntentId: paymentIntentId,
        paymentMethodId: paymentMethodId
      });
    } catch (error) {
      console.error('Error marking deposit as paid (server):', error);
      throw error;
    }
  }

  // Mark balance as paid
  async markBalancePaid(id: string, paymentIntentId: string): Promise<BookingDocument> {
    try {
      return await this.update(id, {
        bookingStatus: 'fully_paid',
        paymentStatus: 'succeeded',
        balancePaymentIntentId: paymentIntentId
      });
    } catch (error) {
      console.error('Error marking balance as paid (server):', error);
      throw error;
    }
  }

  // Get booking statistics (server-side)
  async getStats(): Promise<{
    total: number;
    pending: number;
    depositPaid: number;
    fullyPaid: number;
    cancelled: number;
    totalRevenue: number;
    pendingRevenue: number;
  }> {
    try {
      const response = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.limit(1000)]
      );

      const bookings = response.documents.map(doc => this.deserializeBooking(doc));
      
      const stats = {
        total: bookings.length,
        pending: 0,
        depositPaid: 0,
        fullyPaid: 0,
        cancelled: 0,
        totalRevenue: 0,
        pendingRevenue: 0
      };

      bookings.forEach(booking => {
        switch (booking.bookingStatus) {
          case 'pending':
            stats.pending++;
            stats.pendingRevenue += booking.totalAmount;
            break;
          case 'deposit_paid':
            stats.depositPaid++;
            stats.totalRevenue += booking.depositAmount;
            stats.pendingRevenue += booking.balanceAmount;
            break;
          case 'fully_paid':
            stats.fullyPaid++;
            stats.totalRevenue += booking.totalAmount;
            break;
          case 'cancelled':
            stats.cancelled++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching booking stats (server):', error);
      return {
        total: 0,
        pending: 0,
        depositPaid: 0,
        fullyPaid: 0,
        cancelled: 0,
        totalRevenue: 0,
        pendingRevenue: 0
      };
    }
  }

  // Get all bookings (server-side)
  async getAll(limit: number = 50): Promise<{ bookings: BookingDocument[]; total: number }> {
    try {
      const response = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );

      return {
        bookings: response.documents.map(doc => this.deserializeBooking(doc)),
        total: response.total
      };
    } catch (error) {
      console.error('Error fetching all bookings (server):', error);
      return { bookings: [], total: 0 };
    }
  }
}

// Export singleton instance
export const serverBookingService = new ServerBookingService();
