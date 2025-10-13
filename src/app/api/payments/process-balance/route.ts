import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe, eurosToCents } from '@/lib/stripe';
import { bookingService } from '@/services/bookingService';
import { paymentScheduleService } from '@/services/paymentScheduleService';
import { userProfileService } from '@/services/userProfileService';
import { notificationService } from '@/services/notificationService';
import { tripService } from '@/services/tripService';

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
      // Create off-session payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: eurosToCents(booking.balanceAmount),
        currency: 'eur',
        customer: booking.stripeCustomerId,
        payment_method: booking.paymentMethodId,
        confirmation_method: 'automatic',
        confirm: true,
        off_session: true, // This indicates it's an automated payment
        metadata: {
          bookingId: booking.$id,
          tripId: booking.tripId,
          userId: booking.userId,
          paymentType: 'balance',
          paymentScheduleId
        },
        description: `Balance payment for ${trip.title} - ${userProfile.firstName} ${userProfile.lastName}`,
        receipt_email: userProfile.email,
      });

      if (paymentIntent.status === 'succeeded') {
        // Mark payment schedule as succeeded
        await paymentScheduleService.markAsSucceeded(paymentScheduleId, paymentIntent.id);
        
        // Update booking status
        await bookingService.markBalancePaid(bookingId, paymentIntent.id);

        // Send success notification
        await notificationService.sendPaymentSuccess({
          userId: booking.userId,
          bookingId,
          customerEmail: userProfile.email,
          customerName: `${userProfile.firstName} ${userProfile.lastName}`,
          amount: booking.balanceAmount,
          paymentType: 'balance',
          tripTitle: trip.title
        });

        return NextResponse.json({
          success: true,
          paymentIntentId: paymentIntent.id,
          status: 'succeeded'
        });

      } else if (paymentIntent.status === 'requires_action') {
        // Payment requires additional authentication (3D Secure)
        // For off-session payments, this usually means the payment failed
        await paymentScheduleService.markAsFailedWithRetry(
          paymentScheduleId,
          'Payment requires additional authentication'
        );

        // Send admin alert
        await notificationService.sendAdminAlert({
          type: 'Balance Payment Requires Action',
          subject: `Balance payment requires customer action - Booking ${bookingId}`,
          message: `Balance payment for ${userProfile.firstName} ${userProfile.lastName} requires additional authentication. Customer needs to complete payment manually.`,
          bookingId,
          userId: booking.userId
        });

        return NextResponse.json({
          success: false,
          error: 'Payment requires additional authentication',
          requiresAction: true
        });

      } else {
        // Payment failed
        await paymentScheduleService.markAsFailedWithRetry(
          paymentScheduleId,
          `Payment failed with status: ${paymentIntent.status}`
        );

        // Send admin alert
        await notificationService.sendAdminAlert({
          type: 'Balance Payment Failed',
          subject: `Balance payment failed - Booking ${bookingId}`,
          message: `Balance payment of €${booking.balanceAmount} failed for ${userProfile.firstName} ${userProfile.lastName}. Status: ${paymentIntent.status}`,
          bookingId,
          userId: booking.userId
        });

        return NextResponse.json({
          success: false,
          error: `Payment failed with status: ${paymentIntent.status}`
        });
      }

    } catch (stripeError: any) {
      console.error('Stripe payment error:', stripeError);
      
      // Handle specific Stripe errors
      let errorMessage = 'Payment processing failed';
      
      if (stripeError.type === 'StripeCardError') {
        errorMessage = stripeError.message || 'Card was declined';
      } else if (stripeError.type === 'StripeInvalidRequestError') {
        errorMessage = 'Invalid payment request';
      }

      // Mark payment schedule as failed with retry
      await paymentScheduleService.markAsFailedWithRetry(paymentScheduleId, errorMessage);

      // Send admin alert
      await notificationService.sendAdminAlert({
        type: 'Balance Payment Error',
        subject: `Balance payment error - Booking ${bookingId}`,
        message: `Error processing balance payment: ${errorMessage}. Customer: ${userProfile.firstName} ${userProfile.lastName}`,
        bookingId,
        userId: booking.userId
      });

      return NextResponse.json({
        success: false,
        error: errorMessage
      });
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
