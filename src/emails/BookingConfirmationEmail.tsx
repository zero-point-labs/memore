import React from 'react';

interface BookingConfirmationEmailProps {
  customerName: string;
  tripTitle: string;
  tripDate: string;
  depositAmount: number;
  balanceAmount: number;
  balanceDueDate: string;
}

export default function BookingConfirmationEmail({
  customerName,
  tripTitle,
  tripDate,
  depositAmount,
  balanceAmount,
  balanceDueDate,
}: BookingConfirmationEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Booking Confirmed - {tripTitle}</title>
      </head>
      <body style={{ 
        fontFamily: 'Arial, sans-serif', 
        lineHeight: '1.6', 
        color: '#333',
        backgroundColor: '#f4f4f4',
        margin: 0,
        padding: 0
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            borderBottom: '2px solid #8B5CF6',
            paddingBottom: '20px',
            marginBottom: '30px'
          }}>
            <h1 style={{
              color: '#8B5CF6',
              fontSize: '28px',
              margin: '0 0 10px 0',
              fontWeight: 'bold'
            }}>
              MEMORA
            </h1>
            <p style={{
              color: '#666',
              fontSize: '16px',
              margin: 0
            }}>
              Cyprus Adventures
            </p>
          </div>

          {/* Main Content */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              color: '#333',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              🎉 Booking Confirmed!
            </h2>

            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
              Hi <strong>{customerName}</strong>!
            </p>

            <p style={{ fontSize: '16px', marginBottom: '20px' }}>
              Great news! Your booking for <strong>{tripTitle}</strong> has been confirmed. 
              We're excited to have you join us for an unforgettable adventure in Cyprus!
            </p>

            {/* Trip Details */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '25px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{
                color: '#8B5CF6',
                fontSize: '18px',
                marginBottom: '15px',
                marginTop: 0
              }}>
                Trip Details
              </h3>
              <p style={{ margin: '8px 0', fontSize: '16px' }}>
                <strong>Trip:</strong> {tripTitle}
              </p>
              <p style={{ margin: '8px 0', fontSize: '16px' }}>
                <strong>Date:</strong> {tripDate}
              </p>
            </div>

            {/* Payment Details */}
            <div style={{
              backgroundColor: '#f0f9ff',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '25px',
              border: '1px solid #bae6fd'
            }}>
              <h3 style={{
                color: '#0284c7',
                fontSize: '18px',
                marginBottom: '15px',
                marginTop: 0
              }}>
                Payment Summary
              </h3>
              <p style={{ margin: '8px 0', fontSize: '16px' }}>
                <strong>Deposit Paid:</strong> <span style={{ color: '#059669' }}>€{depositAmount}</span> ✅
              </p>
              <p style={{ margin: '8px 0', fontSize: '16px' }}>
                <strong>Balance Due:</strong> <span style={{ color: '#dc2626' }}>€{balanceAmount}</span>
              </p>
              <p style={{ margin: '8px 0', fontSize: '16px' }}>
                <strong>Due Date:</strong> {balanceDueDate}
              </p>
            </div>

            {/* Important Info */}
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '25px',
              border: '1px solid #fbbf24'
            }}>
              <h3 style={{
                color: '#d97706',
                fontSize: '18px',
                marginBottom: '15px',
                marginTop: 0
              }}>
                Important Information
              </h3>
              <p style={{ margin: '8px 0', fontSize: '16px' }}>
                We'll automatically charge your saved payment method for the balance amount 
                one week before your trip. You'll receive a reminder email beforehand.
              </p>
            </div>

            {/* Next Steps */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                color: '#333',
                fontSize: '18px',
                marginBottom: '15px'
              }}>
                What's Next?
              </h3>
              <ul style={{ paddingLeft: '20px', fontSize: '16px' }}>
                <li style={{ marginBottom: '8px' }}>
                  Check your account dashboard for booking details
                </li>
                <li style={{ marginBottom: '8px' }}>
                  We'll send you trip details and packing list closer to the date
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Follow us on social media for updates and excitement!
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <a 
                href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://memora-experience.com'}/account`}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#8B5CF6',
                  color: '#ffffff',
                  padding: '12px 30px',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                View Your Booking
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <p style={{ margin: '8px 0' }}>
              Questions? Contact us at{' '}
              <a href="mailto:info@memora-experience.com" style={{ color: '#8B5CF6' }}>
                info@memora-experience.com
              </a>
            </p>
            <p style={{ margin: '8px 0' }}>
              © 2024 Memora - Cyprus Adventures. All rights reserved.
            </p>
            <p style={{ margin: '8px 0', fontSize: '12px' }}>
              This email was sent regarding your booking. If you have any concerns, please contact us immediately.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
