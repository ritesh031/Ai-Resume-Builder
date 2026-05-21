import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Plus, X, Trash2, ExternalLink, ChevronDown } from 'lucide-react'

const STATUSES = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']
const STATUS_COLORS = {
  Wishlist:  { bg: '#f3f4f6', border: '#d1d5db', dot: '#6b7280'  },
  Applied:   { bg: '#eef2ff', border: '#c7d2fe', dot: '#6366f1'  },
  Interview: { bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b'  },
  Offer:     { bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e'  },
  Rejected:  { bg: '#fef2f2', border: '#fecaca', dot: '#ef4444'  },
}

const EMPTY_FORM = { company: '', role: '', status: 'Wishlist', jdText: '', link: '', appliedDate: '', notes: '', salary: '' }

function JobCard({ job, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const col = STATUS_COLORS[job.status]

  return (
    <div style={{ background: 'white', border: `1px solid ${col.border}`, borderRadius: 10, padding: '0.85rem', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{job.role}</div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{job.company}</div>
          {job.salary && <div style={{ fontSize: '0.78rem', color: '#22c55e', marginTop: 2 }}>💰 {job.salary}</div>}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2 }}>
            <ChevronDown size={15} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
          <button onClick={() => onDelete(job._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: 2 }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {job.appliedDate && (
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>📅 {job.appliedDate}</div>
      )}

      {expanded && (
        <div style={{ marginTop: 10, borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
          {/* Status change */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 4 }}>Move to status:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {STATUSES.filter(s => s !== job.status).map(s => (
                <button key={s} onClick={() => onUpdate(job._id, { status: s })}
                  style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: 6, border: `1px solid ${STATUS_COLORS[s].border}`, background: STATUS_COLORS[s].bg, cursor: 'pointer', color: '#374151' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {job.notes && <div style={{ fontSize: '0.8rem', color: '#4b5563', marginBottom: 6 }}>📝 {job.notes}</div>}
          {job.link && (
            <a href={job.link} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              <ExternalLink size={12} /> View Job Posting
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function JobTracker() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchJobs = () => {
    api.get('/api/jobs').then(r => setJobs(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchJobs() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.post('/api/jobs', form)
      setJobs(prev => [res.data, ...prev])
      setForm(EMPTY_FORM)
      setShowModal(false)
      toast.success('Job added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add job')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (id, update) => {
    try {
      const res = await api.put(`/api/jobs/${id}`, update)
      setJobs(prev => prev.map(j => j._id === id ? res.data : j))
      toast.success('Updated!')
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this job?')) return
    try {
      await api.delete(`/api/jobs/${id}`)
      setJobs(prev => prev.filter(j => j._id !== id))
      toast.success('Removed')
    } catch { toast.error('Delete failed') }
  }

  if (loading) return <div className="page" style={{ color: '#6b7280' }}>Loading jobs...</div>

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Job Tracker</h1>
          <p className="page-subtitle">Track all your applications in a Kanban board.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Job
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', overflowX: 'auto' }}>
        {STATUSES.map(status => {
          const col = STATUS_COLORS[status]
          const colJobs = jobs.filter(j => j.status === status)
          return (
            <div key={status} style={{ minWidth: 200 }}>
              <div style={{
                background: col.bg, border: `1px solid ${col.border}`,
                borderRadius: 10, padding: '0.75rem', marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot }} />
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>{status}</span>
                <span style={{ marginLeft: 'auto', background: 'white', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', padding: '0.1rem 0.5rem', borderRadius: 999, border: `1px solid ${col.border}` }}>
                  {colJobs.length}
                </span>
              </div>
              <div>
                {colJobs.map(job => (
                  <JobCard key={job._id} job={job} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
                {colJobs.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#d1d5db', fontSize: '0.8rem', padding: '1rem 0' }}>Empty</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Job Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Add New Job Application</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Company <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="input" required placeholder="Google, Swiggy..." value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Role <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="input" required placeholder="Frontend Developer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Status</label>
                  <select className="select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary / Package</label>
                  <input className="input" placeholder="6 LPA, 8-10 LPA..." value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Applied Date</label>
                  <input className="input" type="date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Job Posting Link</label>
                  <input className="input" placeholder="https://..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="textarea" rows={2} placeholder="Referral contact, HR name, interview prep notes..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Plus size={15} /> {saving ? 'Adding...' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
