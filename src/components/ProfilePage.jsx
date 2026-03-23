import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getUserParlays, updateParlayStatus, deleteParlay } from '../lib/parlayService'
import { formatOdds, formatCurrency, calculateParlayOdds, calculatePayout } from '../utils/odds'
import { ArrowLeft, Bookmark, CheckCircle, XCircle, Trash2, LogOut, User, Clock, Trophy, TrendingDown } from 'lucide-react'

const STATUS_CONFIG = {
  saved: { label: 'Saved', icon: Bookmark, color: 'text-fg-muted', bg: 'bg-overlay' },
  placed: { label: 'Placed', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  won: { label: 'Won', icon: Trophy, color: 'text-green', bg: 'bg-green/10' },
  lost: { label: 'Lost', icon: TrendingDown, color: 'text-accent', bg: 'bg-accent/10' },
}

export default function ProfilePage({ onBack }) {
  const { user, profile, signOut } = useAuth()
  const [parlays, setParlays] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) loadParlays()
  }, [user])

  async function loadParlays() {
    setLoading(true)
    const { data } = await getUserParlays(user.id)
    setParlays(data)
    setLoading(false)
  }

  async function handleStatusChange(parlayId, newStatus) {
    await updateParlayStatus(parlayId, newStatus)
    setParlays(prev =>
      prev.map(p => p.id === parlayId ? { ...p, status: newStatus } : p)
    )
  }

  async function handleDelete(parlayId) {
    await deleteParlay(parlayId)
    setParlays(prev => prev.filter(p => p.id !== parlayId))
  }

  const filteredParlays = filter === 'all'
    ? parlays
    : parlays.filter(p => p.status === filter)

  const stats = {
    total: parlays.length,
    placed: parlays.filter(p => p.status === 'placed').length,
    won: parlays.filter(p => p.status === 'won').length,
    lost: parlays.filter(p => p.status === 'lost').length,
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-fg-muted hover:text-fg transition-colors cursor-pointer text-sm"
          >
            <ArrowLeft size={16} />
            Games
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-fg-subtle hover:text-accent transition-colors cursor-pointer text-sm"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-surface rounded-xl border border-border p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-fg font-bold text-lg">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-fg-subtle text-sm">{user?.email}</p>
              {profile?.phone && (
                <p className="text-fg-subtle text-xs mt-0.5">{profile.phone}</p>
              )}
            </div>
          </div>

          {parlays.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-border">
              <StatBox label="Parlays" value={stats.total} />
              <StatBox label="Placed" value={stats.placed} color="text-yellow-400" />
              <StatBox label="Won" value={stats.won} color="text-green" />
              <StatBox label="Lost" value={stats.lost} color="text-accent" />
            </div>
          )}
        </div>

        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {['all', 'saved', 'placed', 'won', 'lost'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors shrink-0
                ${filter === f
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-overlay text-fg-subtle border border-transparent hover:bg-overlay-hover'
                }`}
            >
              {f === 'all' ? `All (${parlays.length})` : `${f} (${parlays.filter(p => p.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-fg-subtle text-sm">Loading your parlays...</div>
        ) : filteredParlays.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-overlay rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Bookmark size={24} className="text-fg-subtle" />
            </div>
            <p className="text-fg-muted font-medium">
              {filter === 'all' ? 'No saved parlays yet' : `No ${filter} parlays`}
            </p>
            <p className="text-fg-subtle text-sm mt-1">
              {filter === 'all' ? 'Build a parlay and tap "Save" to track it here' : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredParlays.map(parlay => (
              <ParlayCard
                key={parlay.id}
                parlay={parlay}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, color = 'text-fg' }) {
  return (
    <div className="text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-fg-subtle text-[10px] font-semibold uppercase tracking-wider">{label}</p>
    </div>
  )
}

function ParlayCard({ parlay, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const config = STATUS_CONFIG[parlay.status] || STATUS_CONFIG.saved
  const StatusIcon = config.icon

  const date = new Date(parlay.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const legCount = parlay.legs?.length || 0

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-overlay transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
            <StatusIcon size={16} className={config.color} />
          </div>
          <div className="text-left min-w-0">
            <p className="text-fg font-semibold text-sm">{legCount}-Leg Parlay</p>
            <p className="text-fg-subtle text-xs">{date}</p>
          </div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-accent font-bold text-sm">{formatOdds(parlay.parlay_odds)}</p>
          <p className="text-green text-xs font-semibold">{formatCurrency(parlay.potential_payout)}</p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="divide-y divide-border">
            {parlay.legs?.map((leg, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-fg text-[13px] font-medium truncate">{leg.description}</p>
                  <p className="text-fg-subtle text-[11px]">{leg.awayAbbr} @ {leg.homeAbbr}</p>
                </div>
                <span className="text-accent text-[13px] font-bold shrink-0 ml-2">
                  {formatOdds(leg.odds)}
                </span>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-fg-subtle">Wager</span>
            <span className="text-fg font-semibold">{formatCurrency(parlay.wager)}</span>
          </div>

          <div className="px-4 py-3 border-t border-border flex items-center gap-2">
            {parlay.status === 'saved' && (
              <button
                onClick={() => onStatusChange(parlay.id, 'placed')}
                className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-yellow-400/20 transition-colors"
              >
                <CheckCircle size={14} />
                Mark as Placed
              </button>
            )}
            {parlay.status === 'placed' && (
              <>
                <button
                  onClick={() => onStatusChange(parlay.id, 'won')}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green/10 text-green border border-green/20 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-green/20 transition-colors"
                >
                  <Trophy size={14} />
                  Won
                </button>
                <button
                  onClick={() => onStatusChange(parlay.id, 'lost')}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-accent/10 text-accent border border-accent/20 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-accent/20 transition-colors"
                >
                  <XCircle size={14} />
                  Lost
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(parlay.id)}
              className="p-2 text-fg-subtle hover:text-accent transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
