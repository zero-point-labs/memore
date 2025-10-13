import { NextRequest, NextResponse } from 'next/server';
import { serverNotificationService } from '@/services/server/notificationService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address required' },
        { status: 400 }
      );
    }

    // Send test booking confirmation
    const notification = await serverNotificationService.sendBookingConfirmation({
      userId: 'test-user',
      bookingId: 'test-booking-123',
      customerName: 'Andrew Kyriakou',
      customerEmail: email,
      tripTitle: 'Mykonos VIP Experience',
      tripDate: '2025-03-15T00:00:00.000Z',
      depositAmount: 150,
      balanceAmount: 350,
      balanceDueDate: '2025-03-08T00:00:00.000Z'
    });

    return NextResponse.json({
      success: true,
      message: 'Booking confirmation email sent!',
      notificationId: notification.$id
    });

  } catch (error) {
    console.error('Error sending booking confirmation test:', error);
    return NextResponse.json(
      { error: 'Failed to send booking confirmation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Booking email test endpoint ready',
    usage: 'POST with { email: "your@email.com" }'
  });
}
