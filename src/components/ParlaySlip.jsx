import { useState } from 'react'
import { X, Trash2, Share2, Check, Edit3, Bookmark, ExternalLink, Sparkles } from 'lucide-react'
import { useParlay } from '../hooks/useParlayStore'
import { useAuth } from '../hooks/useAuth'
import { formatOdds, formatCurrency } from '../utils/odds'
import { generateShareUrl, copyToClipboard } from '../utils/share'
import { saveParlay } from '../lib/parlayService'
import { getTeamLogo } from '../data/teams'
import TeamLogo from './TeamLogo'
import SportsbookExport from './SportsbookExport'
import AIAdvisor from './AIAdvisor'

export default function ParlaySlip({ onAuthRequired }) {
  const { legs, wager, parlayOdds, potentialPayout, removeLeg, updateLegOdds, clearLegs, setWager } = useParlay()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingOdds, setEditingOdds] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [showAI, setShowAI] = useState(false)

  if (legs.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-overlay rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-fg-muted font-semibold text-sm">Build Your Parlay</p>
          <p className="text-fg-subtle text-xs mt-1.5 leading-relaxed">
            Tap odds from the games to<br />add legs to your slip
          </p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    if (!user) {
      if (onAuthRequired) onAuthRequired()
      return
    }
    setSaving(true)
    const { error } = await saveParlay(user.id, { legs, wager, parlayOdds, potentialPayout })
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  const handleShare = async () => {
    const url = generateShareUrl(legs, wager)
    await copyToClipboard(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleOddsEdit = (legId, currentOdds) => {
    setEditingOdds(legId)
    setEditValue(currentOdds.toString())
  }

  const handleOddsSave = (legId) => {
    const newOdds = parseInt(editValue)
    if (!isNaN(newOdds) && newOdds !== 0) {
      updateLegOdds(legId, newOdds)
    }
    setEditingOdds(null)
  }

  const profit = potentialPayout - wager

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Slip header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-overlay">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <h3 className="text-fg font-bold text-sm">Parlay Slip</h3>
          <span className="text-fg-subtle text-xs">• {legs.length} {legs.length === 1 ? 'leg' : 'legs'}</span>
        </div>
        <button
          onClick={clearLegs}
          className="text-fg-subtle hover:text-accent transition-colors p-1 cursor-pointer"
          title="Clear all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Legs */}
      <div className="divide-y divide-border">
        {legs.map((leg) => {
          const awayAbbr = leg.game?.awayTeam?.abbreviation
          const homeAbbr = leg.game?.homeTeam?.abbreviation

          return (
            <div key={leg.id} className="px-4 py-3 flex items-start justify-between gap-2 group">
              <div className="min-w-0 flex-1">
                <p className="text-fg text-[13px] font-semibold truncate leading-tight">
                  {leg.description}
                </p>
                <p className="text-fg-subtle text-[11px] mt-1 flex items-center gap-1">
                  {awayAbbr} @ {homeAbbr}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {editingOdds === leg.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleOddsSave(leg.id)
                        if (e.key === 'Escape') setEditingOdds(null)
                      }}
                      className="w-16 bg-overlay-hover text-fg text-xs px-2 py-1 rounded border border-border-hover outline-none focus:border-accent"
                      autoFocus
                    />
                    <button
                      onClick={() => handleOddsSave(leg.id)}
                      className="text-green p-0.5 cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOddsEdit(leg.id, leg.odds)}
                    className="text-accent text-[13px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Click to edit odds"
                  >
                    {formatOdds(leg.odds)}
                    <Edit3 size={9} className="text-fg-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
                <button
                  onClick={() => removeLeg(leg.id)}
                  className="text-fg-subtle hover:text-accent transition-colors p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Wager + Payout */}
      <div className="px-4 py-4 border-t border-border space-y-3">
        {/* Wager input */}
        <div className="flex items-center justify-between">
          <label className="text-fg-muted text-sm font-medium">Wager</label>
          <div className="flex items-center gap-1 bg-overlay rounded-lg px-3 py-1.5 border border-border focus-within:border-accent/40 transition-colors">
            <span className="text-fg-subtle text-sm">$</span>
            <input
              type="number"
              value={wager}
              onChange={(e) => setWager(Number(e.target.value))}
              className="bg-transparent text-fg text-sm font-semibold w-20 outline-none text-right"
              min="1"
              step="5"
            />
          </div>
        </div>

        {/* Quick wager buttons */}
        <div className="flex gap-1.5">
          {[5, 10, 25, 50, 100].map(amount => (
            <button
              key={amount}
              onClick={() => setWager(amount)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer
                ${wager === amount
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'bg-overlay text-fg-subtle border border-transparent hover:bg-overlay-hover hover:text-fg-muted'
                }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-3 space-y-2">
          {/* Combined odds */}
          <div className="flex items-center justify-between">
            <span className="text-fg-muted text-sm">Parlay Odds</span>
            <span className="text-accent font-bold text-lg tracking-tight">{formatOdds(parlayOdds)}</span>
          </div>

          {/* Potential payout */}
          <div className="bg-gradient-to-r from-green/[0.08] to-accent/[0.05] rounded-lg px-4 py-3 border border-green/10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-fg-subtle text-[10px] font-semibold uppercase tracking-wider">Payout</p>
                <p className="text-green font-bold text-xl tracking-tight">{formatCurrency(potentialPayout)}</p>
              </div>
              <div className="text-right">
                <p className="text-fg-subtle text-[10px] font-semibold uppercase tracking-wider">Profit</p>
                <p className="text-green font-semibold text-sm">{formatCurrency(profit)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-all cursor-pointer text-sm
              ${copied
                ? 'bg-green/20 text-green border border-green/30'
                : 'bg-overlay hover:bg-overlay-hover text-fg-muted border border-border'
              }`}
          >
            {copied ? (
              <><Check size={15} /> Copied!</>
            ) : (
              <><Share2 size={15} /> Share</>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-all cursor-pointer text-sm
              ${saved
                ? 'bg-green/20 text-green border border-green/30'
                : 'bg-accent hover:bg-accent-hover text-white disabled:opacity-50'
              }`}
          >
            {saved ? (
              <><Check size={15} /> Saved!</>
            ) : (
              <><Bookmark size={15} /> {user ? 'Save' : 'Sign In to Save'}</>
            )}
          </button>
        </div>

        {/* AI + Export buttons */}
        <div className="flex gap-2">
          {legs.length >= 2 && (
            <button
              onClick={() => setShowAI(true)}
              className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-all cursor-pointer text-sm bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20"
            >
              <Sparkles size={15} />
              AI Analyze
            </button>
          )}
          <button
            onClick={() => setShowExport(true)}
            className={`${legs.length >= 2 ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 font-semibold py-3 rounded-lg transition-all cursor-pointer text-sm bg-overlay hover:bg-overlay-hover text-fg-muted hover:text-fg border border-border`}
          >
            <ExternalLink size={15} />
            Export
          </button>
        </div>
      </div>

      {/* AI advisor modal */}
      {showAI && (
        <AIAdvisor
          legs={legs}
          wager={wager}
          parlayOdds={parlayOdds}
          onClose={() => setShowAI(false)}
        />
      )}

      {/* Sportsbook export modal */}
      {showExport && (
        <SportsbookExport
          legs={legs}
          wager={wager}
          parlayOdds={parlayOdds}
          potentialPayout={potentialPayout}
          availableBookmakers={[...new Set(legs.flatMap(l => l.game?.availableBookmakers || []))]}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
