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
import { calculatePaymentAmounts } from '@/lib/stripe';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'bookings';

export class ServerBookingService {
  // Get booking by ID
  async getById(id: string): Promise<BookingDocument | null> {
    try {
      const document = await serverDatabases.getDocument(DATABASE_ID, COLLECTION_ID, id);
      return document as BookingDocument;
    } catch (error) {
      console.error('Error fetching booking (server):', error);
      return null;
    }
  }

  // Create new booking
  async create(data: CreateBookingData): Promise<BookingDocument> {
    try {
      // Calculate payment amounts
      const paymentAmounts = calculatePaymentAmounts(data.totalAmount);
      
      const bookingData = {
        ...data,
        depositAmount: paymentAmounts.depositAmount,
        balanceAmount: paymentAmounts.balanceAmount,
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
      // Recalculate amounts if total amount changed
      if (data.totalAmount) {
        const paymentAmounts = calculatePaymentAmounts(data.totalAmount);
        data.depositAmount = paymentAmounts.depositAmount;
        data.balanceAmount = paymentAmounts.balanceAmount;
      }

      const document = await serverDatabases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        data
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
        bookings: response.documents as BookingDocument[],
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
