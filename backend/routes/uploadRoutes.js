import express from 'express';
const router = express.Router();

// This route reads the secrets (now loaded correctly) and sends them to the frontend.
router.get('/', (req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

export default router;