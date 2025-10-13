import { NextRequest, NextResponse } from 'next/server';
import { serverBookingService } from '@/services/server/bookingService';
import { serverNotificationService } from '@/services/server/notificationService';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, type } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
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

    let emailSent = false;

    switch (type) {
      case 'balance_due':
        // Send balance payment reminder
        emailSent = await serverNotificationService.sendAdminAlert({
          type: 'payment_reminder',
          bookingId,
          customerEmail: booking.email,
          amount: booking.balanceAmount,
          dueDate: booking.balanceDueDate
        });
        break;

      case 'trip_reminder':
        // Send trip reminder
        emailSent = await serverNotificationService.sendAdminAlert({
          type: 'trip_reminder',
          bookingId,
          customerEmail: booking.email,
          tripTitle: booking.tripTitle,
          tripDate: booking.tripDate
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid reminder type' },
          { status: 400 }
        );
    }

    if (emailSent) {
      // Update booking with reminder sent info
      await serverBookingService.update(bookingId, {
        paymentInfo: {
          ...booking.paymentInfo,
          reminders: [
            ...(booking.paymentInfo?.reminders || []),
            {
              type,
              date: new Date().toISOString(),
              adminInitiated: true
            }
          ]
        }
      });
    }

    return NextResponse.json({
      success: emailSent,
      message: emailSent ? 'Reminder sent successfully' : 'Failed to send reminder'
    });

  } catch (error) {
    console.error('Send reminder error:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
