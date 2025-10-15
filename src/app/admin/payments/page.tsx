'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Euro, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Users,
  Calendar,
  TrendingUp,
  RefreshCw,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLayout from '@/components/AdminLayout';
import { bookingService } from '@/services/bookingService';
import { paymentScheduleService } from '@/services/paymentScheduleService';
import { globalSettingsService } from '@/services/globalSettingsService';
import { userProfileService } from '@/services/userProfileService';
import { tripService } from '@/services/tripService';
import { BookingDocument, UserProfileDocument, GlobalSettingsDocument } from '@/types/booking';
import { TripDocument } from '@/types/trip';

interface EnhancedBooking extends BookingDocument {
  userProfile?: UserProfileDocument;
  trip?: TripDocument;
}

interface PaymentStats {
  bookings: {
    total: number;
    pending: number;
    depositPaid: number;
    fullyPaid: number;
    cancelled: number;
    totalRevenue: number;
    pendingRevenue: number;
  };
  schedules: {
    total: number;
    pending: number;
    processing: number;
    succeeded: number;
    failed: number;
    cancelled: number;
    totalAmount: number;
    pendingAmount: number;
  };
}

export default function AdminPaymentsPage() {
  const { isAdmin } = useAdmin();
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<EnhancedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettingsDocument | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<EnhancedBooking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [chargeAmount, setChargeAmount] = useState('');
  const [chargeDescription, setChargeDescription] = useState('');
  const [processing, setProcessing] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [bookingStats, scheduleStats, settings, bookings] = await Promise.all([
        bookingService.getStats(),
        paymentScheduleService.getStats(),
        globalSettingsService.getOrCreate(),
        bookingService.getAll(10) // Get recent 10 bookings
      ]);

      setStats({
        bookings: bookingStats,
        schedules: scheduleStats
      });
      
      setGlobalSettings(settings);
      
      // Enhance bookings with user profile and trip data
      const enhancedBookings = await Promise.all(
        bookings.bookings.map(async (booking: BookingDocument) => {
          try {
            const [userProfile, trip] = await Promise.all([
              userProfileService.getByUserId(booking.userId).catch((error) => {
                console.error(`Failed to load profile for user ${booking.userId}:`, error);
                return null;
              }),
              tripService.getTrip(booking.tripId).catch((error) => {
                console.error(`Failed to load trip ${booking.tripId}:`, error);
                return null;
              })
            ]);
            
            console.log(`Booking ${booking.$id}:`, {
              userId: booking.userId,
              tripId: booking.tripId,
              userProfile: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'null',
              trip: trip ? trip.title : 'null',
              bookingStatus: booking.bookingStatus,
              paymentStatus: booking.paymentStatus
            });
            
            return {
              ...booking,
              userProfile,
              trip
            } as EnhancedBooking;
          } catch (error) {
            console.error(`Failed to load data for booking ${booking.$id}:`, error);
            return booking as EnhancedBooking;
          }
        })
      );
      
      setRecentBookings(enhancedBookings);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Update global settings
  const updateSettings = async (newSettings: Partial<GlobalSettingsDocument>) => {
    try {
      await globalSettingsService.update(newSettings, 'admin');
      await loadDashboardData();
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  // Handler functions for admin actions
  const handleManualPayment = async () => {
    // TODO: Open modal to select booking and process manual payment
    alert('Manual payment processing - Feature coming soon!');
  };

  const handleSendReminders = async () => {
    try {
      setRefreshing(true);
      
      // Get bookings with pending balance payments
      const pendingBookings = recentBookings.filter(
        booking => booking.bookingStatus === 'deposit_paid' && 
        new Date(booking.balanceDueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Due within 7 days
      );

      if (pendingBookings.length === 0) {
        alert('No bookings require payment reminders at this time.');
        return;
      }

      // Send reminders for all pending bookings
      const reminderPromises = pendingBookings.map(booking =>
        fetch('/api/admin/payments/send-reminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.$id,
            type: 'balance_due'
          })
        })
      );

      const results = await Promise.all(reminderPromises);
      const successCount = results.filter(r => r.ok).length;

      alert(`Sent ${successCount} payment reminders successfully.`);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to send reminders:', error);
      alert('Failed to send payment reminders. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle individual booking reminder
  const handleSendReminder = async (bookingId: string) => {
    try {
      const response = await fetch('/api/admin/payments/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          type: 'balance_due'
        })
      });

      if (response.ok) {
        alert('Payment reminder sent successfully!');
        await loadDashboardData(); // Refresh data
      } else {
        throw new Error('Failed to send reminder');
      }
    } catch (error) {
      console.error('Failed to send reminder:', error);
      alert('Failed to send payment reminder. Please try again.');
    }
  };

  const handleExportReport = async () => {
    try {
      setRefreshing(true);
      
      // Download CSV report
      const response = await fetch('/api/admin/payments/export-report?format=csv');
      
      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('Report exported successfully!');
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle refund processing
  const handleProcessRefund = async () => {
    if (!selectedBooking || !refundAmount) {
      alert('Please enter a refund amount.');
      return;
    }

    try {
      setProcessing(true);
      
      const response = await fetch('/api/admin/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.$id,
          amount: parseFloat(refundAmount),
          reason: refundReason || 'Admin refund',
          paymentIntentId: selectedBooking.depositPaymentIntentId
        })
      });

      if (response.ok) {
        alert('Refund processed successfully!');
        setShowRefundModal(false);
        setRefundAmount('');
        setRefundReason('');
        await loadDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process refund');
      }
    } catch (error) {
      console.error('Failed to process refund:', error);
      alert(`Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  // Handle manual charge processing
  const handleProcessCharge = async () => {
    if (!selectedBooking || !chargeAmount) {
      alert('Please enter a charge amount.');
      return;
    }

    try {
      setProcessing(true);
      
      const response = await fetch('/api/admin/payments/manual-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.$id,
          amount: parseFloat(chargeAmount),
          description: chargeDescription || 'Manual charge'
        })
      });

      if (response.ok) {
        alert('Manual charge processed successfully!');
        setShowChargeModal(false);
        setChargeAmount('');
        setChargeDescription('');
        await loadDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process charge');
      }
    } catch (error) {
      console.error('Failed to process charge:', error);
      alert(`Failed to process charge: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  // Handle Stripe payment sync
  const handleSyncStripePayments = async () => {
    try {
      setProcessing(true);
      
      const response = await fetch('/api/admin/payments/sync-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Stripe sync completed! ${result.syncedPayments} payments updated. ${result.errors > 0 ? `${result.errors} errors encountered.` : ''}`);
        await loadDashboardData(); // Refresh data
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync with Stripe');
      }
    } catch (error) {
      console.error('Failed to sync with Stripe:', error);
      alert(`Failed to sync with Stripe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Access denied</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading payment dashboard...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Management</h1>
            <p className="text-gray-400">Monitor and manage all bookings and payments</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors flex items-center gap-2"
            >
              <Settings size={16} />
              Settings
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Global Settings Panel */}
        {showSettings && globalSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Global Payment Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Deposit Percentage</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    defaultValue={globalSettings.depositPercentage}
                    className="w-full px-3 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white"
                    onBlur={(e) => updateSettings({ depositPercentage: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Balance Due Days Before Trip</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    defaultValue={globalSettings.balanceDueDays}
                    className="w-full px-3 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white"
                    onBlur={(e) => updateSettings({ balanceDueDays: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Max Payment Retries</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    defaultValue={globalSettings.maxPaymentRetries}
                    className="w-full px-3 py-2 bg-white/5 border border-purple-500/20 rounded-lg text-white"
                    onBlur={(e) => updateSettings({ maxPaymentRetries: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Euro className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">€{stats.bookings.totalRevenue}</div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{stats.bookings.total}</div>
                  <div className="text-sm text-gray-400">Total Bookings</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{stats.schedules.pending}</div>
                  <div className="text-sm text-gray-400">Pending Payments</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{stats.schedules.failed}</div>
                  <div className="text-sm text-gray-400">Failed Payments</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSyncStripePayments}
                disabled={processing}
                className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={processing ? 'animate-spin' : ''} />
                {processing ? 'Syncing...' : 'Sync Stripe'}
              </button>
              <button className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors flex items-center gap-2">
                <Search size={16} />
                Search
              </button>
              <button className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No bookings yet</h3>
              <p className="text-gray-500">Bookings will appear here once customers start booking trips</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Booking ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Trip</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Balance Due</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.$id} className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-purple-400 font-mono text-sm">#{booking.$id.slice(-8)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white font-medium">
                          {booking.userProfile ? 
                            `${booking.userProfile.firstName} ${booking.userProfile.lastName}` : 
                            `Customer #${booking.userId.slice(-6)}`
                          }
                        </div>
                        <div className="text-gray-400 text-sm">
                          {booking.userProfile?.email || booking.packageType}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white font-medium">
                          {booking.trip?.title || `Trip #${booking.tripId.slice(-6)}`}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {booking.trip?.location || `${booking.roomPreference} • ${booking.transportPreference}`}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white font-bold">€{booking.totalAmount}</div>
                        <div className="text-gray-400 text-sm">
                          €{booking.depositAmount} / €{booking.balanceAmount}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.bookingStatus === 'fully_paid' ? 'bg-green-500/20 text-green-400' :
                            booking.bookingStatus === 'deposit_paid' ? 'bg-yellow-500/20 text-yellow-400' :
                            booking.bookingStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {booking.bookingStatus.replace('_', ' ')}
                          </span>
                          
                          {/* Payment Link Indicators */}
                          {booking.paymentInfo?.paymentLinks && booking.paymentInfo.paymentLinks.length > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-blue-400 text-xs">
                                {booking.paymentInfo.paymentLinks.filter(link => link.status === 'pending').length} active link{booking.paymentInfo.paymentLinks.filter(link => link.status === 'pending').length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          
                          {/* Manual Intervention Indicator */}
                          {booking.paymentInfo?.requiresManualIntervention && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                              <span className="text-red-400 text-xs">Intervention needed</span>
                            </div>
                          )}
                          
                          {/* Grace Period Indicator */}
                          {booking.paymentInfo?.gracePeriodEnd && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-400 text-xs">Grace period</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white text-sm">
                          {new Date(booking.balanceDueDate).toLocaleDateString('en-GB')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowBookingDetails(true);
                            }}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium hover:bg-purple-500/10 px-2 py-1 rounded transition-colors"
                          >
                            View Details
                          </button>
                          {booking.bookingStatus === 'deposit_paid' && (
                            <button 
                              onClick={() => handleSendReminder(booking.$id)}
                              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium hover:bg-yellow-500/10 px-2 py-1 rounded transition-colors"
                            >
                              Send Reminder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleManualPayment()}
              className="p-6 bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-xl text-left hover:bg-black/60 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Process Payments</h3>
              <p className="text-gray-400 text-sm">Manually trigger balance payments</p>
            </button>

            <button
              onClick={() => handleSendReminders()}
              className="p-6 bg-black/40 backdrop-blur-xl border border-yellow-500/20 rounded-xl text-left hover:bg-black/60 transition-colors"
            >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Send Reminders</h3>
              <p className="text-gray-400 text-sm">Send payment reminder emails</p>
            </button>

            <button
              onClick={() => handleExportReport()}
              className="p-6 bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-xl text-left hover:bg-black/60 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Export Reports</h3>
              <p className="text-gray-400 text-sm">Download payment and booking reports</p>
            </button>
          </div>
        </motion.div>

        {/* Booking Details Modal */}
        {showBookingDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-black/40 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Name</label>
                      <div className="text-white font-medium">
                        {selectedBooking.userProfile ? 
                          `${selectedBooking.userProfile.firstName} ${selectedBooking.userProfile.lastName}` : 
                          'N/A'
                        }
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <div className="text-white">{selectedBooking.userProfile?.email || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Phone</label>
                      <div className="text-white">{selectedBooking.userProfile?.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Student Status</label>
                      <div className="text-white capitalize">{selectedBooking.userProfile?.studentStatus || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="bg-black/40 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Trip Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Trip Name</label>
                      <div className="text-white font-medium">
                        {selectedBooking.trip?.title || `Trip #${selectedBooking.tripId.slice(-6)}`}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Location</label>
                      <div className="text-white">{selectedBooking.trip?.location || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Duration</label>
                      <div className="text-white">{selectedBooking.trip?.duration ? `${selectedBooking.trip.duration} days` : 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Category</label>
                      <div className="text-white capitalize">{selectedBooking.trip?.category?.replace('-', ' ') || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="bg-black/40 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Booking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Booking ID</label>
                      <div className="text-purple-400 font-mono">#{selectedBooking.$id.slice(-8)}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Package Type</label>
                      <div className="text-white capitalize">{selectedBooking.packageType}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Room Preference</label>
                      <div className="text-white capitalize">{selectedBooking.roomPreference}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Transport</label>
                      <div className="text-white capitalize">{selectedBooking.transportPreference}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.bookingStatus === 'fully_paid' ? 'bg-green-500/20 text-green-400' :
                        selectedBooking.bookingStatus === 'deposit_paid' ? 'bg-yellow-500/20 text-yellow-400' :
                        selectedBooking.bookingStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {selectedBooking.bookingStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Balance Due Date</label>
                      <div className="text-white">{new Date(selectedBooking.balanceDueDate).toLocaleDateString('en-GB')}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-black/40 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">Total Amount</label>
                      <div className="text-white font-bold text-lg">€{selectedBooking.totalAmount}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Deposit Paid</label>
                      <div className="text-green-400 font-semibold">€{selectedBooking.depositAmount}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Balance Due</label>
                      <div className="text-yellow-400 font-semibold">€{selectedBooking.balanceAmount}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Links & Grace Period Info */}
                {selectedBooking.paymentInfo && (selectedBooking.paymentInfo.paymentLinks?.length > 0 || selectedBooking.paymentInfo.gracePeriodEnd || selectedBooking.paymentInfo.requiresManualIntervention) && (
                  <div className="bg-black/40 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Payment Links & Status</h3>
                    
                    {/* Grace Period Warning */}
                    {selectedBooking.paymentInfo.gracePeriodEnd && (
                      <div className={`p-3 rounded-lg mb-3 ${
                        selectedBooking.paymentInfo.requiresManualIntervention 
                          ? 'bg-red-600/10 border border-red-500/30' 
                          : 'bg-yellow-600/10 border border-yellow-500/30'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">
                            Grace Period: {new Date(selectedBooking.paymentInfo.gracePeriodEnd).toLocaleString('en-GB')}
                          </span>
                        </div>
                        {selectedBooking.paymentInfo.requiresManualIntervention && (
                          <div className="text-red-400 text-sm mt-1">⚠️ Manual intervention required</div>
                        )}
                      </div>
                    )}

                    {/* Payment Links */}
                    {selectedBooking.paymentInfo.paymentLinks && selectedBooking.paymentInfo.paymentLinks.length > 0 && (
                      <div className="space-y-2">
                        {selectedBooking.paymentInfo.paymentLinks.map((link, index) => (
                          <div key={link.sessionId} className="p-3 bg-black/20 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-white text-sm font-medium">
                                {link.paymentType === 'deposit' ? 'Deposit' : 
                                 link.paymentType === 'balance' ? 'Balance' : 
                                 'Manual Charge'} Payment Link
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  link.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                  link.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                                  link.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {link.status}
                                </span>
                                <div className="text-white font-bold">€{link.amount}</div>
                              </div>
                            </div>
                            
                            <div className="text-gray-400 text-xs space-y-1">
                              <div>Created: {new Date(link.createdAt).toLocaleString('en-GB')}</div>
                              <div>Expires: {new Date(link.expiresAt).toLocaleString('en-GB')}</div>
                              {link.completedAt && (
                                <div className="text-green-400">Completed: {new Date(link.completedAt).toLocaleString('en-GB')}</div>
                              )}
                              {link.paymentIntentId && (
                                <div className="font-mono">Transaction: {link.paymentIntentId}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Method Information */}
                {selectedBooking.paymentMethodId && (
                  <div className="bg-black/40 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
                    <div className="text-gray-400 text-sm space-y-1">
                      <div>Payment Method ID: <span className="font-mono text-white">{selectedBooking.paymentMethodId}</span></div>
                      {selectedBooking.stripeCustomerId && (
                        <div>Stripe Customer: <span className="font-mono text-white">{selectedBooking.stripeCustomerId}</span></div>
                      )}
                      {selectedBooking.depositPaymentIntentId && (
                        <div>Deposit Transaction: <span className="font-mono text-white">{selectedBooking.depositPaymentIntentId}</span></div>
                      )}
                      {selectedBooking.balancePaymentIntentId && (
                        <div>Balance Transaction: <span className="font-mono text-white">{selectedBooking.balancePaymentIntentId}</span></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div className="bg-black/40 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Special Requests</h3>
                    <div className="text-gray-300">{selectedBooking.specialRequests}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                  {selectedBooking.bookingStatus === 'deposit_paid' && (
                    <button
                      onClick={() => {
                        handleSendReminder(selectedBooking.$id);
                        setShowBookingDetails(false);
                      }}
                      className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-600/30 transition-colors"
                    >
                      Send Payment Reminder
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowBookingDetails(false);
                      setShowChargeModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors"
                  >
                    Manual Charge
                  </button>
                  
                  {/* Always show refund button for testing - will be conditional later */}
                  <button
                    onClick={() => {
                      setShowBookingDetails(false);
                      setShowRefundModal(true);
                    }}
                    className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors"
                  >
                    Process Refund
                  </button>
                  
                  <button
                    onClick={() => setShowBookingDetails(false)}
                    className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Process Refund</h2>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-black/40 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Customer</div>
                  <div className="text-white font-medium">
                    {selectedBooking.userProfile ? 
                      `${selectedBooking.userProfile.firstName} ${selectedBooking.userProfile.lastName}` : 
                      'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Trip: {selectedBooking.trip?.title || `#${selectedBooking.tripId.slice(-6)}`}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Refund Amount (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedBooking.totalAmount}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                    placeholder="Enter refund amount"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Max refundable: €{selectedBooking.totalAmount}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Reason (Optional)</label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 resize-none"
                    rows={3}
                    placeholder="Enter refund reason..."
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={handleProcessRefund}
                    disabled={processing || !refundAmount}
                    className="flex-1 px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {processing ? 'Processing...' : 'Process Refund'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRefundModal(false);
                      setRefundAmount('');
                      setRefundReason('');
                    }}
                    className="px-4 py-3 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Manual Charge Modal */}
        {showChargeModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Manual Charge</h2>
                <button
                  onClick={() => setShowChargeModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-black/40 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-1">Customer</div>
                  <div className="text-white font-medium">
                    {selectedBooking.userProfile ? 
                      `${selectedBooking.userProfile.firstName} ${selectedBooking.userProfile.lastName}` : 
                      'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Trip: {selectedBooking.trip?.title || `#${selectedBooking.tripId.slice(-6)}`}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Charge Amount (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter charge amount"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={chargeDescription}
                    onChange={(e) => setChargeDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none"
                    rows={3}
                    placeholder="Enter charge description..."
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={handleProcessCharge}
                    disabled={processing || !chargeAmount}
                    className="flex-1 px-4 py-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {processing ? 'Processing...' : 'Process Charge'}
                  </button>
                  <button
                    onClick={() => {
                      setShowChargeModal(false);
                      setChargeAmount('');
                      setChargeDescription('');
                    }}
                    className="px-4 py-3 bg-gray-600/20 border border-gray-500/30 rounded-lg text-gray-300 hover:bg-gray-600/30 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
