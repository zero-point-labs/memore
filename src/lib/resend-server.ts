import { Resend } from 'resend';

// Server-side only Resend client
export const serverResend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
// Using verified domain memora-experience.com
export const EMAIL_CONFIG = {
  // Using verified domain for all environments
  from: 'Memora <bookings@memora-experience.com>',
  
  replyTo: 'info@zeropoint-labs.com',
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

// Server-side email sending function
export const sendServerEmail = async ({
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
    console.log('Attempting to send email:', {
      from: EMAIL_CONFIG.from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: `${EMAIL_CONFIG.defaultSubjectPrefix}${subject}`,
      template
    });

    const result = await serverResend.emails.send({
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
      id: result.data?.id,
      result: result
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send email - detailed error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: (error as any)?.name,
      cause: (error as any)?.cause
    });
    return { success: false, error };
  }
};

// Email template generator functions (server-side only)
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
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Booking Confirmed - ${tripTitle}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; border-bottom: 2px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">MEMORA</h1>
            <p style="color: #666; font-size: 16px; margin: 0;">Cyprus Adventures</p>
          </div>

          <!-- Main Content -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px; text-align: center;">🎉 Booking Confirmed!</h2>

            <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${customerName}</strong>!</p>

            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! Your booking for <strong>${tripTitle}</strong> has been confirmed. 
              We're excited to have you join us for an unforgettable adventure in Cyprus!
            </p>

            <!-- Trip Details -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
              <h3 style="color: #8B5CF6; font-size: 18px; margin-bottom: 15px; margin-top: 0;">Trip Details</h3>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Trip:</strong> ${tripTitle}</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Date:</strong> ${tripDate}</p>
            </div>

            <!-- Payment Details -->
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #bae6fd;">
              <h3 style="color: #0284c7; font-size: 18px; margin-bottom: 15px; margin-top: 0;">Payment Summary</h3>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Deposit Paid:</strong> <span style="color: #059669;">€${depositAmount}</span> ✅</p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Balance Due:</strong> <span style="color: #dc2626;">€${balanceAmount}</span></p>
              <p style="margin: 8px 0; font-size: 16px;"><strong>Due Date:</strong> ${balanceDueDate}</p>
            </div>

            <!-- Important Info -->
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #fbbf24;">
              <h3 style="color: #d97706; font-size: 18px; margin-bottom: 15px; margin-top: 0;">Important Information</h3>
              <p style="margin: 8px 0; font-size: 16px;">
                We'll automatically charge your saved payment method for the balance amount 
                one week before your trip. You'll receive a reminder email beforehand.
              </p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://memora-experience.com/account" 
                 style="display: inline-block; background-color: #8B5CF6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                View Your Booking
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 8px 0;">
              Questions? Contact us at <a href="mailto:info@zeropoint-labs.com" style="color: #8B5CF6;">info@zeropoint-labs.com</a>
            </p>
            <p style="margin: 8px 0;">© 2024 Memora - Cyprus Adventures. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  const emailText = `Booking Confirmed - ${tripTitle}

Hi ${customerName}!

Your booking for ${tripTitle} on ${tripDate} has been confirmed.

Deposit Paid: €${depositAmount}
Balance Due: €${balanceAmount} (due ${balanceDueDate})

We'll automatically charge your saved payment method for the balance amount one week before your trip.

View your booking: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://memora-experience.com'}/account

Questions? Contact us at info@zeropoint-labs.com`;

  return { html: emailHtml, text: emailText };
};
