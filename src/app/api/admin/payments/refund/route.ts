import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { serverBookingService } from '@/services/server/bookingService';
import { serverNotificationService } from '@/services/server/notificationService';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, reason, paymentIntentId } = await request.json();

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

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId || booking.paymentInfo?.depositPaymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer',
      metadata: {
        bookingId,
        adminInitiated: 'true',
        reason: reason || 'Admin refund'
      }
    });

    // Update booking with refund info
    await serverBookingService.update(bookingId, {
      paymentInfo: {
        ...booking.paymentInfo,
        refunds: [
          ...(booking.paymentInfo?.refunds || []),
          {
            amount,
            reason: reason || 'Admin refund',
            date: new Date().toISOString(),
            refundId: refund.id,
            status: refund.status
          }
        ]
      },
      status: amount >= booking.totalAmount ? 'cancelled' : booking.status
    });

    // Send notification to customer
    await serverNotificationService.sendAdminAlert({
      type: 'payment_refund',
      bookingId,
      customerEmail: booking.email,
      amount,
      reason: reason || 'Admin refund'
    });

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        status: refund.status,
        amount: refund.amount
      }
    });

  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}
