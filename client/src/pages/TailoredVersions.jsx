import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Sparkles, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

function AtsBar({ score }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 999, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, background: color, height: '100%', borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontWeight: 700, fontSize: '0.9rem', color, minWidth: 38 }}>{score}/100</span>
    </div>
  )
}

export default function TailoredVersions() {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/api/resume/tailored')
      .then(r => setVersions(r.data.reverse()))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tailored version?')) return
    try {
      await api.delete(`/api/resume/tailored/${id}`)
      setVersions(v => v.filter(x => x._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  if (loading) return <div className="page" style={{ color: '#6b7280' }}>Loading AI versions...</div>

  return (
    <div className="page">
      <h1 className="page-title">AI Tailored Versions</h1>
      <p className="page-subtitle">Every time you use AI Tailor, the result is saved here.</p>

      {versions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Sparkles size={36} color="#c7d2fe" style={{ marginBottom: 12 }} />
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No tailored versions yet.</p>
          <Link to="/resume" className="btn btn-primary"><Sparkles size={15} /> Go to AI Tailor</Link>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            {versions.length} tailored version{versions.length > 1 ? 's' : ''} saved.
          </p>
          {versions.map((v, i) => (
            <div key={v._id} className="card" style={{ marginBottom: '1rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Sparkles size={16} color="#6366f1" />
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                      {v.jobTitle} {v.company ? `@ ${v.company}` : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setExpanded(expanded === i ? null : i)}
                    className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {expanded === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded === i ? 'Collapse' : 'Expand'}
                  </button>
                  <button onClick={() => handleDelete(v._id)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* ATS score always visible */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6b7280', marginBottom: 6 }}>ATS Match Score</div>
                <AtsBar score={v.atsScore} />
              </div>

              {/* Expanded content */}
              {expanded === i && (
                <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem' }}>
                  {/* Improvements */}
                  {v.improvements?.length > 0 && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.85rem', marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#15803d', marginBottom: 6, fontSize: '0.875rem' }}>✅ AI Improvements Made:</div>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                        {v.improvements.map((imp, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', color: '#166534', marginBottom: 3 }}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {v.tailoredSummary && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: 6 }}>📝 Tailored Summary</div>
                      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.85rem', fontSize: '0.875rem', lineHeight: 1.7, color: '#374151' }}>
                        {v.tailoredSummary}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {v.tailoredSkills?.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: 6 }}>🛠 Matched Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {v.tailoredSkills.map(sk => (
                          <span key={sk} style={{ background: '#eef2ff', color: '#4f46e5', padding: '0.22rem 0.7rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 500 }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {v.tailoredExperience?.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: 8 }}>💼 Tailored Experience</div>
                      {v.tailoredExperience.map((exp, ei) => (
                        <div key={ei} style={{ marginBottom: '0.85rem', paddingLeft: '0.85rem', borderLeft: '3px solid #c7d2fe' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{exp.title} — {exp.company}</div>
                          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 4 }}>{exp.duration}</div>
                          <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                            {exp.bullets?.map((b, bi) => (
                              <li key={bi} style={{ fontSize: '0.85rem', color: '#374151', marginBottom: 2 }}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
