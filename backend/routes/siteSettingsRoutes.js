import express from 'express';
const router = express.Router();
import SiteSettings from '../models/siteSettingsModel.js';

// GET the site settings
router.get('/', async (req, res) => {
  const settings = await SiteSettings.findOne({ settingsId: 'main' });
  if (settings) {
    res.json(settings);
  } else {
    // If no settings exist yet, send default placeholder data
    res.json({
      aboutStore: "We specialize in customized and unique gifting solutions, offering thoughtfully curated products that add a personal touch to every occasion. Our handcrafted gifts are designed to create lasting memories.",
      email: "contact.createdbydobas@example.com",
      phone: "+91 12345 67890",
      address: "Mumbai, Maharashtra, India – 400092",
      socials: { instagram: '#', youtube: '#', whatsapp: '#', linkedin: '#' }
    });
  }
});

// PUT (update or create) the site settings
router.put('/', async (req, res) => {
  const { aboutStore, email, phone, address, socials } = req.body;
  const settings = await SiteSettings.findOneAndUpdate(
    { settingsId: 'main' },
    { aboutStore, email, phone, address, socials },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (settings) {
    res.json(settings);
  } else {
    res.status(500).json({ message: 'Error updating site settings' });
  }
});

export default router;