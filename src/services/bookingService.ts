import { ID, Query, Models } from 'appwrite';
import { databases } from '@/lib/appwrite';
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

export class BookingService {
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
      const document = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
      return this.deserializeBooking(document);
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  // Get bookings by user ID
  async getByUserId(userId: string, limit: number = 50): Promise<BookingDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );

      return response.documents.map(doc => this.deserializeBooking(doc));
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  // Get bookings by trip ID
  async getByTripId(tripId: string, limit: number = 100): Promise<BookingDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('tripId', tripId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );

      return response.documents.map(doc => this.deserializeBooking(doc));
    } catch (error) {
      console.error('Error fetching trip bookings:', error);
      return [];
    }
  }

  // Get bookings by status
  async getByStatus(status: BookingStatus, limit: number = 100): Promise<BookingDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('bookingStatus', status),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );

      return response.documents.map(doc => this.deserializeBooking(doc));
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      return [];
    }
  }

  // Get bookings with balance due soon
  async getBalanceDueSoon(days: number = 7): Promise<BookingDocument[]> {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + days);

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('bookingStatus', 'deposit_paid'),
          Query.lessThanEqual('balanceDueDate', futureDate.toISOString()),
          Query.greaterThan('balanceDueDate', now.toISOString()),
          Query.orderAsc('balanceDueDate')
        ]
      );

      return response.documents.map(doc => this.deserializeBooking(doc));
    } catch (error) {
      console.error('Error fetching bookings with balance due soon:', error);
      return [];
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

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        bookingData
      );

      return document as BookingDocument;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Update booking
  async update(id: string, data: UpdateBookingData): Promise<BookingDocument> {
    try {
      // Recalculate amounts if total amount changed
      if (data.totalAmount) {
        const paymentAmounts = calculatePaymentAmounts(data.totalAmount);
        data.depositAmount = paymentAmounts.depositAmount;
        data.balanceAmount = paymentAmounts.balanceAmount;
      }

      // Serialize paymentInfo if it exists
      const updateData = { ...data };
      if (updateData.paymentInfo) {
        updateData.paymentInfo = JSON.stringify(updateData.paymentInfo);
      }

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );

      return document as BookingDocument;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Update booking status
  async updateStatus(id: string, bookingStatus: BookingStatus, paymentStatus?: PaymentStatus): Promise<BookingDocument> {
    try {
      const updateData: UpdateBookingData = { bookingStatus };
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }

      return await this.update(id, updateData);
    } catch (error) {
      console.error('Error updating booking status:', error);
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
      console.error('Error updating payment info:', error);
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
      console.error('Error marking deposit as paid:', error);
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
      console.error('Error marking balance as paid:', error);
      throw error;
    }
  }

  // Cancel booking
  async cancel(id: string, reason?: string): Promise<BookingDocument> {
    try {
      return await this.update(id, {
        bookingStatus: 'cancelled',
        paymentStatus: 'cancelled',
        specialRequests: reason ? `${reason} (Cancelled)` : 'Cancelled'
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Delete booking
  async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Get booking statistics
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
      const [allBookings] = await Promise.all([
        databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(1000)])
      ]);

      const bookings = allBookings.documents as BookingDocument[];
      
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
      console.error('Error fetching booking stats:', error);
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

  // Get all bookings (for admin, with pagination)
  async getAll(limit: number = 50, offset: number = 0): Promise<{
    bookings: BookingDocument[];
    total: number;
  }> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      return {
        bookings: response.documents as BookingDocument[],
        total: response.total
      };
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      return { bookings: [], total: 0 };
    }
  }

  // Search bookings (for admin)
  async search(query: string, limit: number = 20): Promise<BookingDocument[]> {
    try {
      // Note: This is a simple search. For more complex searches, you might need to implement
      // multiple queries and combine results
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.search('specialRequests', query),
          Query.limit(limit)
        ]
      );

      return response.documents.map(doc => this.deserializeBooking(doc));
    } catch (error) {
      console.error('Error searching bookings:', error);
      return [];
    }
  }
}

// Export singleton instance
export const bookingService = new BookingService();
