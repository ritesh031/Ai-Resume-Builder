const Groq = require('groq-sdk');
const Resume = require('../models/Resume');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const tailorResume = async (req, res) => {
  try {
    const { jobTitle, company, jobDescription } = req.body;
    if (!jobDescription)
      return res.status(400).json({ message: 'Job description is required' });

    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume)
      return res.status(404).json({ message: 'Please build your resume first.' });

    const { sections } = resume;
    const resumeText = `
NAME: ${sections.personalInfo?.fullName || 'Not provided'}
SUMMARY: ${sections.summary || 'Not provided'}
EXPERIENCE: ${JSON.stringify(sections.experience || [])}
EDUCATION: ${JSON.stringify(sections.education || [])}
SKILLS: ${(sections.skills || []).join(', ') || 'Not provided'}
PROJECTS: ${JSON.stringify(sections.projects || [])}
    `.trim();

    const prompt = `You are an expert resume writer and ATS optimization specialist.

The candidate is applying for: "${jobTitle || 'Software Developer'}" at "${company || 'a company'}"

CANDIDATE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Rewrite the summary to match JD keywords naturally (2-3 sentences).
2. Rewrite experience bullet points to align with JD. Use strong action verbs. Quantify where possible. Do NOT invent experience.
3. List skills from resume that match JD (add up to 3 realistic ones for a CSE fresher if missing).
4. Give ATS match score 0-100.
5. List 3-5 specific improvements made.

Respond ONLY with raw valid JSON. No markdown, no backticks, no extra text.

{
  "tailoredSummary": "string",
  "tailoredExperience": [
    { "title": "string", "company": "string", "duration": "string", "bullets": ["string"] }
  ],
  "tailoredSkills": ["string"],
  "atsScore": 78,
  "improvements": ["string"]
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    let raw = completion.choices[0].message.content.trim();
    raw = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    resume.tailoredVersions.push({
      jobTitle: jobTitle || 'Unknown Role',
      company: company || 'Unknown Company',
      tailoredSummary: parsed.tailoredSummary,
      tailoredExperience: parsed.tailoredExperience,
      tailoredSkills: parsed.tailoredSkills,
      atsScore: parsed.atsScore,
      improvements: parsed.improvements
    });
    await resume.save();

    res.json(parsed);
  } catch (err) {
    console.error('Groq AI error:', err.message);
    if (err.message?.includes('JSON'))
      return res.status(500).json({ message: 'AI returned unexpected format. Try again.' });
    res.status(500).json({ message: err.message || 'AI service error' });
  }
};

module.exports = { tailorResume };