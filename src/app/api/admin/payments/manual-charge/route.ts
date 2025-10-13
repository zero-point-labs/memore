import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { serverBookingService } from '@/services/server/bookingService';
import { serverNotificationService } from '@/services/server/notificationService';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, description } = await request.json();

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await serverBookingService.getById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const stripe = getServerStripe();

    // Create payment intent for manual charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'eur',
      customer: booking.stripeCustomerId,
      payment_method: booking.stripePaymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/payments`,
      description: description || `Manual charge for booking ${bookingId}`,
      metadata: {
        bookingId,
        type: 'manual_charge',
        adminInitiated: 'true'
      }
    });

    // Update booking with manual charge info
    await serverBookingService.update(bookingId, {
      paymentInfo: {
        ...booking.paymentInfo,
        manualCharges: [
          ...(booking.paymentInfo?.manualCharges || []),
          {
            amount,
            description: description || 'Manual charge',
            date: new Date().toISOString(),
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status
          }
        ]
      }
    });

    // Send notification to customer
    await serverNotificationService.sendAdminAlert({
      type: 'payment_manual_charge',
      bookingId,
      customerEmail: booking.email,
      amount,
      description: description || 'Manual charge'
    });

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount
      }
    });

  } catch (error) {
    console.error('Manual charge error:', error);
    return NextResponse.json(
      { error: 'Failed to process manual charge' },
      { status: 500 }
    );
  }
}
