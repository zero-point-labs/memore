import { ID, Query } from 'node-appwrite';
import { serverDatabases } from '@/lib/appwrite-server';
import { 
  GlobalSettings, 
  GlobalSettingsDocument, 
  CreateGlobalSettingsData, 
  UpdateGlobalSettingsData 
} from '@/types/booking';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'global_settings';

export class ServerGlobalSettingsService {
  // Get global settings (singleton pattern - should only be one document)
  async get(): Promise<GlobalSettingsDocument | null> {
    try {
      const response = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as GlobalSettingsDocument;
    } catch (error) {
      console.error('Error fetching global settings (server):', error);
      return null;
    }
  }

  // Create initial global settings (should only be called once)
  async create(data: CreateGlobalSettingsData): Promise<GlobalSettingsDocument> {
    try {
      const document = await serverDatabases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        data
      );

      return document as GlobalSettingsDocument;
    } catch (error) {
      console.error('Error creating global settings (server):', error);
      throw error;
    }
  }

  // Get or create global settings with defaults
  async getOrCreate(): Promise<GlobalSettingsDocument> {
    try {
      let settings = await this.get();
      
      if (!settings) {
        // Create default settings
        settings = await this.create({
          depositPercentage: 30,
          balancePercentage: 70,
          balanceDueDays: 7,
          currency: 'EUR',
          maxPaymentRetries: 3,
          retryIntervalHours: 24,
          sendBookingConfirmation: true,
          sendPaymentReminders: true,
          reminderDaysBefore: '3,1',
          adminEmail: 'admin@memora.com',
          adminAlertOnFailedPayment: true
        });
      }

      return settings;
    } catch (error) {
      console.error('Error getting or creating global settings (server):', error);
      throw error;
    }
  }

  // Calculate balance due date based on trip date and settings
  async calculateBalanceDueDate(tripDate: string): Promise<string> {
    try {
      const settings = await this.getOrCreate();
      const trip = new Date(tripDate);
      const balanceDue = new Date(trip);
      balanceDue.setDate(trip.getDate() - settings.balanceDueDays);
      
      return balanceDue.toISOString();
    } catch (error) {
      console.error('Error calculating balance due date (server):', error);
      // Fallback to 7 days before trip
      const trip = new Date(tripDate);
      const balanceDue = new Date(trip);
      balanceDue.setDate(trip.getDate() - 7);
      return balanceDue.toISOString();
    }
  }

  // Get payment amounts based on total and current settings
  async calculatePaymentAmounts(totalAmount: number): Promise<{
    depositAmount: number;
    balanceAmount: number;
    depositPercentage: number;
    balancePercentage: number;
  }> {
    try {
      const settings = await this.getOrCreate();
      const depositAmount = Math.round((totalAmount * settings.depositPercentage) / 100);
      const balanceAmount = totalAmount - depositAmount;
      
      return {
        depositAmount,
        balanceAmount,
        depositPercentage: settings.depositPercentage,
        balancePercentage: settings.balancePercentage
      };
    } catch (error) {
      console.error('Error calculating payment amounts (server):', error);
      // Fallback to 30/70 split
      const depositAmount = Math.round((totalAmount * 30) / 100);
      const balanceAmount = totalAmount - depositAmount;
      
      return {
        depositAmount,
        balanceAmount,
        depositPercentage: 30,
        balancePercentage: 70
      };
    }
  }
}

// Export singleton instance
export const serverGlobalSettingsService = new ServerGlobalSettingsService();
