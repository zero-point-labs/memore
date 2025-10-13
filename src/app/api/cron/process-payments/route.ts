import { NextRequest, NextResponse } from 'next/server';
import { paymentScheduleService } from '@/services/paymentScheduleService';
import { notificationService } from '@/services/notificationService';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting automated payment processing...');
    
    // Get payment schedules due for processing
    const dueSchedules = await paymentScheduleService.getDueForProcessing();
    console.log(`Found ${dueSchedules.length} payments due for processing`);

    // Get payment schedules ready for retry
    const retrySchedules = await paymentScheduleService.getReadyForRetry();
    console.log(`Found ${retrySchedules.length} payments ready for retry`);

    const allSchedules = [...dueSchedules, ...retrySchedules];
    
    if (allSchedules.length === 0) {
      console.log('No payments to process');
      return NextResponse.json({ 
        success: true, 
        message: 'No payments to process',
        processed: 0,
        failed: 0
      });
    }

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process each payment schedule
    for (const schedule of allSchedules) {
      try {
        console.log(`Processing payment schedule ${schedule.$id} for booking ${schedule.bookingId}`);
        
        // Call the balance payment processing endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/process-balance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: schedule.bookingId,
            paymentScheduleId: schedule.$id
          }),
        });

        const result = await response.json();

        if (result.success) {
          processed++;
          console.log(`Successfully processed payment for booking ${schedule.bookingId}`);
        } else {
          failed++;
          errors.push(`Booking ${schedule.bookingId}: ${result.error}`);
          console.error(`Failed to process payment for booking ${schedule.bookingId}:`, result.error);
        }

      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Schedule ${schedule.$id}: ${errorMessage}`);
        console.error(`Error processing payment schedule ${schedule.$id}:`, error);
      }

      // Add small delay between payments to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Send admin summary if there were any failures
    if (failed > 0) {
      await notificationService.sendAdminAlert({
        type: 'Daily Payment Processing Summary',
        subject: `Payment processing completed - ${failed} failures`,
        message: `Processed: ${processed}, Failed: ${failed}\n\nErrors:\n${errors.join('\n')}`,
      });
    }

    console.log(`Payment processing complete. Processed: ${processed}, Failed: ${failed}`);

    return NextResponse.json({
      success: true,
      processed,
      failed,
      errors: failed > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in payment processing cron job:', error);
    
    // Send admin alert about cron job failure
    await notificationService.sendAdminAlert({
      type: 'Cron Job Failure',
      subject: 'Payment processing cron job failed',
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// Verify cron job authentication (optional security measure)
function verifyCronAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // If CRON_SECRET is set, verify it
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }
  
  // If no CRON_SECRET is set, allow (for development)
  return true;
}

export async function POST(request: NextRequest) {
  // Allow manual triggering via POST (for testing)
  if (!verifyCronAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return GET(request);
}
