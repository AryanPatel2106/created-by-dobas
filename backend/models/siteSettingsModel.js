import mongoose from 'mongoose';

const siteSettingsSchema = mongoose.Schema({
  // A unique ID to ensure we only ever have one settings document
  settingsId: { type: String, required: true, unique: true, default: 'main' },
  aboutStore: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  socials: {
    instagram: { type: String, default: '#' },
    youtube: { type: String, default: '#' },
    whatsapp: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
  }
}, {
  timestamps: true,
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;