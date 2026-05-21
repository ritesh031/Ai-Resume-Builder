import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import AiTailorPanel from '../components/resume/AiTailorPanel'
import { Save, Plus, Trash2, User, Briefcase, GraduationCap, Wrench, FolderOpen, Sparkles } from 'lucide-react'

const TABS = [
  { id: 'personal',    label: 'Personal Info', icon: <User size={14} /> },
  { id: 'experience',  label: 'Experience',    icon: <Briefcase size={14} /> },
  { id: 'education',   label: 'Education',     icon: <GraduationCap size={14} /> },
  { id: 'skills',      label: 'Skills',        icon: <Wrench size={14} /> },
  { id: 'projects',    label: 'Projects',      icon: <FolderOpen size={14} /> },
  { id: 'ai',          label: 'AI Tailor ✨',  icon: <Sparkles size={14} /> },
]

export default function ResumeBuilder() {
  const [tab, setTab] = useState('personal')
  const [saving, setSaving] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [sections, setSections] = useState({
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  })

  useEffect(() => {
    api.get('/api/resume')
      .then(res => { if (res.data?.sections) setSections(res.data.sections) })
      .catch(() => toast.error('Could not load resume'))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await api.put('/api/resume', { sections })
      toast.success('Resume saved!')
    } catch {
      toast.error('Save failed. Try again.')
    } finally {
      setSaving(false)
    }
  }

  // Personal
  const upP = (f, v) => setSections(s => ({ ...s, personalInfo: { ...s.personalInfo, [f]: v } }))

  // Experience
  const addExp = () => setSections(s => ({ ...s, experience: [...s.experience, { title: '', company: '', duration: '', bullets: [''] }] }))
  const delExp = i => setSections(s => ({ ...s, experience: s.experience.filter((_, idx) => idx !== i) }))
  const upExp = (i, f, v) => setSections(s => { const e = [...s.experience]; e[i] = { ...e[i], [f]: v }; return { ...s, experience: e } })
  const upBullet = (ei, bi, v) => setSections(s => { const e = [...s.experience]; e[ei].bullets = [...e[ei].bullets]; e[ei].bullets[bi] = v; return { ...s, experience: e } })
  const addBullet = ei => setSections(s => { const e = [...s.experience]; e[ei].bullets = [...e[ei].bullets, '']; return { ...s, experience: e } })
  const delBullet = (ei, bi) => setSections(s => { const e = [...s.experience]; e[ei].bullets = e[ei].bullets.filter((_, i) => i !== bi); return { ...s, experience: e } })

  // Education
  const addEdu = () => setSections(s => ({ ...s, education: [...s.education, { degree: '', institution: '', year: '', grade: '' }] }))
  const delEdu = i => setSections(s => ({ ...s, education: s.education.filter((_, idx) => idx !== i) }))
  const upEdu = (i, f, v) => setSections(s => { const e = [...s.education]; e[i] = { ...e[i], [f]: v }; return { ...s, education: e } })

  // Skills
  const addSkill = e => {
    e.preventDefault()
    const sk = skillInput.trim()
    if (sk && !sections.skills.includes(sk)) setSections(s => ({ ...s, skills: [...s.skills, sk] }))
    setSkillInput('')
  }
  const delSkill = sk => setSections(s => ({ ...s, skills: s.skills.filter(x => x !== sk) }))

  // Projects
  const addProj = () => setSections(s => ({ ...s, projects: [...s.projects, { name: '', description: '', tech: '', link: '' }] }))
  const delProj = i => setSections(s => ({ ...s, projects: s.projects.filter((_, idx) => idx !== i) }))
  const upProj = (i, f, v) => setSections(s => { const p = [...s.projects]; p[i] = { ...p[i], [f]: v }; return { ...s, projects: p } })

  const tabStyle = active => ({
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '0.4rem 0.9rem', borderRadius: 8,
    fontSize: '0.85rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
    background: active ? '#eef2ff' : 'white',
    color: active ? '#4f46e5' : '#6b7280',
    border: `1px solid ${active ? '#c7d2fe' : '#e5e7eb'}`,
    whiteSpace: 'nowrap'
  })

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Resume Builder</h1>
          <p className="page-subtitle">Fill your details, then use AI Tailor to customise for each job.</p>
        </div>
        {tab !== 'ai' && (
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Resume'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(tab === t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* PERSONAL INFO */}
      {tab === 'personal' && (
        <div className="card">
          <div className="section-title"><User size={17} /> Personal Information</div>
          <div className="grid-2">
            {[
              ['fullName', 'Full Name', 'Ritesh Kumar'],
              ['email', 'Email', 'ritesh@gmail.com'],
              ['phone', 'Phone', '+91 98765 43210'],
              ['location', 'Location', 'Delhi, India'],
              ['linkedin', 'LinkedIn URL', 'linkedin.com/in/ritesh'],
              ['github', 'GitHub URL', 'github.com/ritesh'],
            ].map(([field, label, ph]) => (
              <div className="form-group" key={field}>
                <label>{label}</label>
                <input className="input" placeholder={ph}
                  value={sections.personalInfo[field] || ''}
                  onChange={e => upP(field, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Professional Summary</label>
            <textarea className="textarea" rows={4}
              placeholder="Write 2–3 sentences about yourself. Mention your skills, goal, and what makes you stand out as a fresher."
              value={sections.summary}
              onChange={e => setSections(s => ({ ...s, summary: e.target.value }))} />
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {tab === 'experience' && (
        <div>
          {sections.experience.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>
              No experience yet. Add internships, freelance work, or college projects here.
            </div>
          )}
          {sections.experience.map((exp, i) => (
            <div className="card" key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, color: '#374151' }}>Experience #{i + 1}</span>
                <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => delExp(i)}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Job Title</label>
                  <input className="input" placeholder="Frontend Intern" value={exp.title} onChange={e => upExp(i, 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input className="input" placeholder="ABC Tech Pvt Ltd" value={exp.company} onChange={e => upExp(i, 'company', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input className="input" placeholder="June 2023 – Aug 2023" value={exp.duration} onChange={e => upExp(i, 'duration', e.target.value)} />
              </div>
              <div className="form-group">
                <label>What you did (bullet points)</label>
                {exp.bullets.map((b, bi) => (
                  <div key={bi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <input className="input"
                      placeholder="Built a React dashboard that reduced load time by 30%"
                      value={b} onChange={e => upBullet(i, bi, e.target.value)} />
                    {exp.bullets.length > 1 && (
                      <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444', flexShrink: 0 }} onClick={() => delBullet(i, bi)}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ color: '#6366f1' }} onClick={() => addBullet(i)}>
                  <Plus size={13} /> Add bullet
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addExp}><Plus size={15} /> Add Experience</button>
        </div>
      )}

      {/* EDUCATION */}
      {tab === 'education' && (
        <div>
          {sections.education.map((edu, i) => (
            <div className="card" key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Education #{i + 1}</span>
                <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => delEdu(i)}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Degree</label>
                  <input className="input" placeholder="B.Tech Computer Science" value={edu.degree} onChange={e => upEdu(i, 'degree', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Institution</label>
                  <input className="input" placeholder="Delhi Technological University" value={edu.institution} onChange={e => upEdu(i, 'institution', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input className="input" placeholder="2020 – 2024" value={edu.year} onChange={e => upEdu(i, 'year', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Grade / CGPA</label>
                  <input className="input" placeholder="8.2 CGPA" value={edu.grade} onChange={e => upEdu(i, 'grade', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addEdu}><Plus size={15} /> Add Education</button>
        </div>
      )}

      {/* SKILLS */}
      {tab === 'skills' && (
        <div className="card">
          <div className="section-title"><Wrench size={17} /> Skills</div>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
            Type a skill and press Enter or click Add. These will be used by AI Tailor.
          </p>
          <form onSubmit={addSkill} style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
            <input className="input" placeholder="e.g. React, Node.js, MongoDB, Python..."
              value={skillInput} onChange={e => setSkillInput(e.target.value)} style={{ flex: 1 }} />
            <button type="submit" className="btn btn-primary"><Plus size={15} /> Add</button>
          </form>
          {sections.skills.length === 0
            ? <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No skills added yet.</p>
            : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {sections.skills.map(sk => (
                  <span key={sk} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#eef2ff', color: '#4f46e5',
                    padding: '0.3rem 0.8rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 500
                  }}>
                    {sk}
                    <button onClick={() => delSkill(sk)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            )}
        </div>
      )}

      {/* PROJECTS */}
      {tab === 'projects' && (
        <div>
          {sections.projects.map((proj, i) => (
            <div className="card" key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Project #{i + 1}</span>
                <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }} onClick={() => delProj(i)}>
                  <Trash2 size={13} /> Remove
                </button>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Project Name</label>
                  <input className="input" placeholder="AI Resume Builder" value={proj.name} onChange={e => upProj(i, 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tech Stack</label>
                  <input className="input" placeholder="React, Node.js, MongoDB, OpenAI" value={proj.tech} onChange={e => upProj(i, 'tech', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="textarea" rows={3}
                  placeholder="What does it do? What problem does it solve? What did YOU build?"
                  value={proj.description} onChange={e => upProj(i, 'description', e.target.value)} />
              </div>
              <div className="form-group">
                <label>GitHub / Live Link</label>
                <input className="input" placeholder="https://github.com/yourname/project" value={proj.link} onChange={e => upProj(i, 'link', e.target.value)} />
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addProj}><Plus size={15} /> Add Project</button>
        </div>
      )}

      {/* AI TAILOR */}
      {tab === 'ai' && <AiTailorPanel />}
    </div>
  )
}
