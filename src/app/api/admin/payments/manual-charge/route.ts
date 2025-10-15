import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe, eurosToCents } from '@/lib/stripe';
import { createManualChargePaymentLink } from '@/lib/stripe-checkout';
import { serverBookingService } from '@/services/server/bookingService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { serverNotificationService } from '@/services/server/notificationService';
import { sendServerEmail, generatePaymentLinkEmail } from '@/lib/resend-server';
import { tripService } from '@/services/tripService';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, description } = await request.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, amount' },
        { status: 400 }
      );
    }

    console.log(`Manual charge initiated for booking ${bookingId}, amount: €${amount}`);

    // Get booking details
    const booking = await serverBookingService.getById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Get user profile for email
    const userProfile = await serverUserProfileService.getByUserId(booking.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get trip details for description
    let tripTitle = 'Trip';
    try {
      const trip = await tripService.getTrip(booking.tripId);
      if (trip) {
        tripTitle = trip.title;
      }
    } catch (error) {
      console.warn('Could not fetch trip details:', error);
    }

    // Generate payment link (no automatic charges)
    console.log('Generating payment link...');
    const paymentLink = await createManualChargePaymentLink(
      booking,
      amount,
      description || `Manual charge for ${tripTitle}`,
      userProfile.email,
      tripTitle
    );

    console.log(`Payment link created: ${paymentLink.sessionId}`);

    // Update booking with payment link information
    const manualCharge = {
      amount,
      description: description || 'Manual charge',
      date: new Date().toISOString(),
      paymentLinkId: paymentLink.sessionId,
      status: 'pending',
      adminUserId: 'admin' // TODO: Get actual admin user ID from session
    };

    await serverBookingService.update(bookingId, {
      paymentInfo: {
        ...booking.paymentInfo,
        manualCharges: [
          ...(booking.paymentInfo?.manualCharges || []),
          manualCharge
        ],
        paymentLinks: [
          ...(booking.paymentInfo?.paymentLinks || []),
          {
            sessionId: paymentLink.sessionId,
            url: paymentLink.url,
            amount,
            paymentType: 'manual_charge',
            createdAt: new Date().toISOString(),
            expiresAt: paymentLink.expiresAt.toISOString(),
            status: 'pending'
          }
        ]
      }
    });

    // Send payment link email
    console.log('Sending payment link email...');
    const emailTemplate = generatePaymentLinkEmail({
      customerName: `${userProfile.firstName} ${userProfile.lastName}`,
      tripTitle,
      amount,
      paymentType: 'manual_charge',
      paymentLinkUrl: paymentLink.url,
      expiresAt: paymentLink.expiresAt.toISOString(),
      paymentAttemptStatus: 'scheduled',
      paymentAttemptMessage: 'A manual charge has been initiated for your booking. Please complete the payment using the secure link below.'
    });

    const emailResult = await sendServerEmail({
      to: userProfile.email,
      subject: `Payment Required - ${tripTitle}`,
      html: emailTemplate.html,
      text: emailTemplate.text,
      template: 'payment-link'
    });

    // Create notification record
    await serverNotificationService.create({
      userId: booking.userId,
      bookingId,
      type: 'payment_link',
      method: 'email',
      recipient: userProfile.email,
      subject: `Payment Required - ${tripTitle}`,
      content: `Payment link sent for manual charge of €${amount}`,
      template: 'payment-link',
      status: emailResult.success ? 'sent' : 'failed'
    });

    console.log(`Manual charge process completed. Email sent: ${emailResult.success}`);

    return NextResponse.json({
      success: true,
      paymentLink: {
        sessionId: paymentLink.sessionId,
        url: paymentLink.url,
        expiresAt: paymentLink.expiresAt.toISOString()
      },
      emailSent: emailResult.success,
      message: paymentAttemptStatus === 'success' 
        ? 'Payment processed successfully and confirmation email sent with payment link for reference.'
        : 'Payment link generated and sent to customer. Payment attempt with saved method failed.'
    });

  } catch (error) {
    console.error('Manual charge process error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process manual charge',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}