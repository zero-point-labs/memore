import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { 
  GlobalSettings, 
  GlobalSettingsDocument, 
  CreateGlobalSettingsData, 
  UpdateGlobalSettingsData 
} from '@/types/booking';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'global_settings';

export class GlobalSettingsService {
  // Get global settings (singleton pattern - should only be one document)
  async get(): Promise<GlobalSettingsDocument | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.orderDesc('$updatedAt'), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const settings = response.documents[0] as GlobalSettingsDocument;
      
      // Parse reminderDaysBefore string to array
      if (typeof settings.reminderDaysBefore === 'string') {
        (settings as any).reminderDaysBeforeArray = settings.reminderDaysBefore
          .split(',')
          .map(day => parseInt(day.trim()))
          .filter(day => !isNaN(day));
      }

      return settings;
    } catch (error) {
      console.error('Error fetching global settings:', error);
      return null;
    }
  }

  // Create initial global settings (should only be called once)
  async create(data: CreateGlobalSettingsData): Promise<GlobalSettingsDocument> {
    try {
      // Convert reminderDaysBefore array to string if provided as array
      const settingsData = {
        ...data,
        reminderDaysBefore: Array.isArray((data as any).reminderDaysBeforeArray) 
          ? (data as any).reminderDaysBeforeArray.join(',')
          : data.reminderDaysBefore || '3,1'
      };

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        settingsData
      );

      return document as GlobalSettingsDocument;
    } catch (error) {
      console.error('Error creating global settings:', error);
      throw error;
    }
  }

  // Update global settings
  async update(data: UpdateGlobalSettingsData, updatedBy?: string): Promise<GlobalSettingsDocument> {
    try {
      const settings = await this.get();
      if (!settings) {
        throw new Error('Global settings not found. Please create them first.');
      }

      // Convert reminderDaysBefore array to string if provided as array
      const updateData = {
        ...data,
        updatedBy: updatedBy || 'system',
        reminderDaysBefore: Array.isArray((data as any).reminderDaysBeforeArray) 
          ? (data as any).reminderDaysBeforeArray.join(',')
          : data.reminderDaysBefore
      };

      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        settings.$id,
        updateData
      );

      return document as GlobalSettingsDocument;
    } catch (error) {
      console.error('Error updating global settings:', error);
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
      console.error('Error getting or creating global settings:', error);
      throw error;
    }
  }

  // Get payment settings
  async getPaymentSettings(): Promise<{
    depositPercentage: number;
    balancePercentage: number;
    balanceDueDays: number;
    currency: string;
    maxPaymentRetries: number;
    retryIntervalHours: number;
  }> {
    try {
      const settings = await this.getOrCreate();
      
      return {
        depositPercentage: settings.depositPercentage,
        balancePercentage: settings.balancePercentage,
        balanceDueDays: settings.balanceDueDays,
        currency: settings.currency,
        maxPaymentRetries: settings.maxPaymentRetries,
        retryIntervalHours: settings.retryIntervalHours
      };
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      // Return defaults if error
      return {
        depositPercentage: 30,
        balancePercentage: 70,
        balanceDueDays: 7,
        currency: 'EUR',
        maxPaymentRetries: 3,
        retryIntervalHours: 24
      };
    }
  }

  // Get notification settings
  async getNotificationSettings(): Promise<{
    sendBookingConfirmation: boolean;
    sendPaymentReminders: boolean;
    reminderDaysBefore: number[];
    adminEmail: string;
    adminAlertOnFailedPayment: boolean;
  }> {
    try {
      const settings = await this.getOrCreate();
      
      return {
        sendBookingConfirmation: settings.sendBookingConfirmation,
        sendPaymentReminders: settings.sendPaymentReminders,
        reminderDaysBefore: settings.reminderDaysBefore
          .split(',')
          .map(day => parseInt(day.trim()))
          .filter(day => !isNaN(day)),
        adminEmail: settings.adminEmail,
        adminAlertOnFailedPayment: settings.adminAlertOnFailedPayment
      };
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Return defaults if error
      return {
        sendBookingConfirmation: true,
        sendPaymentReminders: true,
        reminderDaysBefore: [3, 1],
        adminEmail: 'admin@memora.com',
        adminAlertOnFailedPayment: true
      };
    }
  }

  // Update payment settings
  async updatePaymentSettings(settings: {
    depositPercentage?: number;
    balancePercentage?: number;
    balanceDueDays?: number;
    currency?: string;
    maxPaymentRetries?: number;
    retryIntervalHours?: number;
  }, updatedBy?: string): Promise<GlobalSettingsDocument> {
    try {
      return await this.update(settings, updatedBy);
    } catch (error) {
      console.error('Error updating payment settings:', error);
      throw error;
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings: {
    sendBookingConfirmation?: boolean;
    sendPaymentReminders?: boolean;
    reminderDaysBefore?: number[];
    adminEmail?: string;
    adminAlertOnFailedPayment?: boolean;
  }, updatedBy?: string): Promise<GlobalSettingsDocument> {
    try {
      const updateData: any = { ...settings };
      
      // Convert reminderDaysBefore array to string
      if (settings.reminderDaysBefore) {
        updateData.reminderDaysBefore = settings.reminderDaysBefore.join(',');
      }

      return await this.update(updateData, updatedBy);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  // Calculate balance due date based on trip date and settings
  async calculateBalanceDueDate(tripDate: string): Promise<string> {
    try {
      const settings = await this.getPaymentSettings();
      const trip = new Date(tripDate);
      const balanceDue = new Date(trip);
      balanceDue.setDate(trip.getDate() - settings.balanceDueDays);
      
      return balanceDue.toISOString();
    } catch (error) {
      console.error('Error calculating balance due date:', error);
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
      const settings = await this.getPaymentSettings();
      const depositAmount = Math.round((totalAmount * settings.depositPercentage) / 100);
      const balanceAmount = totalAmount - depositAmount;
      
      return {
        depositAmount,
        balanceAmount,
        depositPercentage: settings.depositPercentage,
        balancePercentage: settings.balancePercentage
      };
    } catch (error) {
      console.error('Error calculating payment amounts:', error);
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
export const globalSettingsService = new GlobalSettingsService();
