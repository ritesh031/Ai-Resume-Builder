const Resume = require('../models/Resume');

const getResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.userId });
    if (!resume) resume = await Resume.create({ userId: req.userId });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateResume = async (req, res) => {
  try {
    const { sections, title } = req.body;
    let resume = await Resume.findOne({ userId: req.userId });
    if (!resume) resume = new Resume({ userId: req.userId });
    if (title) resume.title = title;
    if (sections) {
      resume.sections = { ...resume.sections.toObject(), ...sections };
    }
    await resume.save();
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTailoredVersions = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) return res.json([]);
    res.json(resume.tailoredVersions || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTailoredVersion = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    resume.tailoredVersions = resume.tailoredVersions.filter(
      v => v._id.toString() !== req.params.versionId
    );
    await resume.save();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getResume, updateResume, getTailoredVersions, deleteTailoredVersion };
