import { Resend } from 'resend';

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: 'Memora <bookings@memora.com>', // You'll update this with your domain
  replyTo: 'support@memora.com',
  defaultSubjectPrefix: '[Memora] ',
} as const;

// Email template types
export type EmailTemplate = 
  | 'booking-confirmation'
  | 'payment-success'
  | 'payment-reminder'
  | 'payment-failed'
  | 'trip-reminder'
  | 'admin-alert';

// Email sending function with error handling
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  template,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  template?: EmailTemplate;
}) => {
  try {
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `${EMAIL_CONFIG.defaultSubjectPrefix}${subject}`,
      html,
      text,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    console.log(`Email sent successfully:`, { 
      template, 
      to: Array.isArray(to) ? to.join(', ') : to,
      id: result.data?.id 
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

// Email template generator functions
export const generateBookingConfirmationEmail = ({
  customerName,
  tripTitle,
  tripDate,
  depositAmount,
  balanceAmount,
  balanceDueDate,
}: {
  customerName: string;
  tripTitle: string;
  tripDate: string;
  depositAmount: number;
  balanceAmount: number;
  balanceDueDate: string;
}) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
      <div style="padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Booking Confirmed!</h1>
        <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Your Cyprus adventure awaits</p>
      </div>
      
      <div style="background: white; color: #333; padding: 30px; margin: 0;">
        <h2 style="color: #667eea; margin-top: 0;">Hi ${customerName}!</h2>
        
        <p>Great news! Your booking for <strong>${tripTitle}</strong> has been confirmed.</p>
        
        <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="margin-top: 0; color: #667eea;">Trip Details</h3>
          <p><strong>Trip:</strong> ${tripTitle}</p>
          <p><strong>Date:</strong> ${tripDate}</p>
          <p><strong>Deposit Paid:</strong> €${depositAmount}</p>
          <p><strong>Balance Due:</strong> €${balanceAmount} (due ${balanceDueDate})</p>
        </div>
        
        <p>We'll automatically charge your saved payment method for the balance amount one week before your trip.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">View My Booking</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Questions? Reply to this email or contact us at support@memora.com
        </p>
      </div>
    </div>
  `;

  const text = `
    Booking Confirmed - ${tripTitle}
    
    Hi ${customerName}!
    
    Your booking for ${tripTitle} on ${tripDate} has been confirmed.
    
    Deposit Paid: €${depositAmount}
    Balance Due: €${balanceAmount} (due ${balanceDueDate})
    
    We'll automatically charge your saved payment method for the balance amount one week before your trip.
    
    View your booking: ${process.env.NEXT_PUBLIC_APP_URL}/account
    
    Questions? Contact us at support@memora.com
  `;

  return { html, text };
};
