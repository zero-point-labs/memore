import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { BookingDocument } from '@/types/booking';

export const useUserBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user bookings
  const loadBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userBookings = await bookingService.getByUserId(user.$id);
      setBookings(userBookings);
    } catch (err) {
      console.error('Error loading user bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Get booking statistics
  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: 0,
      depositPaid: 0,
      fullyPaid: 0,
      cancelled: 0,
      totalSpent: 0,
      pendingPayments: 0
    };

    bookings.forEach(booking => {
      switch (booking.bookingStatus) {
        case 'pending':
          stats.pending++;
          stats.pendingPayments += booking.totalAmount;
          break;
        case 'deposit_paid':
          stats.depositPaid++;
          stats.totalSpent += booking.depositAmount;
          stats.pendingPayments += booking.balanceAmount;
          break;
        case 'fully_paid':
          stats.fullyPaid++;
          stats.totalSpent += booking.totalAmount;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }
    });

    return stats;
  };

  // Get upcoming bookings
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const balanceDue = new Date(booking.balanceDueDate);
      return balanceDue > now && booking.bookingStatus !== 'cancelled';
    }).sort((a, b) => 
      new Date(a.balanceDueDate).getTime() - new Date(b.balanceDueDate).getTime()
    );
  };

  // Get past bookings
  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const balanceDue = new Date(booking.balanceDueDate);
      return balanceDue <= now || booking.bookingStatus === 'fully_paid';
    }).sort((a, b) => 
      new Date(b.balanceDueDate).getTime() - new Date(a.balanceDueDate).getTime()
    );
  };

  // Get bookings with balance due soon
  const getBalanceDueSoon = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return bookings.filter(booking => {
      if (booking.bookingStatus !== 'deposit_paid') return false;
      
      const balanceDue = new Date(booking.balanceDueDate);
      return balanceDue >= now && balanceDue <= futureDate;
    }).sort((a, b) => 
      new Date(a.balanceDueDate).getTime() - new Date(b.balanceDueDate).getTime()
    );
  };

  // Refresh bookings
  const refreshBookings = () => {
    loadBookings();
  };

  // Load bookings when user changes
  useEffect(() => {
    loadBookings();
  }, [user]);

  return {
    bookings,
    loading,
    error,
    refreshBookings,
    stats: getBookingStats(),
    upcomingBookings: getUpcomingBookings(),
    pastBookings: getPastBookings(),
    balanceDueSoon: getBalanceDueSoon()
  };
};
