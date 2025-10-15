import { NextRequest, NextResponse } from 'next/server';
import { serverBookingService } from '@/services/server/bookingService';
import { serverNotificationService } from '@/services/server/notificationService';
import { serverGlobalSettingsService } from '@/services/server/globalSettingsService';
import { sendServerEmail } from '@/lib/resend-server';
import { Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
  try {
    console.log('Generating daily payment summary...');

    // Get date range for today
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all bookings to analyze
    const { bookings } = await serverBookingService.getAll(200); // Get more for comprehensive analysis

    // Get global settings for admin email
    const settings = await serverGlobalSettingsService.getOrCreate();
    const adminEmail = settings.adminEmail || 'admin@memora-experience.com';

    // Analyze payment data
    const analysis = {
      date: today.toISOString().split('T')[0],
      
      // Today's activity
      paymentsProcessedToday: 0,
      paymentsFailedToday: 0,
      paymentLinksGeneratedToday: 0,
      totalRevenueToday: 0,
      
      // Overall status
      totalActiveBookings: 0,
      pendingDeposits: 0,
      upcomingBalancePayments: 0,
      overduePayments: 0,
      requiresManualIntervention: 0,
      
      // Payment method issues
      expiredPaymentMethods: 0,
      failedPaymentAttempts: 0,
      activePaymentLinks: 0,
      
      // Revenue tracking
      totalRevenue: 0,
      pendingRevenue: 0,
      
      // Detailed lists
      todaysSuccessfulPayments: [] as any[],
      todaysFailedPayments: [] as any[],
      overduePaymentsList: [] as any[],
      requiresInterventionList: [] as any[]
    };

    // Process each booking
    for (const booking of bookings) {
      // Skip cancelled/refunded bookings
      if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'refunded') {
        continue;
      }

      analysis.totalActiveBookings++;

      // Check deposit status
      if (booking.bookingStatus === 'pending') {
        analysis.pendingDeposits++;
        analysis.pendingRevenue += booking.depositAmount;
      } else if (booking.bookingStatus === 'deposit_paid') {
        analysis.totalRevenue += booking.depositAmount;
        
        // Check balance payment status
        const balanceDueDate = new Date(booking.balanceDueDate);
        if (balanceDueDate < today) {
          analysis.overduePayments++;
          analysis.overduePaymentsList.push({
            bookingId: booking.$id,
            amount: booking.balanceAmount,
            dueDate: booking.balanceDueDate,
            daysPastDue: Math.ceil((today.getTime() - balanceDueDate.getTime()) / (1000 * 60 * 60 * 24))
          });
        } else {
          analysis.upcomingBalancePayments++;
          analysis.pendingRevenue += booking.balanceAmount;
        }
      } else if (booking.bookingStatus === 'fully_paid') {
        analysis.totalRevenue += booking.totalAmount;
      }

      // Check for manual intervention requirements
      if (booking.paymentInfo?.requiresManualIntervention) {
        analysis.requiresManualIntervention++;
        analysis.requiresInterventionList.push({
          bookingId: booking.$id,
          reason: 'Payment processing failed',
          gracePeriodEnd: booking.paymentInfo.gracePeriodEnd
        });
      }

      // Check for active payment links
      if (booking.paymentInfo?.paymentLinks) {
        const activeLinks = booking.paymentInfo.paymentLinks.filter(link => link.status === 'pending');
        analysis.activePaymentLinks += activeLinks.length;
      }

      // Analyze today's activity
      const bookingDate = new Date(booking.updatedAt || booking.createdAt || '');
      if (bookingDate >= startOfDay && bookingDate <= endOfDay) {
        // Check for payments processed today
        if (booking.bookingStatus === 'deposit_paid' || booking.bookingStatus === 'fully_paid') {
          analysis.paymentsProcessedToday++;
          
          if (booking.bookingStatus === 'deposit_paid') {
            analysis.totalRevenueToday += booking.depositAmount;
            analysis.todaysSuccessfulPayments.push({
              bookingId: booking.$id,
              type: 'deposit',
              amount: booking.depositAmount,
              time: bookingDate.toISOString()
            });
          } else if (booking.bookingStatus === 'fully_paid') {
            analysis.totalRevenueToday += booking.balanceAmount;
            analysis.todaysSuccessfulPayments.push({
              bookingId: booking.$id,
              type: 'balance',
              amount: booking.balanceAmount,
              time: bookingDate.toISOString()
            });
          }
        }

        // Check for payment links generated today
        if (booking.paymentInfo?.paymentLinks) {
          const todaysLinks = booking.paymentInfo.paymentLinks.filter(link => {
            const linkDate = new Date(link.createdAt);
            return linkDate >= startOfDay && linkDate <= endOfDay;
          });
          analysis.paymentLinksGeneratedToday += todaysLinks.length;
        }
      }
    }

    // Generate HTML email summary
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Daily Payment Summary - ${analysis.date}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <div style="text-align: center; border-bottom: 2px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">MEMORA Admin</h1>
              <h2 style="color: #333; font-size: 20px; margin: 10px 0 0 0;">Daily Payment Summary</h2>
              <p style="color: #666; margin: 5px 0 0 0;">${analysis.date}</p>
            </div>

            <!-- Today's Activity -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Today's Activity</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #28a745;">€${analysis.totalRevenueToday}</div>
                  <div style="color: #666; font-size: 14px;">Revenue Today</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #007bff;">${analysis.paymentsProcessedToday}</div>
                  <div style="color: #666; font-size: 14px;">Payments Processed</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${analysis.paymentLinksGeneratedToday}</div>
                  <div style="color: #666; font-size: 14px;">Payment Links Sent</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 24px; font-weight: bold; color: ${analysis.paymentsFailedToday > 0 ? '#dc3545' : '#28a745'}">${analysis.paymentsFailedToday}</div>
                  <div style="color: #666; font-size: 14px;">Failed Payments</div>
                </div>
              </div>
            </div>

            <!-- Overall Status -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Overall Status</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #1976d2;">${analysis.totalActiveBookings}</div>
                  <div style="color: #666; font-size: 14px;">Active Bookings</div>
                </div>
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #f57c00;">${analysis.pendingDeposits}</div>
                  <div style="color: #666; font-size: 14px;">Pending Deposits</div>
                </div>
                <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: #7b1fa2;">${analysis.upcomingBalancePayments}</div>
                  <div style="color: #666; font-size: 14px;">Upcoming Balance</div>
                </div>
                <div style="background: ${analysis.overduePayments > 0 ? '#ffebee' : '#e8f5e8'}; padding: 15px; border-radius: 8px; text-align: center;">
                  <div style="font-size: 20px; font-weight: bold; color: ${analysis.overduePayments > 0 ? '#d32f2f' : '#388e3c'};">${analysis.overduePayments}</div>
                  <div style="color: #666; font-size: 14px;">Overdue Payments</div>
                </div>
              </div>
            </div>

            <!-- Requires Attention -->
            ${analysis.requiresManualIntervention > 0 || analysis.overduePayments > 0 ? `
              <div style="margin-bottom: 30px;">
                <h3 style="color: #d32f2f; border-bottom: 1px solid #ffcdd2; padding-bottom: 10px;">⚠️ Requires Attention</h3>
                
                ${analysis.requiresManualIntervention > 0 ? `
                  <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <h4 style="color: #d32f2f; margin: 0 0 10px 0;">Manual Intervention Required (${analysis.requiresManualIntervention})</h4>
                    ${analysis.requiresInterventionList.map(item => `
                      <div style="margin-bottom: 8px;">
                        • Booking ${item.bookingId}: ${item.reason}
                        ${item.gracePeriodEnd ? ` (Grace period ends: ${new Date(item.gracePeriodEnd).toLocaleString()})` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                ${analysis.overduePayments > 0 ? `
                  <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <h4 style="color: #f57c00; margin: 0 0 10px 0;">Overdue Payments (${analysis.overduePayments})</h4>
                    ${analysis.overduePaymentsList.map(item => `
                      <div style="margin-bottom: 8px;">
                        • Booking ${item.bookingId}: €${item.amount} (${item.daysPastDue} days overdue)
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            ` : ''}

            <!-- Revenue Summary -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Revenue Summary</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 15px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                  <div>
                    <div style="color: #28a745; font-size: 24px; font-weight: bold;">€${analysis.totalRevenue}</div>
                    <div style="color: #666;">Total Revenue</div>
                  </div>
                  <div>
                    <div style="color: #ffc107; font-size: 24px; font-weight: bold;">€${analysis.pendingRevenue}</div>
                    <div style="color: #666;">Pending Revenue</div>
                  </div>
                  <div>
                    <div style="color: #17a2b8; font-size: 24px; font-weight: bold;">${analysis.activePaymentLinks}</div>
                    <div style="color: #666;">Active Payment Links</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
              <p>Generated automatically by Memora Payment System</p>
              <p>For support, contact: info@memora-experience.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Generate text version
    const emailText = `
Daily Payment Summary - ${analysis.date}

TODAY'S ACTIVITY:
- Revenue: €${analysis.totalRevenueToday}
- Payments Processed: ${analysis.paymentsProcessedToday}
- Payment Links Sent: ${analysis.paymentLinksGeneratedToday}
- Failed Payments: ${analysis.paymentsFailedToday}

OVERALL STATUS:
- Active Bookings: ${analysis.totalActiveBookings}
- Pending Deposits: ${analysis.pendingDeposits}
- Upcoming Balance Payments: ${analysis.upcomingBalancePayments}
- Overdue Payments: ${analysis.overduePayments}
- Requires Manual Intervention: ${analysis.requiresManualIntervention}

REVENUE SUMMARY:
- Total Revenue: €${analysis.totalRevenue}
- Pending Revenue: €${analysis.pendingRevenue}
- Active Payment Links: ${analysis.activePaymentLinks}

${analysis.requiresManualIntervention > 0 || analysis.overduePayments > 0 ? `
REQUIRES ATTENTION:
${analysis.requiresInterventionList.map(item => `- Booking ${item.bookingId}: ${item.reason}`).join('\n')}
${analysis.overduePaymentsList.map(item => `- Booking ${item.bookingId}: €${item.amount} (${item.daysPastDue} days overdue)`).join('\n')}
` : 'All payments are up to date! 🎉'}

Generated by Memora Payment System
    `;

    // Send email to admin
    const emailResult = await sendServerEmail({
      to: adminEmail,
      subject: `Daily Payment Summary - ${analysis.date}${analysis.requiresManualIntervention > 0 || analysis.overduePayments > 0 ? ' ⚠️ Action Required' : ''}`,
      html: emailHtml,
      text: emailText,
      template: 'admin-daily-summary'
    });

    console.log(`Daily payment summary sent to ${adminEmail}: ${emailResult.success}`);

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success,
      summary: analysis,
      adminEmail
    });

  } catch (error) {
    console.error('Error generating daily payment summary:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate payment summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
