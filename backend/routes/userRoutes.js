import express from 'express';
const router = express.Router();
import emailService from '../services/emailService.js';

// User notification preferences model (in-memory for now, should be in database)
const userPreferences = new Map();

// Get user notification preferences
router.get('/:email/notification-preferences', async (req, res) => {
  try {
    const { email } = req.params;
    const preferences = userPreferences.get(email) || {
      orderConfirmation: true,
      orderStatusUpdates: true,
      promotionalEmails: true,
      newProductAlerts: false,
      reviewReminders: true,
      weeklyNewsletter: false,
      smsNotifications: false,
      pushNotifications: true
    };
    
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ message: 'Failed to fetch notification preferences' });
  }
});

// Update user notification preferences
router.post('/:email/notification-preferences', async (req, res) => {
  try {
    const { email } = req.params;
    const preferences = req.body;
    
    userPreferences.set(email, preferences);
    
    res.json({ message: 'Notification preferences updated successfully', preferences });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
});

// Send welcome email for new users
router.post('/:email/send-welcome', async (req, res) => {
  try {
    const { email } = req.params;
    const { name } = req.body;
    
    const result = await emailService.sendWelcomeEmail({ name, email });
    
    if (result.success) {
      res.json({ message: 'Welcome email sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send welcome email', error: result.error });
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ message: 'Failed to send welcome email' });
  }
});

export default router;
