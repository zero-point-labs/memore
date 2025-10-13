'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import { 
  Settings, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Euro,
  Clock,
  Mail,
  Bell,
  RefreshCw,
  Shield
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { globalSettingsService } from '@/services/globalSettingsService';
import { GlobalSettingsDocument } from '@/types/booking';

export default function AdminSettingsPage() {
  const { isAdmin } = useAdmin();
  const [settings, setSettings] = useState<GlobalSettingsDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    depositPercentage: 30,
    balancePercentage: 70,
    balanceDueDays: 7,
    currency: 'EUR',
    maxPaymentRetries: 3,
    retryIntervalHours: 24,
    sendBookingConfirmation: true,
    sendPaymentReminders: true,
    reminderDaysBefore: '3,1',
    adminEmail: 'admin@memora-experience.com',
    adminAlertOnFailedPayment: true
  });

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await globalSettingsService.get();
        if (data) {
          setSettings(data);
          setFormData({
            depositPercentage: data.depositPercentage,
            balancePercentage: data.balancePercentage,
            balanceDueDays: data.balanceDueDays,
            currency: data.currency,
            maxPaymentRetries: data.maxPaymentRetries,
            retryIntervalHours: data.retryIntervalHours,
            sendBookingConfirmation: data.sendBookingConfirmation,
            sendPaymentReminders: data.sendPaymentReminders,
            reminderDaysBefore: data.reminderDaysBefore,
            adminEmail: data.adminEmail,
            adminAlertOnFailedPayment: data.adminAlertOnFailedPayment
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadSettings();
    }
  }, [isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await globalSettingsService.update(formData, 'admin');
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      
      // Reload settings
      const updated = await globalSettingsService.get();
      if (updated) {
        setSettings(updated);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save settings' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Access denied</div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-white">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-400" />
            Global Settings
          </h1>
          <p className="text-gray-400">Configure payment system and notification settings</p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? 
              <CheckCircle className="w-5 h-5" /> : 
              <AlertCircle className="w-5 h-5" />
            }
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Payment Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Euro className="w-6 h-6 text-purple-400" />
                Payment Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Deposit Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="depositPercentage"
                    min="1"
                    max="99"
                    value={formData.depositPercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of total amount charged immediately upon booking
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Balance Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="balancePercentage"
                    min="1"
                    max="99"
                    value={formData.balancePercentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of total amount charged automatically before trip
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Balance Due Days Before Trip
                  </label>
                  <input
                    type="number"
                    name="balanceDueDays"
                    min="1"
                    max="30"
                    value={formData.balanceDueDays}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How many days before the trip to charge the balance
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  >
                    <option value="EUR" className="bg-black text-white">EUR (€)</option>
                    <option value="USD" className="bg-black text-white">USD ($)</option>
                    <option value="GBP" className="bg-black text-white">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Max Payment Retries
                  </label>
                  <input
                    type="number"
                    name="maxPaymentRetries"
                    min="1"
                    max="10"
                    value={formData.maxPaymentRetries}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of times to retry a failed payment
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Retry Interval (hours)
                  </label>
                  <input
                    type="number"
                    name="retryIntervalHours"
                    min="1"
                    max="72"
                    value={formData.retryIntervalHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hours to wait between payment retry attempts
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-purple-400" />
                Notification Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address for admin alerts and notifications
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="sendBookingConfirmation"
                    name="sendBookingConfirmation"
                    checked={formData.sendBookingConfirmation}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 bg-white/5 border-purple-500/20 rounded mt-1"
                  />
                  <div>
                    <label htmlFor="sendBookingConfirmation" className="text-white font-medium cursor-pointer">
                      Send Booking Confirmations
                    </label>
                    <p className="text-sm text-gray-400 mt-1">
                      Automatically send confirmation emails to customers after successful booking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="sendPaymentReminders"
                    name="sendPaymentReminders"
                    checked={formData.sendPaymentReminders}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 bg-white/5 border-purple-500/20 rounded mt-1"
                  />
                  <div>
                    <label htmlFor="sendPaymentReminders" className="text-white font-medium cursor-pointer">
                      Send Payment Reminders
                    </label>
                    <p className="text-sm text-gray-400 mt-1">
                      Send reminder emails before balance payment is due
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Reminder Days (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="reminderDaysBefore"
                    value={formData.reminderDaysBefore}
                    onChange={handleInputChange}
                    placeholder="3,1"
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Send reminders this many days before balance payment (e.g., &quot;3,1&quot; = 3 days and 1 day before)
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="adminAlertOnFailedPayment"
                    name="adminAlertOnFailedPayment"
                    checked={formData.adminAlertOnFailedPayment}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 bg-white/5 border-purple-500/20 rounded mt-1"
                  />
                  <div>
                    <label htmlFor="adminAlertOnFailedPayment" className="text-white font-medium cursor-pointer">
                      Alert Admin on Failed Payments
                    </label>
                    <p className="text-sm text-gray-400 mt-1">
                      Send email alerts to admin when a payment fails
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <Shield className="w-5 h-5" />
                <span className="font-medium">System Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white ml-2">
                    {settings?.$updatedAt ? new Date(settings.$updatedAt).toLocaleString('en-GB') : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Updated By:</span>
                  <span className="text-white ml-2">{settings?.updatedBy || 'System'}</span>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
