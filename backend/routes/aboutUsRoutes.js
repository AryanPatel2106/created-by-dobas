import express from 'express';
const router = express.Router();
import AboutUs from '../models/aboutUsModel.js';

// GET the About Us page content
router.get('/', async (req, res) => {
  const aboutUsContent = await AboutUs.findOne({ pageId: 'main' });
  if (aboutUsContent) {
    res.json(aboutUsContent);
  } else {
    // If it doesn't exist in the DB yet, send back default placeholder data
    res.json({
      title: 'Meet Our Creative Team',
      description: 'Default description. Please update this in the admin panel.',
      teamMembers: [
        { name: 'Admin 1', role: 'Founder', bio: 'Bio...', image: 'https://placehold.co/500x500/f4cccc/4a4a4a?text=Admin+1' },
        { name: 'Admin 2', role: 'Designer', bio: 'Bio...', image: 'https://placehold.co/500x500/a4c2f4/4a4a4a?text=Admin+2' },
        { name: 'Admin 3', role: 'Specialist', bio: 'Bio...', image: 'https://placehold.co/500x500/fff2cc/4a4a4a?text=Admin+3' },
        { name: 'Admin 4', role: 'Manager', bio: 'Bio...', image: 'https://placehold.co/500x500/b6d7a8/4a4a4a?text=Admin+4' },
      ],
    });
  }
});

// PUT (update or create) the About Us page content
router.put('/', async (req, res) => {
  const { title, description, teamMembers } = req.body;

  const aboutUsContent = await AboutUs.findOneAndUpdate(
    { pageId: 'main' }, // Find the single document
    { title, description, teamMembers }, // The new data to set
    { new: true, upsert: true, setDefaultsOnInsert: true } // Options: return new doc, create if doesn't exist
  );

  if (aboutUsContent) {
    res.json(aboutUsContent);
  } else {
    res.status(500).json({ message: 'Error updating About Us page' });
  }
});

export default router;