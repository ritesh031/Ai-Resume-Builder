import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, Briefcase, Sparkles, LogOut } from 'lucide-react'

const links = [
  { to: '/',         label: 'Dashboard',   icon: <LayoutDashboard size={15} /> },
  { to: '/resume',   label: 'Resume',      icon: <FileText size={15} /> },
  { to: '/jobs',     label: 'Job Tracker', icon: <Briefcase size={15} /> },
  { to: '/tailored', label: 'AI Versions', icon: <Sparkles size={15} /> },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      background: 'white', borderBottom: '1px solid #e5e7eb',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58
      }}>
        {/* Logo */}
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.05rem', color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={20} /> AI Resume Builder
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map(l => {
            const active = location.pathname === l.to
            return (
              <Link key={l.to} to={l.to} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '0.38rem 0.85rem', borderRadius: 8,
                fontSize: '0.875rem', fontWeight: active ? 600 : 400,
                textDecoration: 'none',
                background: active ? '#eef2ff' : 'transparent',
                color: active ? '#4f46e5' : '#6b7280',
                transition: 'all 0.15s'
              }}>
                {l.icon} {l.label}
              </Link>
            )
          })}
        </div>

        {/* User + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Hi, <b style={{ color: '#374151' }}>{user?.name?.split(' ')[0]}</b>
          </span>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
