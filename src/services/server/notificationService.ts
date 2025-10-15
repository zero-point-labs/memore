import { ID } from 'node-appwrite';
import { serverDatabases } from '@/lib/appwrite-server';
import { 
  CreateNotificationData, 
  NotificationDocument
} from '@/types/booking';
import { sendServerEmail, generateBookingConfirmationEmail, generatePaymentLinkEmail } from '@/lib/resend-server';
import { serverGlobalSettingsService } from './globalSettingsService';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'notifications';

export class ServerNotificationService {
  // Create notification record
  async create(data: CreateNotificationData): Promise<NotificationDocument> {
    try {
      const notificationData = {
        ...data,
        status: data.status || 'pending',
        retryCount: data.retryCount || 0,
        maxRetries: data.maxRetries || 3
      };

      const document = await serverDatabases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        notificationData
      );

      return document as NotificationDocument;
    } catch (error) {
      console.error('Error creating notification (server):', error);
      throw error;
    }
  }

  // Update notification
  async update(id: string, data: any): Promise<NotificationDocument> {
    try {
      const document = await serverDatabases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        data
      );

      return document as NotificationDocument;
    } catch (error) {
      console.error('Error updating notification (server):', error);
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
      console.error('Error marking notification as sent (server):', error);
      throw error;
    }
  }

  // Mark notification as failed
  async markAsFailed(id: string, errorMessage: string): Promise<NotificationDocument> {
    try {
      return await this.update(id, {
        status: 'failed',
        errorMessage
      });
    } catch (error) {
      console.error('Error marking notification as failed (server):', error);
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
      // Generate email content
      const { html, text } = generateBookingConfirmationEmail({
        customerName,
        tripTitle,
        tripDate: new Date(tripDate).toLocaleDateString('en-GB'),
        depositAmount,
        balanceAmount,
        balanceDueDate: new Date(balanceDueDate).toLocaleDateString('en-GB')
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
      const result = await sendServerEmail({
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
      console.error('Error sending booking confirmation (server):', error);
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
      const adminEmail = 'admin@memora.com'; // Fallback admin email
      
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
        recipient: adminEmail,
        subject: `[ADMIN ALERT] ${subject}`,
        content: message,
        template: 'admin-alert'
      });

      // Send email
      const result = await sendServerEmail({
        to: adminEmail,
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
      console.error('Error sending admin alert (server):', error);
      throw error;
    }
  }

  // Send payment link email
  async sendPaymentLinkEmail({
    userId,
    bookingId,
    customerEmail,
    customerName,
    tripTitle,
    amount,
    paymentType,
    paymentLinkUrl,
    expiresAt,
    paymentAttemptStatus,
    paymentAttemptMessage
  }: {
    userId: string;
    bookingId: string;
    customerEmail: string;
    customerName: string;
    tripTitle: string;
    amount: number;
    paymentType: 'deposit' | 'balance' | 'manual_charge';
    paymentLinkUrl: string;
    expiresAt: string;
    paymentAttemptStatus?: 'success' | 'failed' | 'not_attempted';
    paymentAttemptMessage?: string;
  }): Promise<NotificationDocument> {
    try {
      const subject = `Payment Required - ${tripTitle}`;
      
      // Generate email template
      const emailTemplate = generatePaymentLinkEmail({
        customerName,
        tripTitle,
        amount,
        paymentType,
        paymentLinkUrl,
        expiresAt,
        paymentAttemptStatus,
        paymentAttemptMessage
      });

      // Create notification record
      const notification = await this.create({
        userId,
        bookingId,
        type: 'payment_link',
        method: 'email',
        recipient: customerEmail,
        subject,
        content: `Payment link sent for ${paymentType} payment of €${amount}`,
        template: 'payment-link'
      });

      // Send email
      const result = await sendServerEmail({
        to: customerEmail,
        subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
        template: 'payment-link'
      });

      if (result.success) {
        await this.markAsSent(notification.$id, result.id);
      } else {
        await this.markAsFailed(notification.$id, result.error?.toString() || 'Unknown error');
      }

      return notification;
    } catch (error) {
      console.error('Error sending payment link email (server):', error);
      throw error;
    }
  }
}

// Export singleton instance
export const serverNotificationService = new ServerNotificationService();
