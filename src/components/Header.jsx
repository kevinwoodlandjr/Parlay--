import { useParlay } from '../hooks/useParlayStore'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { User, Sun, Moon } from 'lucide-react'
import Logo from './Logo'

export default function Header({ onProfileClick, onAuthClick }) {
  const { legs } = useParlay()
  const { user, profile } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <div className="leading-none">
            <h1 className="text-lg font-extrabold text-fg tracking-tight">
              PARLAY<span className="text-accent">.</span>
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {legs.length > 0 && (
            <div className="flex items-center gap-2 bg-accent/15 border border-accent/20 text-accent pl-2 pr-3 py-1 rounded-full text-sm font-semibold">
              <span className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-[11px] font-bold">
                {legs.length}
              </span>
              <span className="text-xs">
                {legs.length === 1 ? 'Pick' : 'Picks'}
              </span>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-overlay hover:bg-overlay-hover border border-border flex items-center justify-center cursor-pointer transition-colors text-fg-muted hover:text-fg"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Profile / Auth button */}
          {user ? (
            <button
              onClick={onProfileClick}
              className="w-8 h-8 bg-gradient-to-br from-accent/80 to-orange-500/80 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-accent/30 transition-all"
              title="Profile"
            >
              <span className="text-white text-xs font-bold">
                {(profile?.full_name || user.email || '?')[0].toUpperCase()}
              </span>
            </button>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-1.5 bg-overlay hover:bg-overlay-hover border border-border text-fg-muted hover:text-fg px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <User size={13} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
