import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getServerStripe } from '@/lib/stripe';
import { serverBookingService } from '@/services/server/bookingService';
import { serverNotificationService } from '@/services/server/notificationService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { paymentScheduleService } from '@/services/paymentScheduleService';

const stripe = getServerStripe();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object);
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

async function handlePaymentSuccess(paymentIntent: any) {
  const { metadata } = paymentIntent;
  const { bookingId, paymentType, userId } = metadata;

  if (!bookingId) {
    console.error('No booking ID in payment intent metadata');
    return;
  }

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

    console.log('Webhook - User profile found:', {
      userId,
      profileId: userProfile.$id,
      email: userProfile.email,
      name: `${userProfile.firstName} ${userProfile.lastName}`
    });

    if (paymentType === 'deposit') {
      // Update booking status for deposit payment
      await serverBookingService.markDepositPaid(
        bookingId,
        paymentIntent.id,
        paymentIntent.payment_method
      );

      // Update payment schedule with payment method for future balance collection
      const paymentSchedules = await paymentScheduleService.getByBookingId(bookingId);
      const balanceSchedule = paymentSchedules.find(s => s.paymentType === 'balance');
      
      if (balanceSchedule) {
        await paymentScheduleService.update(balanceSchedule.$id, {
          paymentMethodId: paymentIntent.payment_method
        });
      }

      // Send booking confirmation email
      console.log('Webhook - Sending booking confirmation email to:', {
        customerEmail: userProfile.email,
        customerName: `${userProfile.firstName} ${userProfile.lastName}`,
        bookingId
      });

      await serverNotificationService.sendBookingConfirmation({
        userId,
        bookingId,
        customerName: `${userProfile.firstName} ${userProfile.lastName}`,
        customerEmail: userProfile.email,
        tripTitle: `Trip #${booking.tripId.slice(-6)}`,
        tripDate: booking.balanceDueDate, // We'll get the actual trip date later
        depositAmount: booking.depositAmount,
        balanceAmount: booking.balanceAmount,
        balanceDueDate: booking.balanceDueDate
      });

    } else if (paymentType === 'balance') {
      // Update booking status for balance payment
      await serverBookingService.markBalancePaid(bookingId, paymentIntent.id);

      // Send admin alert for balance payment success
      await serverNotificationService.sendAdminAlert({
        type: 'Balance Payment Success',
        subject: `Balance payment completed for booking ${bookingId}`,
        message: `Balance payment of €${booking.balanceAmount} successfully collected from ${userProfile.firstName} ${userProfile.lastName}`,
        bookingId,
        userId
      });
    }

    console.log(`Payment successful for booking ${bookingId}, type: ${paymentType}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    
    // Send admin alert about the error
    try {
      await serverNotificationService.sendAdminAlert({
        type: 'Payment Processing Error',
        subject: `Failed to process successful payment for booking ${bookingId}`,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        bookingId,
        userId
      });
    } catch (alertError) {
      console.error('Failed to send admin alert:', alertError);
    }
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const { metadata } = paymentIntent;
  const { bookingId, paymentType, userId } = metadata;

  if (!bookingId) {
    console.error('No booking ID in payment intent metadata');
    return;
  }

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

    // Update booking payment status
    await serverBookingService.updatePaymentInfo(bookingId, {
      paymentStatus: 'failed'
    });

    // Send admin alert
    try {
      await serverNotificationService.sendAdminAlert({
        type: 'Payment Failed',
        subject: `Payment failed for booking ${bookingId}`,
        message: `${paymentType} payment failed for ${userProfile.firstName} ${userProfile.lastName} (${userProfile.email}). Amount: €${paymentType === 'deposit' ? booking.depositAmount : booking.balanceAmount}`,
        bookingId,
        userId
      });
    } catch (alertError) {
      console.error('Failed to send admin alert:', alertError);
    }

    console.log(`Payment failed for booking ${bookingId}, type: ${paymentType}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentMethodAttached(paymentMethod: any) {
  const { customer } = paymentMethod;
  
  try {
    // Find user profile by Stripe customer ID
    const userProfile = await serverUserProfileService.getByStripeCustomerId(customer);
    if (userProfile) {
      console.log(`Payment method attached for user ${userProfile.userId}`);
    }
  } catch (error) {
    console.error('Error handling payment method attachment:', error);
  }
}
