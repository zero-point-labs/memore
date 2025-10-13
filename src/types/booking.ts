import { Models } from 'appwrite';

// Booking status types
export type BookingStatus = 
  | 'pending'           // Booking created, deposit pending
  | 'deposit_paid'      // Deposit paid, awaiting balance
  | 'fully_paid'        // Both payments completed
  | 'cancelled'         // Booking cancelled
  | 'refunded';         // Booking refunded

// Payment status types
export type PaymentStatus = 
  | 'pending'           // Payment scheduled but not processed
  | 'processing'        // Payment currently being processed
  | 'succeeded'         // Payment completed successfully
  | 'failed'            // Payment failed
  | 'cancelled'         // Payment cancelled
  | 'refunded';         // Payment refunded

// Student status types
export type StudentStatus = 
  | 'college'           // Currently in college/university
  | 'youth';            // 18-28 years old, not in college

// Room preference types
export type RoomPreference = 
  | 'twin'              // Twin beds (shared room)
  | 'double'            // Double bed (shared room)  
  | 'single';           // Single room (private)

// Transport preference types
export type TransportPreference = 
  | 'bus'               // Provided bus transportation
  | 'own_car';          // Own car transportation

// Extended user profile interface
export interface UserProfile {
  id?: string;
  userId: string;        // Links to Appwrite user ID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  university?: string;
  studentStatus: StudentStatus;
  stripeCustomerId?: string;
  
  // Communication preferences
  emailOptIn: boolean;
  smsOptIn: boolean;
  marketingOptIn: boolean;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// Booking interface
export interface Booking {
  id?: string;
  
  // References
  tripId: string;        // Links to trip
  userId: string;        // Links to Appwrite user
  userProfileId: string; // Links to user profile
  
  // Booking details
  packageType: string;   // e.g., 'standard', 'premium', 'vip'
  roomPreference: RoomPreference;
  transportPreference: TransportPreference;
  specialRequests?: string;
  
  // Pricing
  totalAmount: number;   // Total trip cost in euros
  depositAmount: number; // 30% deposit in euros
  balanceAmount: number; // 70% balance in euros
  currency: string;      // 'EUR'
  
  // Payment tracking
  stripeCustomerId: string;
  depositPaymentIntentId?: string;
  balancePaymentIntentId?: string;
  paymentMethodId?: string;
  
  // Scheduling
  balanceDueDate: string; // ISO date when balance is due
  
  // Status
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// Payment schedule interface
export interface PaymentSchedule {
  id?: string;
  
  // References
  bookingId: string;
  userId: string;
  
  // Payment details
  paymentType: 'deposit' | 'balance';
  amount: number;        // Amount in euros
  currency: string;      // 'EUR'
  
  // Stripe references
  paymentIntentId?: string;
  paymentMethodId?: string;
  
  // Scheduling
  scheduledDate: string; // ISO date when payment should be processed
  processedAt?: string;  // ISO date when payment was actually processed
  
  // Status and retry logic
  status: PaymentStatus;
  retryCount: number;
  maxRetries: number;
  lastAttemptAt?: string;
  nextRetryAt?: string;
  errorMessage?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// Notification interface
export interface Notification {
  id?: string;
  
  // References
  bookingId?: string;
  userId: string;
  
  // Notification details
  type: 'booking_confirmation' | 'payment_success' | 'payment_reminder' | 'payment_failed' | 'trip_reminder' | 'admin_alert';
  method: 'email' | 'sms';
  recipient: string;     // Email address or phone number
  
  // Content
  subject?: string;      // For emails
  content: string;       // Message content
  template?: string;     // Template used
  
  // Status
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
  
  // Retry logic
  retryCount: number;
  maxRetries: number;
  
  // External references
  externalId?: string;   // Resend email ID or Twilio SMS ID
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// Global settings interface
export interface GlobalSettings {
  id?: string;
  
  // Payment settings
  depositPercentage: number;     // Default: 30
  balancePercentage: number;     // Default: 70
  balanceDueDays: number;        // Days before trip when balance is due (default: 7)
  currency: string;              // Default: 'EUR'
  
  // Retry settings
  maxPaymentRetries: number;     // Default: 3
  retryIntervalHours: number;    // Default: 24
  
  // Notification settings
  sendBookingConfirmation: boolean;    // Default: true
  sendPaymentReminders: boolean;       // Default: true
  reminderDaysBefore: number[];        // Default: [3, 1] (3 days and 1 day before)
  
  // Admin settings
  adminEmail: string;
  adminAlertOnFailedPayment: boolean;  // Default: true
  
  // Metadata
  updatedAt?: string;
  updatedBy?: string;
}

// Document types with Appwrite metadata
export type UserProfileDocument = Models.Document & UserProfile;
export type BookingDocument = Models.Document & Booking;
export type PaymentScheduleDocument = Models.Document & PaymentSchedule;
export type NotificationDocument = Models.Document & Notification;
export type GlobalSettingsDocument = Models.Document & GlobalSettings;

// Create/Update types
export type CreateUserProfileData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserProfileData = Partial<CreateUserProfileData>;

export type CreateBookingData = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookingData = Partial<CreateBookingData>;

export type CreatePaymentScheduleData = Omit<PaymentSchedule, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePaymentScheduleData = Partial<CreatePaymentScheduleData>;

export type CreateNotificationData = Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNotificationData = Partial<CreateNotificationData>;

export type CreateGlobalSettingsData = Omit<GlobalSettings, 'id' | 'updatedAt' | 'updatedBy'>;
export type UpdateGlobalSettingsData = Partial<CreateGlobalSettingsData>;
