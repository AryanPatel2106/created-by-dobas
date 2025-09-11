import mongoose from 'mongoose';

const teamMemberSchema = mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
});

const aboutUsSchema = mongoose.Schema({
  pageId: { type: String, required: true, unique: true, default: 'main' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  teamMembers: [teamMemberSchema],
}, {
  timestamps: true,
});

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;