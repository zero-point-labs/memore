import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getServerStripe } from '@/lib/stripe';
import { serverBookingService } from '@/services/server/bookingService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { serverNotificationService } from '@/services/server/notificationService';
import { sendServerEmail, generateBookingConfirmationEmail } from '@/lib/resend-server';
import { tripService } from '@/services/tripService';
import { paymentScheduleService } from '@/services/paymentScheduleService';

const stripe = getServerStripe();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_CHECKOUT_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Received Stripe Checkout webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { metadata } = session;
  const { bookingId, userId, paymentType } = metadata;

  if (!bookingId) {
    console.error('No booking ID in checkout session metadata');
    return;
  }

  console.log(`Processing completed checkout session for booking ${bookingId}, payment type: ${paymentType}`);

  try {
    // Get booking details
    const booking = await serverBookingService.getById(bookingId);
    if (!booking) {
      console.error('Booking not found:', bookingId);
      return;
    }

    // Get user profile
    const userProfile = await serverUserProfileService.getByUserId(userId);
    if (!userProfile) {
      console.error('User profile not found:', userId);
      return;
    }

    // Get trip details
    let trip = null;
    try {
      trip = await tripService.getTrip(booking.tripId);
    } catch (error) {
      console.warn('Could not fetch trip details:', error);
    }

    // Retrieve the payment intent from the session
    const paymentIntentId = session.payment_intent;
    let paymentIntent = null;
    if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    }

    // Update booking based on payment type
    if (paymentType === 'balance') {
      // Update booking status for balance payment
      await serverBookingService.update(bookingId, {
        bookingStatus: 'fully_paid',
        paymentStatus: 'succeeded',
        balancePaymentIntentId: paymentIntentId,
        paymentInfo: {
          ...booking.paymentInfo,
          paymentLinks: booking.paymentInfo?.paymentLinks?.map(link => 
            link.sessionId === session.id 
              ? { ...link, status: 'completed', completedAt: new Date().toISOString(), paymentIntentId }
              : link
          ) || []
        }
      });

      // Update payment schedule status for balance payment
      try {
        const paymentSchedules = await paymentScheduleService.getByBookingId(bookingId);
        const balanceSchedule = paymentSchedules.find(s => s.paymentType === 'balance' && s.status === 'pending');
        
        if (balanceSchedule) {
          await paymentScheduleService.markAsSucceeded(balanceSchedule.$id, paymentIntentId);
          console.log(`Payment schedule ${balanceSchedule.$id} marked as succeeded`);
        }
      } catch (scheduleError) {
        console.error('Error updating payment schedule:', scheduleError);
      }

      console.log(`Balance payment completed for booking ${bookingId}`);

    } else if (paymentType === 'manual_charge') {
      // Update manual charge status
      await serverBookingService.update(bookingId, {
        paymentInfo: {
          ...booking.paymentInfo,
          manualCharges: booking.paymentInfo?.manualCharges?.map(charge => 
            charge.paymentLinkId === session.id 
              ? { ...charge, status: 'succeeded', paymentIntentId }
              : charge
          ) || [],
          paymentLinks: booking.paymentInfo?.paymentLinks?.map(link => 
            link.sessionId === session.id 
              ? { ...link, status: 'completed', completedAt: new Date().toISOString(), paymentIntentId }
              : link
          ) || []
        }
      });

      console.log(`Manual charge completed for booking ${bookingId}`);

    } else if (paymentType === 'deposit') {
      // Update booking status for deposit payment
      await serverBookingService.update(bookingId, {
        bookingStatus: 'deposit_paid',
        paymentStatus: 'succeeded',
        depositPaymentIntentId: paymentIntentId,
        paymentMethodId: paymentIntent?.payment_method || undefined,
        paymentInfo: {
          ...booking.paymentInfo,
          paymentLinks: booking.paymentInfo?.paymentLinks?.map(link => 
            link.sessionId === session.id 
              ? { ...link, status: 'completed', completedAt: new Date().toISOString(), paymentIntentId }
              : link
          ) || []
        }
      });

      console.log(`Deposit payment completed for booking ${bookingId}`);
    }

    // Note: Booking confirmation emails are handled by the main stripe webhook

    // Create notification record for payment completion
    await serverNotificationService.create({
      userId: booking.userId,
      bookingId,
      type: 'payment_success',
      method: 'webhook',
      recipient: userProfile.email,
      subject: `Payment Completed - ${trip?.title || 'Trip'}`,
      content: `Payment completed via payment link. Amount: €${session.amount_total / 100}`,
      template: 'payment-completion',
      status: 'sent'
    });

    console.log(`Checkout session processing completed for booking ${bookingId}`);

  } catch (error) {
    console.error('Error handling checkout session completion:', error);
    
    // Send admin alert about the error
    try {
      await serverNotificationService.sendAdminAlert({
        type: 'Checkout Session Processing Error',
        subject: `Error processing checkout session ${session.id}`,
        message: `Failed to process completed checkout session for booking ${bookingId}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        bookingId,
        userId
      });
    } catch (alertError) {
      console.error('Failed to send admin alert:', alertError);
    }
  }
}

async function handleCheckoutSessionExpired(session: any) {
  const { metadata } = session;
  const { bookingId, userId, paymentType } = metadata;

  if (!bookingId) {
    console.error('No booking ID in expired checkout session metadata');
    return;
  }

  console.log(`Processing expired checkout session for booking ${bookingId}, payment type: ${paymentType}`);

  try {
    // Get booking details
    const booking = await serverBookingService.getById(bookingId);
    if (!booking) {
      console.error('Booking not found:', bookingId);
      return;
    }

    // Update payment link status to expired
    await serverBookingService.update(bookingId, {
      paymentInfo: {
        ...booking.paymentInfo,
        paymentLinks: booking.paymentInfo?.paymentLinks?.map(link => 
          link.sessionId === session.id 
            ? { ...link, status: 'expired' }
            : link
        ) || []
      }
    });

    // For balance payments, set grace period end if not already set
    if (paymentType === 'balance' && !booking.paymentInfo?.gracePeriodEnd) {
      const gracePeriodEnd = new Date();
      gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 24); // 24-hour grace period

      await serverBookingService.update(bookingId, {
        paymentInfo: {
          ...booking.paymentInfo,
          gracePeriodEnd: gracePeriodEnd.toISOString(),
          requiresManualIntervention: true
        }
      });

      // Send admin alert about expired payment link
      await serverNotificationService.sendAdminAlert({
        type: 'Payment Link Expired',
        subject: `Payment link expired for booking ${bookingId}`,
        message: `The payment link for ${paymentType} payment has expired. Grace period ends at ${gracePeriodEnd.toISOString()}. Manual intervention may be required.`,
        bookingId,
        userId
      });
    }

    console.log(`Expired checkout session processed for booking ${bookingId}`);

  } catch (error) {
    console.error('Error handling expired checkout session:', error);
  }
}
