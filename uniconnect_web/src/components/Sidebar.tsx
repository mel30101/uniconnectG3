import { NavLink } from 'react-router-dom'
import { Home, Users, MessageCircle, User, Search, Calendar, GraduationCap, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/profile', label: 'Profile', icon: User, end: false },
  { to: '/search', label: 'Search', icon: Search, end: false },
  { to: '/groups', label: 'Groups', icon: Users, end: false },
  { to: '/chat', label: 'Chat', icon: MessageCircle, end: false },
  { to: '/academic/careers', label: 'Academic', icon: GraduationCap, end: false },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 md:z-0
          w-64 h-screen md:h-auto
          bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Close button (mobile only) */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={onClose} className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
