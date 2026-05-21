import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { FileText, Briefcase, Sparkles, TrendingUp, Plus, ArrowRight } from 'lucide-react'

const STATUS_COLORS = {
  Wishlist: 'badge-gray', Applied: 'badge-purple',
  Interview: 'badge-yellow', Offer: 'badge-green', Rejected: 'badge-red'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [tailored, setTailored] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/api/jobs'), api.get('/api/resume/tailored')])
      .then(([j, t]) => { setJobs(j.data); setTailored(t.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page" style={{ color: '#6b7280' }}>Loading...</div>

  const interviews = jobs.filter(j => j.status === 'Interview').length
  const offers     = jobs.filter(j => j.status === 'Offer').length

  return (
    <div className="page">
      <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="page-subtitle">Here's your job search at a glance.</p>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Applications', value: jobs.length,      icon: <Briefcase size={22} color="#6366f1" />, bg: '#eef2ff' },
          { label: 'Interviews',         value: interviews,        icon: <TrendingUp size={22} color="#22c55e" />, bg: '#f0fdf4' },
          { label: 'AI Tailored',        value: tailored.length,   icon: <Sparkles  size={22} color="#f59e0b" />, bg: '#fffbeb' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: '1.9rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* Quick actions */}
        <div className="card">
          <div className="section-title"><Sparkles size={17} color="#6366f1" /> Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { to: '/resume',   icon: <FileText size={15} />,  label: 'Build / Edit My Resume' },
              { to: '/jobs',     icon: <Plus size={15} />,      label: 'Add New Job Application' },
              { to: '/tailored', icon: <Sparkles size={15} />,  label: 'View AI Tailored Versions' },
            ].map(a => (
              <Link key={a.to} to={a.to} className="btn btn-secondary"
                style={{ justifyContent: 'space-between', padding: '0.65rem 1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>{a.icon}{a.label}</span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent jobs */}
        <div className="card">
          <div className="section-title"><Briefcase size={17} color="#6366f1" /> Recent Applications</div>
          {jobs.length === 0 ? (
            <div style={{ color: '#9ca3af', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.9rem' }}>
              No jobs tracked yet.{' '}
              <Link to="/jobs" style={{ color: '#6366f1' }}>Add your first →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {jobs.slice(0, 5).map((job, i) => (
                <div key={job._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.6rem 0',
                  borderBottom: i < Math.min(jobs.length, 5) - 1 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{job.role}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{job.company}</div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                </div>
              ))}
              {jobs.length > 5 && (
                <Link to="/jobs" style={{ fontSize: '0.85rem', color: '#6366f1', textAlign: 'center', marginTop: 8 }}>
                  View all {jobs.length} →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {offers > 0 && (
        <div style={{ marginTop: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>🎉</span>
          <span style={{ fontWeight: 600, color: '#15803d' }}>You have {offers} job offer{offers > 1 ? 's' : ''}! Congratulations!</span>
        </div>
      )}
    </div>
  )
}
