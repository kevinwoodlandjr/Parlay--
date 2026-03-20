import { useParlay } from '../hooks/useParlayStore'
import { useAuth } from '../hooks/useAuth'
import { Zap, User } from 'lucide-react'

export default function Header({ onProfileClick, onAuthClick }) {
  const { legs } = useParlay()
  const { user, profile } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d1a]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-orange-500 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div className="leading-none">
            <h1 className="text-lg font-extrabold text-white tracking-tight">
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
              className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
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
