import { useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { Sparkles, Zap, CheckCircle } from 'lucide-react'

function AtsRing({ score }) {
  const r = 40, c = 2 * Math.PI * r
  const filled = (score / 100) * c
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${filled} ${c}`} strokeLinecap="round"
          transform="rotate(-90 55 55)" />
        <text x="55" y="55" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 20, fontWeight: 700, fill: color }}>{score}</text>
        <text x="55" y="72" textAnchor="middle"
          style={{ fontSize: 10, fill: '#6b7280' }}>ATS Score</text>
      </svg>
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color }}>
        {score >= 75 ? 'Great match!' : score >= 50 ? 'Good match' : 'Needs work'}
      </span>
    </div>
  )
}

export default function AiTailorPanel() {
  const [form, setForm] = useState({ jobTitle: '', company: '', jobDescription: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTailor = async () => {
    if (!form.jobDescription.trim()) return toast.error('Please paste the job description first')
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/api/ai/tailor', form)
      setResult(res.data)
      toast.success('Resume tailored by AI!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI tailoring failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Input card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="section-title"><Sparkles size={18} color="#6366f1" /> AI Resume Tailor</div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.25rem' }}>
          Paste a job description below. AI will rewrite your resume to match the JD keywords and give you an ATS score.
          Make sure you've saved your resume details first!
        </p>

        <div className="grid-2">
          <div className="form-group">
            <label>Job Title</label>
            <input className="input" placeholder="Frontend Developer"
              value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input className="input" placeholder="Google, Swiggy, Razorpay..."
              value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label>Job Description <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea className="textarea" rows={8}
            placeholder="Paste the full job description here (copy from LinkedIn, Naukri, etc.)..."
            value={form.jobDescription}
            onChange={e => setForm({ ...form, jobDescription: e.target.value })} />
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleTailor} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading
            ? <><span style={{ width: 16, height: 16, border: '2px solid #fff3', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style> Tailoring with AI...</>
            : <><Zap size={17} /> Tailor My Resume with AI</>}
        </button>
      </div>

      {/* Result card */}
      {result && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div className="section-title" style={{ marginBottom: 4 }}>
                <CheckCircle size={18} color="#22c55e" /> AI Tailored for: {form.jobTitle || 'This Role'} {form.company ? `at ${form.company}` : ''}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Saved to your AI Versions. Use this content when applying.</p>
            </div>
            <AtsRing score={result.atsScore} />
          </div>

          {/* Improvements */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, color: '#15803d', marginBottom: 8, fontSize: '0.9rem' }}>✅ What AI improved:</div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              {result.improvements?.map((imp, i) => (
                <li key={i} style={{ fontSize: '0.875rem', color: '#166534', marginBottom: 3 }}>{imp}</li>
              ))}
            </ul>
          </div>

          {/* Tailored Summary */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', marginBottom: 8 }}>📝 Tailored Summary</div>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.85rem', fontSize: '0.9rem', lineHeight: 1.7, color: '#374151' }}>
              {result.tailoredSummary}
            </div>
          </div>

          {/* Tailored Skills */}
          {result.tailoredSkills?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', marginBottom: 8 }}>🛠 Matched Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.tailoredSkills.map(sk => (
                  <span key={sk} style={{ background: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.82rem', fontWeight: 500 }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tailored Experience */}
          {result.tailoredExperience?.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', marginBottom: 10 }}>💼 Tailored Experience</div>
              {result.tailoredExperience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '3px solid #c7d2fe' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exp.title} — {exp.company}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 6 }}>{exp.duration}</div>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {exp.bullets?.map((b, bi) => (
                      <li key={bi} style={{ fontSize: '0.875rem', color: '#374151', marginBottom: 3 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#9ca3af' }}>
            💾 This version is saved under "AI Versions" tab. You can view all versions there.
          </p>
        </div>
      )}
    </div>
  )
}
