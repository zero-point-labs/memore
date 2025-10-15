import { useState, useEffect } from 'react';

export interface PaymentScheduleItem {
  bookingId: string;
  tripTitle: string;
  tripDate: string;
  tripId: string;
  totalAmount: number;
  currency: string;
  paymentType: 'deposit' | 'balance' | 'manual_charge';
  amount: number;
  dueDate?: string;
  paidDate?: string;
  status: 'scheduled' | 'due_soon' | 'overdue' | 'completed' | 'pending';
  description: string;
  canPayNow?: boolean;
  paymentLink?: string;
  daysUntilDue?: number;
  gracePeriodEnd?: string;
  requiresManualIntervention?: boolean;
  paymentIntentId?: string;
}

export interface PaymentScheduleData {
  upcomingPayments: PaymentScheduleItem[];
  paymentHistory: PaymentScheduleItem[];
  totalUpcoming: number;
  summary: {
    totalBookings: number;
    upcomingPaymentsCount: number;
    completedPaymentsCount: number;
    overduePayments: number;
    dueSoonPayments: number;
  };
}

export function usePaymentSchedule() {
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/payment-schedule');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment schedule');
      }

      if (data.success) {
        setPaymentSchedule(data);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching payment schedule:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payment schedule');
      setPaymentSchedule(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentSchedule();
  }, []);

  const refreshPaymentSchedule = () => {
    fetchPaymentSchedule();
  };

  // Computed values
  const upcomingPayments = paymentSchedule?.upcomingPayments || [];
  const paymentHistory = paymentSchedule?.paymentHistory || [];
  const totalUpcoming = paymentSchedule?.totalUpcoming || 0;
  const summary = paymentSchedule?.summary || {
    totalBookings: 0,
    upcomingPaymentsCount: 0,
    completedPaymentsCount: 0,
    overduePayments: 0,
    dueSoonPayments: 0
  };

  // Helper functions
  const getNextPayment = (): PaymentScheduleItem | null => {
    if (upcomingPayments.length === 0) return null;
    
    // Sort by due date and return the earliest
    const sorted = [...upcomingPayments].sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    return sorted[0];
  };

  const getOverduePayments = (): PaymentScheduleItem[] => {
    return upcomingPayments.filter(payment => payment.status === 'overdue');
  };

  const getDueSoonPayments = (): PaymentScheduleItem[] => {
    return upcomingPayments.filter(payment => payment.status === 'due_soon');
  };

  const getPaymentsByTrip = (tripId: string): PaymentScheduleItem[] => {
    return [
      ...upcomingPayments.filter(p => p.tripId === tripId),
      ...paymentHistory.filter(p => p.tripId === tripId)
    ];
  };

  return {
    paymentSchedule,
    loading,
    error,
    refreshPaymentSchedule,
    
    // Data
    upcomingPayments,
    paymentHistory,
    totalUpcoming,
    summary,
    
    // Helper functions
    getNextPayment,
    getOverduePayments,
    getDueSoonPayments,
    getPaymentsByTrip,
    
    // Computed flags
    hasUpcomingPayments: upcomingPayments.length > 0,
    hasOverduePayments: summary.overduePayments > 0,
    hasDueSoonPayments: summary.dueSoonPayments > 0,
    hasPaymentHistory: paymentHistory.length > 0
  };
}
