import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe, eurosToCents } from '@/lib/stripe';
import { createBalancePaymentLink } from '@/lib/stripe-checkout';
import { bookingService } from '@/services/bookingService';
import { paymentScheduleService } from '@/services/paymentScheduleService';
import { userProfileService } from '@/services/userProfileService';
import { notificationService } from '@/services/notificationService';
import { tripService } from '@/services/tripService';
import { sendServerEmail, generatePaymentLinkEmail } from '@/lib/resend-server';

export async function POST(request: NextRequest) {
  try {
    const stripe = getServerStripe();
    const body = await request.json();
    
    const { bookingId, paymentScheduleId } = body;

    if (!bookingId || !paymentScheduleId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await bookingService.getById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Get payment schedule
    const paymentSchedule = await paymentScheduleService.getById(paymentScheduleId);
    if (!paymentSchedule) {
      return NextResponse.json(
        { error: 'Payment schedule not found' },
        { status: 404 }
      );
    }

    // Get user profile
    const userProfile = await userProfileService.getByUserId(booking.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get trip details for description
    const trip = await tripService.getTrip(booking.tripId);
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    // Mark payment schedule as processing
    await paymentScheduleService.markAsProcessing(paymentScheduleId);

    try {
      // Generate payment link for customer (no automatic charges)
      console.log('Generating payment link for balance payment...');
      const paymentLink = await createBalancePaymentLink(
        booking,
        trip,
        userProfile.email
      );

      // Set grace period (7 days from now for payment link completion)
      const gracePeriodEnd = new Date();
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);

      // Update booking with payment link
      await bookingService.update(bookingId, {
        paymentInfo: {
          ...booking.paymentInfo,
          paymentLinks: [
            ...(booking.paymentInfo?.paymentLinks || []),
            {
              sessionId: paymentLink.sessionId,
              url: paymentLink.url,
              amount: booking.balanceAmount,
              paymentType: 'balance',
              createdAt: new Date().toISOString(),
              expiresAt: paymentLink.expiresAt.toISOString(),
              status: 'pending'
            }
          ],
          gracePeriodEnd: gracePeriodEnd.toISOString(),
          requiresManualIntervention: false
        }
      });

      // Send payment link email to customer
      const emailTemplate = generatePaymentLinkEmail({
        customerName: `${userProfile.firstName} ${userProfile.lastName}`,
        tripTitle: trip.title,
        amount: booking.balanceAmount,
        paymentType: 'balance',
        paymentLinkUrl: paymentLink.url,
        expiresAt: paymentLink.expiresAt.toISOString(),
        paymentAttemptStatus: 'scheduled',
        paymentAttemptMessage: 'Your balance payment is now due. Please complete your payment using the secure link below.'
      });

      await sendServerEmail({
        to: userProfile.email,
        subject: `Balance Payment Due - ${trip.title}`,
        html: emailTemplate.html,
        text: emailTemplate.text,
        template: 'payment-link'
      });

      // Mark payment schedule as pending (waiting for customer action)
      await paymentScheduleService.update(paymentScheduleId, {
        status: 'pending',
        notes: 'Payment link sent to customer'
      });

      console.log(`Payment link sent successfully: ${paymentLink.sessionId}`);

      return NextResponse.json({
        success: true,
        paymentLinkSent: true,
        paymentLinkId: paymentLink.sessionId,
        gracePeriodEnd: gracePeriodEnd.toISOString(),
        message: 'Payment link sent to customer'
      });

    } catch (error: any) {
      console.error('Error generating payment link:', error);
      
      // Mark payment schedule as failed
      await paymentScheduleService.markAsFailedWithRetry(
        paymentScheduleId,
        `Failed to generate payment link: ${error.message}`
      );

      // Send admin alert about the failure
      await notificationService.sendAdminAlert({
        type: 'Balance Payment Link Generation Failed',
        subject: `Failed to generate payment link - Booking ${bookingId}`,
        message: `Failed to generate payment link for ${userProfile.firstName} ${userProfile.lastName}. Error: ${error.message}. Manual intervention required.`,
        bookingId,
        userId: booking.userId
      });

      return NextResponse.json({
        success: false,
        error: 'Failed to generate payment link',
        requiresManualIntervention: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing balance payment:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to get payment schedules (for admin or cron jobs)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const bookingId = searchParams.get('bookingId');
    const userId = searchParams.get('userId');

    if (type === 'due') {
      // Get payment schedules due for processing
      const schedules = await paymentScheduleService.getDueForProcessing();
      return NextResponse.json({ schedules });
    }

    if (type === 'retry') {
      // Get payment schedules ready for retry
      const schedules = await paymentScheduleService.getReadyForRetry();
      return NextResponse.json({ schedules });
    }

    if (bookingId) {
      // Get payment schedules for specific booking
      const schedules = await paymentScheduleService.getByBookingId(bookingId);
      return NextResponse.json({ schedules });
    }

    if (userId) {
      // Get payment schedules for specific user
      const schedules = await paymentScheduleService.getByUserId(userId);
      return NextResponse.json({ schedules });
    }

    // Get stats
    const stats = await paymentScheduleService.getStats();
    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching payment schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment schedules' },
      { status: 500 }
    );
  }
}