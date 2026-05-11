import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@uniconnect/shared'
import { LogOut, ChevronDown, Moon, Sun } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import NotificationsDropdown from './NotificationsDropdown'
import { useTheme } from '../hooks/useTheme'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/search', label: 'Buscar', end: false },
  { to: '/groups', label: 'Grupos', end: false },
  { to: '/events', label: 'Eventos', end: false },
  { to: '/chat', label: 'Chats', end: false },
]

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#002344] h-14 flex items-center px-4 sm:px-6 lg:px-8 shadow-md">
      {/* Logo */}
      <span
        className="text-white font-bold text-lg mr-8 cursor-pointer flex-shrink-0"
        onClick={() => navigate('/')}
      >
        UniConnect G3
      </span>

      {/* Nav items */}
      <nav className="flex items-center gap-1 flex-1">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `px-3 py-1.5 text-sm font-medium transition-colors rounded ${
                isActive
                  ? 'text-[#b39055] border-b-2 border-[#b39055]'
                  : 'text-white/80 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-1.5 text-white/70 hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {isAuthenticated ? (
          <>
            <NotificationsDropdown />
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
              >
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user?.name || user?.displayName || 'Perfil'}
                </span>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1">
                  <NavLink
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#F4F6F8] dark:hover:bg-slate-700"
                  >
                    Mi Perfil
                  </NavLink>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[#F4F6F8] dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <NavLink
            to="/login"
            className="text-sm text-[#b39055] hover:text-white font-medium transition-colors"
          >
            Iniciar sesión
          </NavLink>
        )}
      </div>
    </header>
  )
}
