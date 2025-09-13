import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Package, Star, Settings } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const NotificationPreferences = ({ user }) => {
  const [preferences, setPreferences] = useState({
    orderConfirmation: true,
    orderStatusUpdates: true,
    promotionalEmails: true,
    newProductAlerts: false,
    reviewReminders: true,
    weeklyNewsletter: false,
    smsNotifications: false,
    pushNotifications: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const notificationTypes = [
    {
      key: 'orderConfirmation',
      title: 'Order Confirmations',
      description: 'Get notified when your order is placed',
      icon: Package,
      category: 'Orders',
      required: true
    },
    {
      key: 'orderStatusUpdates',
      title: 'Order Status Updates',
      description: 'Updates when your order is processed, shipped, or delivered',
      icon: Bell,
      category: 'Orders',
      required: false
    },
    {
      key: 'reviewReminders',
      title: 'Review Reminders',
      description: 'Gentle reminders to review your purchased items',
      icon: Star,
      category: 'Engagement',
      required: false
    },
    {
      key: 'promotionalEmails',
      title: 'Promotional Offers',
      description: 'Special discounts and seasonal offers',
      icon: Mail,
      category: 'Marketing',
      required: false
    },
    {
      key: 'newProductAlerts',
      title: 'New Product Alerts',
      description: 'Be the first to know about new handmade items',
      icon: Bell,
      category: 'Marketing',
      required: false
    },
    {
      key: 'weeklyNewsletter',
      title: 'Weekly Newsletter',
      description: 'Weekly roundup of new products and stories',
      icon: MessageSquare,
      category: 'Marketing',
      required: false
    },
    {
      key: 'smsNotifications',
      title: 'SMS Notifications',
      description: 'Important updates via text message',
      icon: MessageSquare,
      category: 'Orders',
      required: false
    },
    {
      key: 'pushNotifications',
      title: 'Browser Notifications',
      description: 'Real-time notifications in your browser',
      icon: Bell,
      category: 'System',
      required: false
    }
  ];

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/api/users/${user.email}/notification-preferences`);
      setPreferences({ ...preferences, ...data });
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
      // If preferences don't exist, use defaults
      if (error.response?.status !== 404) {
        setError('Failed to load notification preferences');
      }
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await api.post(`/api/users/${user.email}/notification-preferences`, preferences);
      setSuccess('Notification preferences saved successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const groupedNotifications = notificationTypes.reduce((acc, notification) => {
    if (!acc[notification.category]) {
      acc[notification.category] = [];
    }
    acc[notification.category].push(notification);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <LoadingSpinner text="Loading notification preferences..." />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-[var(--theme-pink)]" />
        <h2 className="text-2xl font-bold text-gray-800">Notification Preferences</h2>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-green-800 font-medium">{success}</p>
        </motion.div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedNotifications).map(([category, notifications]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              {category}
            </h3>
            
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                const isEnabled = preferences[notification.key];
                
                return (
                  <motion.div
                    key={notification.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${isEnabled ? 'bg-[var(--theme-pink)] text-gray-800' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">
                            {notification.title}
                          </h4>
                          {notification.required && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.description}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => !notification.required && handleToggle(notification.key)}
                        disabled={notification.required}
                        className="sr-only peer"
                      />
                      <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                        isEnabled ? 'peer-checked:bg-[var(--theme-pink)]' : ''
                      } ${notification.required ? 'opacity-50 cursor-not-allowed' : ''}`} />
                    </label>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Changes are saved automatically when you toggle preferences.
          </p>
          
          <button
            onClick={savePreferences}
            disabled={saving}
            className="px-6 py-2 bg-[var(--theme-pink)] text-gray-800 font-semibold rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />}
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Email Delivery</h4>
        <p className="text-sm text-blue-700">
          All notifications will be sent to <strong>{user.email}</strong>. 
          To change your email address, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default NotificationPreferences;
