import { ID, Query } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { 
  Notification, 
  NotificationDocument, 
  CreateNotificationData, 
  UpdateNotificationData 
} from '@/types/booking';
import { sendEmail, generateBookingConfirmationEmail } from '@/lib/resend';
import { globalSettingsService } from './globalSettingsService';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'notifications';

export class NotificationService {
  // Get notification by ID
  async getById(id: string): Promise<NotificationDocument | null> {
    try {
      const document = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
      return document as NotificationDocument;
    } catch (error) {
      console.error('Error fetching notification:', error);
      return null;
    }
  }

  // Get notifications by user ID
  async getByUserId(userId: string, limit: number = 50): Promise<NotificationDocument[]> {
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

      return response.documents as NotificationDocument[];
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  }

  // Get notifications by booking ID
  async getByBookingId(bookingId: string): Promise<NotificationDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('bookingId', bookingId),
          Query.orderDesc('$createdAt')
        ]
      );

      return response.documents as NotificationDocument[];
    } catch (error) {
      console.error('Error fetching booking notifications:', error);
      return [];
    }
  }

  // Get pending notifications
  async getPending(limit: number = 100): Promise<NotificationDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('status', 'pending'),
          Query.orderAsc('$createdAt'),
          Query.limit(limit)
        ]
      );

      return response.documents as NotificationDocument[];
    } catch (error) {
      console.error('Error fetching pending notifications:', error);
      return [];
    }
  }

  // Create notification record
  async create(data: CreateNotificationData): Promise<NotificationDocument> {
    try {
      const notificationData = {
        ...data,
        status: data.status || 'pending',
        retryCount: data.retryCount || 0,
        maxRetries: data.maxRetries || 3
      };

      const document = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        notificationData
      );

      return document as NotificationDocument;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Update notification
  async update(id: string, data: UpdateNotificationData): Promise<NotificationDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        data
      );

      return document as NotificationDocument;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  // Mark notification as sent
  async markAsSent(id: string, externalId?: string): Promise<NotificationDocument> {
    try {
      return await this.update(id, {
        status: 'sent',
        sentAt: new Date().toISOString(),
        externalId
      });
    } catch (error) {
      console.error('Error marking notification as sent:', error);
      throw error;
    }
  }

  // Mark notification as delivered
  async markAsDelivered(id: string): Promise<NotificationDocument> {
    try {
      return await this.update(id, {
        status: 'delivered',
        deliveredAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking notification as delivered:', error);
      throw error;
    }
  }

  // Mark notification as failed
  async markAsFailed(id: string, errorMessage: string): Promise<NotificationDocument> {
    try {
      const notification = await this.getById(id);
      if (!notification) {
        throw new Error('Notification not found');
      }

      const newRetryCount = notification.retryCount + 1;
      const shouldRetry = newRetryCount < notification.maxRetries;

      return await this.update(id, {
        status: shouldRetry ? 'pending' : 'failed',
        retryCount: newRetryCount,
        errorMessage
      });
    } catch (error) {
      console.error('Error marking notification as failed:', error);
      throw error;
    }
  }

  // Send booking confirmation email
  async sendBookingConfirmation({
    userId,
    bookingId,
    customerName,
    customerEmail,
    tripTitle,
    tripDate,
    depositAmount,
    balanceAmount,
    balanceDueDate
  }: {
    userId: string;
    bookingId: string;
    customerName: string;
    customerEmail: string;
    tripTitle: string;
    tripDate: string;
    depositAmount: number;
    balanceAmount: number;
    balanceDueDate: string;
  }): Promise<NotificationDocument> {
    try {
      // Check if booking confirmation should be sent
      const settings = await globalSettingsService.getNotificationSettings();
      if (!settings.sendBookingConfirmation) {
        throw new Error('Booking confirmations are disabled');
      }

      // Generate email content
      const { html, text } = generateBookingConfirmationEmail({
        customerName,
        tripTitle,
        tripDate: new Date(tripDate).toLocaleDateString(),
        depositAmount,
        balanceAmount,
        balanceDueDate: new Date(balanceDueDate).toLocaleDateString()
      });

      // Create notification record
      const notification = await this.create({
        userId,
        bookingId,
        type: 'booking_confirmation',
        method: 'email',
        recipient: customerEmail,
        subject: 'Booking Confirmed - Your Cyprus Adventure Awaits!',
        content: text,
        template: 'booking-confirmation'
      });

      // Send email
      const result = await sendEmail({
        to: customerEmail,
        subject: 'Booking Confirmed - Your Cyprus Adventure Awaits!',
        html,
        text,
        template: 'booking-confirmation'
      });

      if (result.success) {
        await this.markAsSent(notification.$id, result.id);
      } else {
        await this.markAsFailed(notification.$id, result.error?.toString() || 'Unknown error');
      }

      return notification;
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      throw error;
    }
  }

  // Send payment success notification
  async sendPaymentSuccess({
    userId,
    bookingId,
    customerEmail,
    customerName,
    amount,
    paymentType,
    tripTitle
  }: {
    userId: string;
    bookingId: string;
    customerEmail: string;
    customerName: string;
    amount: number;
    paymentType: 'deposit' | 'balance';
    tripTitle: string;
  }): Promise<NotificationDocument> {
    try {
      const subject = `Payment Confirmed - €${amount} ${paymentType === 'deposit' ? 'Deposit' : 'Balance'} Received`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Payment Confirmed! ✅</h2>
          <p>Hi ${customerName},</p>
          <p>We've successfully received your ${paymentType} payment of <strong>€${amount}</strong> for ${tripTitle}.</p>
          ${paymentType === 'deposit' 
            ? '<p>Your booking is now confirmed! We\'ll automatically charge the remaining balance one week before your trip.</p>'
            : '<p>Your booking is now fully paid! Get ready for an amazing Cyprus adventure!</p>'
          }
          <p>Questions? Reply to this email or contact us at support@memora.com</p>
        </div>
      `;

      const text = `Payment Confirmed! We've received your ${paymentType} payment of €${amount} for ${tripTitle}.`;

      // Create notification record
      const notification = await this.create({
        userId,
        bookingId,
        type: 'payment_success',
        method: 'email',
        recipient: customerEmail,
        subject,
        content: text,
        template: 'payment-success'
      });

      // Send email
      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text,
        template: 'payment-success'
      });

      if (result.success) {
        await this.markAsSent(notification.$id, result.id);
      } else {
        await this.markAsFailed(notification.$id, result.error?.toString() || 'Unknown error');
      }

      return notification;
    } catch (error) {
      console.error('Error sending payment success notification:', error);
      throw error;
    }
  }

  // Send payment reminder
  async sendPaymentReminder({
    userId,
    bookingId,
    customerEmail,
    customerName,
    amount,
    dueDate,
    tripTitle
  }: {
    userId: string;
    bookingId: string;
    customerEmail: string;
    customerName: string;
    amount: number;
    dueDate: string;
    tripTitle: string;
  }): Promise<NotificationDocument> {
    try {
      const dueDateFormatted = new Date(dueDate).toLocaleDateString();
      const subject = `Payment Reminder - €${amount} Balance Due ${dueDateFormatted}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Payment Reminder ⏰</h2>
          <p>Hi ${customerName},</p>
          <p>This is a friendly reminder that your balance payment of <strong>€${amount}</strong> for ${tripTitle} is due on <strong>${dueDateFormatted}</strong>.</p>
          <p>We'll automatically charge your saved payment method on the due date. No action needed from you!</p>
          <p>If you need to update your payment method, please visit your account dashboard.</p>
          <p>Questions? Reply to this email or contact us at support@memora.com</p>
        </div>
      `;

      const text = `Payment Reminder: Your balance of €${amount} for ${tripTitle} is due ${dueDateFormatted}. We'll charge your saved payment method automatically.`;

      // Create notification record
      const notification = await this.create({
        userId,
        bookingId,
        type: 'payment_reminder',
        method: 'email',
        recipient: customerEmail,
        subject,
        content: text,
        template: 'payment-reminder'
      });

      // Send email
      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text,
        template: 'payment-reminder'
      });

      if (result.success) {
        await this.markAsSent(notification.$id, result.id);
      } else {
        await this.markAsFailed(notification.$id, result.error?.toString() || 'Unknown error');
      }

      return notification;
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      throw error;
    }
  }

  // Send admin alert
  async sendAdminAlert({
    type,
    subject,
    message,
    bookingId,
    userId
  }: {
    type: string;
    subject: string;
    message: string;
    bookingId?: string;
    userId?: string;
  }): Promise<NotificationDocument> {
    try {
      const settings = await globalSettingsService.getNotificationSettings();
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Admin Alert: ${type}</h2>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${message}</p>
          ${bookingId ? `<p><strong>Booking ID:</strong> ${bookingId}</p>` : ''}
          ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ''}
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `;

      // Create notification record
      const notification = await this.create({
        userId: userId || 'system',
        bookingId,
        type: 'admin_alert',
        method: 'email',
        recipient: settings.adminEmail,
        subject: `[ADMIN ALERT] ${subject}`,
        content: message,
        template: 'admin-alert'
      });

      // Send email
      const result = await sendEmail({
        to: settings.adminEmail,
        subject: `[ADMIN ALERT] ${subject}`,
        html,
        text: `Admin Alert: ${type}\n\n${message}`,
        template: 'admin-alert'
      });

      if (result.success) {
        await this.markAsSent(notification.$id, result.id);
      } else {
        await this.markAsFailed(notification.$id, result.error?.toString() || 'Unknown error');
      }

      return notification;
    } catch (error) {
      console.error('Error sending admin alert:', error);
      throw error;
    }
  }

  // Process pending notifications (for cron job)
  async processPending(): Promise<{
    processed: number;
    failed: number;
    errors: string[];
  }> {
    try {
      const pendingNotifications = await this.getPending(50);
      let processed = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const notification of pendingNotifications) {
        try {
          if (notification.method === 'email') {
            const result = await sendEmail({
              to: notification.recipient,
              subject: notification.subject || 'Notification from Memora',
              html: notification.content,
              text: notification.content,
              template: notification.template as any
            });

            if (result.success) {
              await this.markAsSent(notification.$id, result.id);
              processed++;
            } else {
              await this.markAsFailed(notification.$id, result.error?.toString() || 'Unknown error');
              failed++;
              errors.push(`Email failed for ${notification.recipient}: ${result.error}`);
            }
          }
          // TODO: Add SMS processing here when SMS service is implemented
        } catch (error) {
          await this.markAsFailed(notification.$id, error?.toString() || 'Unknown error');
          failed++;
          errors.push(`Processing failed for notification ${notification.$id}: ${error}`);
        }
      }

      return { processed, failed, errors };
    } catch (error) {
      console.error('Error processing pending notifications:', error);
      return { processed: 0, failed: 0, errors: [error?.toString() || 'Unknown error'] };
    }
  }

  // Get notification statistics
  async getStats(): Promise<{
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
    bounced: number;
  }> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.limit(1000)]
      );

      const notifications = response.documents as NotificationDocument[];
      
      const stats = {
        total: notifications.length,
        pending: 0,
        sent: 0,
        delivered: 0,
        failed: 0,
        bounced: 0
      };

      notifications.forEach(notification => {
        switch (notification.status) {
          case 'pending':
            stats.pending++;
            break;
          case 'sent':
            stats.sent++;
            break;
          case 'delivered':
            stats.delivered++;
            break;
          case 'failed':
            stats.failed++;
            break;
          case 'bounced':
            stats.bounced++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return {
        total: 0,
        pending: 0,
        sent: 0,
        delivered: 0,
        failed: 0,
        bounced: 0
      };
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
