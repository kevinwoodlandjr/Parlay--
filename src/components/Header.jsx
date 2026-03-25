import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useParlay } from '../hooks/useParlayStore'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { User, Sun, Moon } from 'lucide-react'
import Logo from './Logo'

export default function Header({ onProfileClick, onAuthClick, onHomeClick }) {
  const { legs } = useParlay()
  const { user, profile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleBrandClick = () => {
    setShowConfirm(true)
  }

  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand — clickable */}
        <button
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Logo size={32} />
          <div className="leading-none">
            <h1 className="text-lg font-extrabold text-fg tracking-tight">
              Slip<span className="text-accent">Mate</span>
            </h1>
          </div>
        </button>

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
              className="w-8 h-8 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-accent/30 transition-all"
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

      {/* Confirmation dialog */}
      {showConfirm && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-surface border border-border rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-overlay rounded-xl flex items-center justify-center mx-auto mb-4">
                <Logo size={28} />
              </div>
              <h3 className="text-fg font-bold text-base">Proceed to home?</h3>
              <p className="text-fg-muted text-sm mt-2">You'll leave the parlay builder and return to the home page.</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-accent hover:bg-accent-hover text-white font-semibold py-2.5 rounded-xl cursor-pointer transition-colors text-sm"
                >
                  Yes, Stay
                </button>
                <button
                  onClick={() => { setShowConfirm(false); onHomeClick?.() }}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-semibold py-2.5 rounded-xl cursor-pointer transition-colors text-sm"
                >
                  No, Leave
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}
