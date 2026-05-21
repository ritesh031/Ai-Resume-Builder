const mongoose = require('mongoose');

const tailoredVersionSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  tailoredSummary: String,
  tailoredExperience: [{
    title: String,
    company: String,
    duration: String,
    bullets: [String]
  }],
  tailoredSkills: [String],
  atsScore: Number,
  improvements: [String],
  createdAt: { type: Date, default: Date.now }
});

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  sections: {
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' }
    },
    summary: { type: String, default: '' },
    experience: [{
      title: { type: String, default: '' },
      company: { type: String, default: '' },
      duration: { type: String, default: '' },
      bullets: [{ type: String }]
    }],
    education: [{
      degree: { type: String, default: '' },
      institution: { type: String, default: '' },
      year: { type: String, default: '' },
      grade: { type: String, default: '' }
    }],
    skills: [{ type: String }],
    projects: [{
      name: { type: String, default: '' },
      description: { type: String, default: '' },
      tech: { type: String, default: '' },
      link: { type: String, default: '' }
    }]
  },
  tailoredVersions: [tailoredVersionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
