import { NextRequest, NextResponse } from 'next/server';
import { serverBookingService } from '@/services/server/bookingService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Get all bookings
    const bookings = await serverBookingService.getAll();

    // Filter by date range if provided
    let filteredBookings = bookings;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.$createdAt);
        return bookingDate >= start && bookingDate <= end;
      });
    }

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Booking ID',
        'Customer Name',
        'Email',
        'Phone',
        'Trip Title',
        'Trip Date',
        'Total Amount',
        'Deposit Amount',
        'Balance Amount',
        'Status',
        'Created Date',
        'Balance Due Date'
      ];

      const csvRows = filteredBookings.map(booking => [
        booking.$id,
        `${booking.firstName} ${booking.lastName}`,
        booking.email,
        booking.phone,
        booking.tripTitle,
        booking.tripDate,
        booking.totalAmount,
        booking.depositAmount,
        booking.balanceAmount,
        booking.status,
        new Date(booking.$createdAt).toLocaleDateString('en-GB'),
        booking.balanceDueDate
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="bookings-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else {
      // Return JSON
      return NextResponse.json({
        success: true,
        data: filteredBookings,
        summary: {
          totalBookings: filteredBookings.length,
          totalRevenue: filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0),
          pendingPayments: filteredBookings.filter(b => b.status === 'pending' || b.status === 'deposit_paid').length,
          completedBookings: filteredBookings.filter(b => b.status === 'completed').length
        }
      });
    }

  } catch (error) {
    console.error('Export report error:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 }
    );
  }
}
