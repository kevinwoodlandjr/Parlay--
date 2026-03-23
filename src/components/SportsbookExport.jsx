import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Copy, Check, ExternalLink } from 'lucide-react'
import { formatParlayText, copyToClipboard } from '../utils/share'
import { formatOdds } from '../utils/odds'

const SPORTSBOOKS = [
  { key: 'fanduel', name: 'FanDuel', url: 'https://sportsbook.fanduel.com/navigation/nba', color: '#1493ff' },
  { key: 'draftkings', name: 'DraftKings', url: 'https://sportsbook.draftkings.com/leagues/basketball/nba', color: '#61b510' },
  { key: 'betmgm', name: 'BetMGM', url: 'https://sports.betmgm.com/en/sports/basketball-7/betting/usa-9/nba-6004', color: '#c4a44a' },
  { key: 'espnbet', name: 'ESPN BET', url: 'https://espnbet.com/sport/basketball/organization/nba', color: '#ff4747' },
]

export default function SportsbookExport({ legs, wager, parlayOdds, potentialPayout, availableBookmakers, onClose }) {
  const [copied, setCopied] = useState(false)

  const parlayText = formatParlayText(legs, wager, parlayOdds, potentialPayout)

  const handleCopy = async () => {
    await copyToClipboard(parlayText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const hasBookmakerData = availableBookmakers && availableBookmakers.length > 0
  const booksToShow = hasBookmakerData
    ? SPORTSBOOKS.filter(sb => availableBookmakers.includes(sb.key))
    : SPORTSBOOKS

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-fg font-bold text-base">Export Parlay</h3>
          <button onClick={onClose} className="text-fg-subtle hover:text-fg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-overlay rounded-xl border border-border p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-fg-muted text-xs font-semibold uppercase tracking-wider">
                {legs.length}-Leg Parlay
              </span>
              <span className="text-accent font-bold text-sm">{formatOdds(parlayOdds)}</span>
            </div>
            {legs.map((leg) => (
              <div key={leg.id} className="flex items-center justify-between py-1.5">
                <span className="text-fg text-xs truncate flex-1 mr-3">{leg.description}</span>
                <span className="text-fg-muted text-[11px] shrink-0">
                  {leg.game?.awayTeam?.abbreviation} @ {leg.game?.homeTeam?.abbreviation}
                </span>
              </div>
            ))}
            <div className="border-t border-border mt-2 pt-2 flex items-center justify-between">
              <span className="text-fg-muted text-xs">Wager ${wager} → <span className="text-green font-semibold">${potentialPayout.toFixed(2)}</span></span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm
              ${copied
                ? 'bg-green/20 text-green border border-green/30'
                : 'bg-overlay hover:bg-overlay-hover text-fg-muted border border-border'
              }`}
          >
            {copied ? (
              <><Check size={16} /> Copied to Clipboard!</>
            ) : (
              <><Copy size={16} /> Copy Parlay Details</>
            )}
          </button>

          <div>
            <p className="text-fg-subtle text-xs font-semibold uppercase tracking-wider mb-3">
              Open Sportsbook
            </p>
            <div className="grid grid-cols-2 gap-2">
              {booksToShow.map((book) => (
                <a
                  key={book.key}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-overlay border border-border hover:bg-overlay-hover hover:border-border-hover transition-all text-sm font-medium"
                  style={{ color: book.color }}
                >
                  {book.name}
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              ))}
            </div>
            <p className="text-fg-subtle text-[10px] mt-3 text-center leading-relaxed">
              Copy your parlay details above, then place your bets manually on your preferred sportsbook
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
