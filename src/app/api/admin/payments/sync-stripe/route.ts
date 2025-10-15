import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { serverBookingService } from '@/services/server/bookingService';
import { serverUserProfileService } from '@/services/server/userProfileService';
import { serverNotificationService } from '@/services/server/notificationService';
import { tripService } from '@/services/tripService';

const stripe = getServerStripe();

export async function POST(request: NextRequest) {
  try {
    console.log('Starting Stripe payment sync...');

    // Get all bookings with active payment links
    const { bookings } = await serverBookingService.getAll(100);
    
    let syncedPayments = 0;
    let errors: string[] = [];

    for (const booking of bookings) {
      try {
        // Skip if no payment links
        if (!booking.paymentInfo?.paymentLinks || booking.paymentInfo.paymentLinks.length === 0) {
          continue;
        }

        // Check each pending payment link
        for (const paymentLink of booking.paymentInfo.paymentLinks) {
          if (paymentLink.status !== 'pending') {
            continue; // Skip non-pending links
          }

          console.log(`Checking payment link ${paymentLink.sessionId} for booking ${booking.$id}`);

          try {
            // Retrieve the checkout session from Stripe
            const session = await stripe.checkout.sessions.retrieve(paymentLink.sessionId);
            
            if (session.payment_status === 'paid' && session.payment_intent) {
              console.log(`Payment completed for session ${paymentLink.sessionId}`);
              
              // Get payment intent details
              const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
              
              // Update booking based on payment type
              if (paymentLink.paymentType === 'balance') {
                await serverBookingService.update(booking.$id, {
                  bookingStatus: 'fully_paid',
                  paymentStatus: 'succeeded',
                  balancePaymentIntentId: paymentIntent.id,
                  paymentInfo: {
                    ...booking.paymentInfo,
                    paymentLinks: booking.paymentInfo.paymentLinks.map(link => 
                      link.sessionId === paymentLink.sessionId 
                        ? { ...link, status: 'completed', completedAt: new Date().toISOString(), paymentIntentId: paymentIntent.id }
                        : link
                    )
                  }
                });

                console.log(`Updated booking ${booking.$id} - balance payment completed`);
                syncedPayments++;

              } else if (paymentLink.paymentType === 'manual_charge') {
                await serverBookingService.update(booking.$id, {
                  paymentInfo: {
                    ...booking.paymentInfo,
                    manualCharges: booking.paymentInfo.manualCharges?.map(charge => 
                      charge.paymentLinkId === paymentLink.sessionId 
                        ? { ...charge, status: 'succeeded', paymentIntentId: paymentIntent.id }
                        : charge
                    ) || [],
                    paymentLinks: booking.paymentInfo.paymentLinks.map(link => 
                      link.sessionId === paymentLink.sessionId 
                        ? { ...link, status: 'completed', completedAt: new Date().toISOString(), paymentIntentId: paymentIntent.id }
                        : link
                    )
                  }
                });

                console.log(`Updated booking ${booking.$id} - manual charge completed`);
                syncedPayments++;

              } else if (paymentLink.paymentType === 'deposit') {
                await serverBookingService.update(booking.$id, {
                  bookingStatus: 'deposit_paid',
                  paymentStatus: 'succeeded',
                  depositPaymentIntentId: paymentIntent.id,
                  paymentMethodId: paymentIntent.payment_method as string,
                  paymentInfo: {
                    ...booking.paymentInfo,
                    paymentLinks: booking.paymentInfo.paymentLinks.map(link => 
                      link.sessionId === paymentLink.sessionId 
                        ? { ...link, status: 'completed', completedAt: new Date().toISOString(), paymentIntentId: paymentIntent.id }
                        : link
                    )
                  }
                });

                console.log(`Updated booking ${booking.$id} - deposit payment completed`);
                syncedPayments++;
              }

            } else if (session.status === 'expired') {
              // Mark payment link as expired
              await serverBookingService.update(booking.$id, {
                paymentInfo: {
                  ...booking.paymentInfo,
                  paymentLinks: booking.paymentInfo.paymentLinks.map(link => 
                    link.sessionId === paymentLink.sessionId 
                      ? { ...link, status: 'expired' }
                      : link
                  )
                }
              });

              console.log(`Marked payment link as expired for booking ${booking.$id}`);
            }

          } catch (stripeError) {
            console.error(`Error checking Stripe session ${paymentLink.sessionId}:`, stripeError);
            errors.push(`Session ${paymentLink.sessionId}: ${stripeError instanceof Error ? stripeError.message : 'Unknown error'}`);
          }
        }

      } catch (bookingError) {
        console.error(`Error processing booking ${booking.$id}:`, bookingError);
        errors.push(`Booking ${booking.$id}: ${bookingError instanceof Error ? bookingError.message : 'Unknown error'}`);
      }
    }

    console.log(`Stripe sync completed. Synced: ${syncedPayments} payments`);

    return NextResponse.json({
      success: true,
      syncedPayments,
      errors: errors.length,
      message: `Successfully synced ${syncedPayments} payments. ${errors.length} errors encountered.`
    });

  } catch (error) {
    console.error('Error during Stripe sync:', error);
    return NextResponse.json(
      { 
        error: 'Stripe sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
