import { ID, Query } from 'node-appwrite';
import { serverDatabases } from '@/lib/appwrite-server';
import { 
  PaymentSchedule, 
  PaymentScheduleDocument, 
  CreatePaymentScheduleData, 
  PaymentStatus
} from '@/types/booking';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'payment_schedules';

export class ServerPaymentScheduleService {
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

      const document = await serverDatabases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        scheduleData
      );

      return document as PaymentScheduleDocument;
    } catch (error) {
      console.error('Error creating payment schedule (server):', error);
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
      console.error('Error creating balance payment schedule (server):', error);
      throw error;
    }
  }
}

// Export singleton instance
export const serverPaymentScheduleService = new ServerPaymentScheduleService();
