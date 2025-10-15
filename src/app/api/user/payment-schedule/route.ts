import { NextRequest, NextResponse } from 'next/server';
import { databases, account } from '@/lib/appwrite';
import { bookingService } from '@/services/bookingService';
import { tripService } from '@/services/tripService';
import { Query } from 'appwrite';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await account.get();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    console.log(`Fetching payment schedule for user: ${user.$id}`);

    // Get user's bookings
    const userBookings = await bookingService.getByUserId(user.$id);
    
    if (!userBookings || userBookings.length === 0) {
      return NextResponse.json({
        success: true,
        upcomingPayments: [],
        paymentHistory: [],
        totalUpcoming: 0
      });
    }

    const upcomingPayments = [];
    const paymentHistory = [];
    let totalUpcoming = 0;

    // Process each booking
    for (const booking of userBookings) {
      try {
        // Get trip details
        const trip = await tripService.getTrip(booking.tripId);
        
        const bookingData = {
          bookingId: booking.$id,
          tripTitle: trip?.title || 'Unknown Trip',
          tripDate: trip?.startDate || booking.balanceDueDate,
          tripId: booking.tripId,
          totalAmount: booking.totalAmount,
          currency: booking.currency || 'EUR'
        };

        // Check deposit status
        if (booking.bookingStatus === 'pending' && booking.depositAmount > 0) {
          // Deposit still pending
          upcomingPayments.push({
            ...bookingData,
            paymentType: 'deposit',
            amount: booking.depositAmount,
            dueDate: new Date().toISOString(), // Deposit is due immediately
            status: 'overdue',
            description: 'Trip deposit payment',
            canPayNow: true
          });
          totalUpcoming += booking.depositAmount;
        } else if (booking.bookingStatus === 'deposit_paid') {
          // Deposit paid, add to history
          paymentHistory.push({
            ...bookingData,
            paymentType: 'deposit',
            amount: booking.depositAmount,
            paidDate: booking.createdAt || new Date().toISOString(),
            status: 'completed',
            description: 'Trip deposit payment',
            paymentIntentId: booking.depositPaymentIntentId
          });
        }

        // Check balance status
        if (booking.bookingStatus === 'deposit_paid' && booking.balanceAmount > 0) {
          const balanceDueDate = new Date(booking.balanceDueDate);
          const now = new Date();
          const isOverdue = balanceDueDate < now;
          const daysDiff = Math.ceil((balanceDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          // Check if there are active payment links
          const activePaymentLinks = booking.paymentInfo?.paymentLinks?.filter(
            link => link.paymentType === 'balance' && link.status === 'pending'
          ) || [];

          upcomingPayments.push({
            ...bookingData,
            paymentType: 'balance',
            amount: booking.balanceAmount,
            dueDate: booking.balanceDueDate,
            status: isOverdue ? 'overdue' : daysDiff <= 7 ? 'due_soon' : 'scheduled',
            description: 'Final balance payment',
            daysUntilDue: Math.max(0, daysDiff),
            canPayNow: activePaymentLinks.length > 0,
            paymentLink: activePaymentLinks[0]?.url,
            gracePeriodEnd: booking.paymentInfo?.gracePeriodEnd,
            requiresManualIntervention: booking.paymentInfo?.requiresManualIntervention
          });
          totalUpcoming += booking.balanceAmount;
        } else if (booking.bookingStatus === 'fully_paid' && booking.balanceAmount > 0) {
          // Balance paid, add to history
          paymentHistory.push({
            ...bookingData,
            paymentType: 'balance',
            amount: booking.balanceAmount,
            paidDate: booking.updatedAt || new Date().toISOString(),
            status: 'completed',
            description: 'Final balance payment',
            paymentIntentId: booking.balancePaymentIntentId
          });
        }

        // Add manual charges to history
        if (booking.paymentInfo?.manualCharges) {
          for (const charge of booking.paymentInfo.manualCharges) {
            if (charge.status === 'succeeded') {
              paymentHistory.push({
                ...bookingData,
                paymentType: 'manual_charge',
                amount: charge.amount,
                paidDate: charge.date,
                status: 'completed',
                description: charge.description || 'Manual charge',
                paymentIntentId: charge.paymentIntentId
              });
            } else if (charge.status === 'pending') {
              // Find associated payment link
              const associatedLink = booking.paymentInfo?.paymentLinks?.find(
                link => link.sessionId === charge.paymentLinkId
              );

              upcomingPayments.push({
                ...bookingData,
                paymentType: 'manual_charge',
                amount: charge.amount,
                dueDate: associatedLink?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending',
                description: charge.description || 'Manual charge',
                canPayNow: !!associatedLink && associatedLink.status === 'pending',
                paymentLink: associatedLink?.url
              });
              totalUpcoming += charge.amount;
            }
          }
        }

      } catch (tripError) {
        console.warn(`Could not fetch trip details for booking ${booking.$id}:`, tripError);
        // Continue processing other bookings
      }
    }

    // Sort upcoming payments by due date
    upcomingPayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Sort payment history by paid date (most recent first)
    paymentHistory.sort((a, b) => new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime());

    console.log(`Payment schedule fetched: ${upcomingPayments.length} upcoming, ${paymentHistory.length} history`);

    return NextResponse.json({
      success: true,
      upcomingPayments,
      paymentHistory,
      totalUpcoming,
      summary: {
        totalBookings: userBookings.length,
        upcomingPaymentsCount: upcomingPayments.length,
        completedPaymentsCount: paymentHistory.length,
        overduePayments: upcomingPayments.filter(p => p.status === 'overdue').length,
        dueSoonPayments: upcomingPayments.filter(p => p.status === 'due_soon').length
      }
    });

  } catch (error) {
    console.error('Error fetching payment schedule:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch payment schedule',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
