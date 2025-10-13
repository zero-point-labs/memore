import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { 
  PaymentSchedule, 
  PaymentScheduleDocument, 
  CreatePaymentScheduleData, 
  UpdatePaymentScheduleData,
  PaymentStatus
} from '@/types/booking';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'payment_schedules';

export class PaymentScheduleService {
  // Get payment schedule by ID
  async getById(id: string): Promise<PaymentScheduleDocument | null> {
    try {
      const document = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
      return document as PaymentScheduleDocument;
    } catch (error) {
      console.error('Error fetching payment schedule:', error);
      return null;
    }
  }

  // Get payment schedules by booking ID
  async getByBookingId(bookingId: string): Promise<PaymentScheduleDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('bookingId', bookingId),
          Query.orderAsc('scheduledDate')
        ]
      );

      return response.documents as PaymentScheduleDocument[];
    } catch (error) {
      console.error('Error fetching payment schedules by booking:', error);
      return [];
    }
  }

  // Get payment schedules by user ID
  async getByUserId(userId: string): Promise<PaymentScheduleDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderAsc('scheduledDate')
        ]
      );

      return response.documents as PaymentScheduleDocument[];
    } catch (error) {
      console.error('Error fetching payment schedules by user:', error);
      return [];
    }
  }

  // Get payment schedules due for processing
  async getDueForProcessing(date?: Date): Promise<PaymentScheduleDocument[]> {
    try {
      const targetDate = date || new Date();
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('status', 'pending'),
          Query.lessThanEqual('scheduledDate', targetDate.toISOString()),
          Query.orderAsc('scheduledDate'),
          Query.limit(100)
        ]
      );

      return response.documents as PaymentScheduleDocument[];
    } catch (error) {
      console.error('Error fetching payment schedules due for processing:', error);
      return [];
    }
  }

  // Get failed payment schedules ready for retry
  async getReadyForRetry(): Promise<PaymentScheduleDocument[]> {
    try {
      const now = new Date();
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('status', 'failed'),
          Query.lessThan('retryCount', Query.limit(1000)), // Get all first, then filter
          Query.lessThanEqual('nextRetryAt', now.toISOString()),
          Query.orderAsc('nextRetryAt'),
          Query.limit(50)
        ]
      );

      // Filter by retry count (Appwrite doesn't support complex queries)
      const schedules = response.documents as PaymentScheduleDocument[];
      return schedules.filter(schedule => schedule.retryCount < schedule.maxRetries);
    } catch (error) {
      console.error('Error fetching payment schedules ready for retry:', error);
      return [];
    }
  }

  // Create payment schedule
  async create(data: CreatePaymentScheduleData): Promise<PaymentScheduleDocument> {
    try {
      const scheduleData = {
        ...data,
        status: data.status || 'pending' as PaymentStatus,
        retryCount: data.retryCount || 0,
        maxRetries: data.maxRetries || 3,
        currency: data.currency || 'EUR'
      };

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        scheduleData
      );

      return document as PaymentScheduleDocument;
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      throw error;
    }
  }

  // Update payment schedule
  async update(id: string, data: UpdatePaymentScheduleData): Promise<PaymentScheduleDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        data
      );

      return document as PaymentScheduleDocument;
    } catch (error) {
      console.error('Error updating payment schedule:', error);
      throw error;
    }
  }

  // Mark payment schedule as processing
  async markAsProcessing(id: string): Promise<PaymentScheduleDocument> {
    try {
      return await this.update(id, {
        status: 'processing',
        lastAttemptAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking payment schedule as processing:', error);
      throw error;
    }
  }

  // Mark payment schedule as succeeded
  async markAsSucceeded(id: string, paymentIntentId: string): Promise<PaymentScheduleDocument> {
    try {
      return await this.update(id, {
        status: 'succeeded',
        paymentIntentId,
        processedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking payment schedule as succeeded:', error);
      throw error;
    }
  }

  // Mark payment schedule as failed and schedule retry
  async markAsFailedWithRetry(id: string, errorMessage: string, retryIntervalHours: number = 24): Promise<PaymentScheduleDocument> {
    try {
      const schedule = await this.getById(id);
      if (!schedule) {
        throw new Error('Payment schedule not found');
      }

      const newRetryCount = schedule.retryCount + 1;
      const shouldRetry = newRetryCount < schedule.maxRetries;
      
      let nextRetryAt: string | undefined;
      if (shouldRetry) {
        const nextRetry = new Date();
        nextRetry.setHours(nextRetry.getHours() + retryIntervalHours);
        nextRetryAt = nextRetry.toISOString();
      }

      return await this.update(id, {
        status: shouldRetry ? 'pending' : 'failed',
        retryCount: newRetryCount,
        lastAttemptAt: new Date().toISOString(),
        nextRetryAt,
        errorMessage
      });
    } catch (error) {
      console.error('Error marking payment schedule as failed:', error);
      throw error;
    }
  }

  // Create balance payment schedule for a booking
  async createBalanceSchedule(
    bookingId: string,
    userId: string,
    amount: number,
    scheduledDate: string,
    paymentMethodId?: string
  ): Promise<PaymentScheduleDocument> {
    try {
      return await this.create({
        bookingId,
        userId,
        paymentType: 'balance',
        amount,
        currency: 'EUR',
        scheduledDate,
        paymentMethodId,
        status: 'pending',
        retryCount: 0,
        maxRetries: 3
      });
    } catch (error) {
      console.error('Error creating balance payment schedule:', error);
      throw error;
    }
  }

  // Cancel payment schedule
  async cancel(id: string): Promise<PaymentScheduleDocument> {
    try {
      return await this.update(id, {
        status: 'cancelled'
      });
    } catch (error) {
      console.error('Error cancelling payment schedule:', error);
      throw error;
    }
  }

  // Delete payment schedule
  async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error) {
      console.error('Error deleting payment schedule:', error);
      throw error;
    }
  }

  // Get payment schedule statistics
  async getStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    succeeded: number;
    failed: number;
    cancelled: number;
    totalAmount: number;
    pendingAmount: number;
  }> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.limit(1000)]
      );

      const schedules = response.documents as PaymentScheduleDocument[];
      
      const stats = {
        total: schedules.length,
        pending: 0,
        processing: 0,
        succeeded: 0,
        failed: 0,
        cancelled: 0,
        totalAmount: 0,
        pendingAmount: 0
      };

      schedules.forEach(schedule => {
        stats.totalAmount += schedule.amount;
        
        switch (schedule.status) {
          case 'pending':
            stats.pending++;
            stats.pendingAmount += schedule.amount;
            break;
          case 'processing':
            stats.processing++;
            stats.pendingAmount += schedule.amount;
            break;
          case 'succeeded':
            stats.succeeded++;
            break;
          case 'failed':
            stats.failed++;
            break;
          case 'cancelled':
            stats.cancelled++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching payment schedule stats:', error);
      return {
        total: 0,
        pending: 0,
        processing: 0,
        succeeded: 0,
        failed: 0,
        cancelled: 0,
        totalAmount: 0,
        pendingAmount: 0
      };
    }
  }

  // Get all payment schedules (for admin)
  async getAll(limit: number = 50, offset: number = 0): Promise<{
    schedules: PaymentScheduleDocument[];
    total: number;
  }> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.orderDesc('scheduledDate'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      return {
        schedules: response.documents as PaymentScheduleDocument[],
        total: response.total
      };
    } catch (error) {
      console.error('Error fetching all payment schedules:', error);
      return { schedules: [], total: 0 };
    }
  }
}

// Export singleton instance
export const paymentScheduleService = new PaymentScheduleService();
