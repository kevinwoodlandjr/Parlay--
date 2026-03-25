import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Copy, Check, ExternalLink, Image } from 'lucide-react'
import { formatParlayText, copyToClipboard } from '../utils/share'
import { formatOdds } from '../utils/odds'
import ParlayCardExport from './ParlayCardExport'

// Build deep link URLs - some sportsbooks support event-level URLs
function buildDeepLinks(legs) {
  // Extract unique game info from legs
  const games = []
  const seen = new Set()
  for (const leg of legs) {
    const gid = leg.gameId
    if (gid && !seen.has(gid)) {
      seen.add(gid)
      games.push({
        id: gid,
        away: leg.game?.awayTeam?.abbreviation || '',
        home: leg.game?.homeTeam?.abbreviation || '',
        awayFull: leg.game?.awayTeam?.name || '',
        homeFull: leg.game?.homeTeam?.name || '',
      })
    }
  }

  // DraftKings uses event IDs in URL for NBA
  // FanDuel uses team-based search URLs
  // BetMGM and ESPN BET use general NBA pages
  return [
    {
      key: 'fanduel',
      name: 'FanDuel',
      color: '#1493ff',
      url: games.length === 1
        ? `https://sportsbook.fanduel.com/navigation/nba?search=${encodeURIComponent(games[0].away + ' ' + games[0].home)}`
        : 'https://sportsbook.fanduel.com/navigation/nba',
      note: games.length === 1 ? `Opens to ${games[0].away} @ ${games[0].home}` : 'Opens NBA page',
    },
    {
      key: 'draftkings',
      name: 'DraftKings',
      color: '#61b510',
      url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
      note: 'Opens NBA page',
    },
    {
      key: 'betmgm',
      name: 'BetMGM',
      color: '#c4a44a',
      url: 'https://sports.betmgm.com/en/sports/basketball-7/betting/usa-9/nba-6004',
      note: 'Opens NBA page',
    },
    {
      key: 'espnbet',
      name: 'ESPN BET',
      color: '#ff4747',
      url: 'https://espnbet.com/sport/basketball/organization/nba',
      note: 'Opens NBA page',
    },
  ]
}

export default function SportsbookExport({ legs, wager, parlayOdds, potentialPayout, availableBookmakers, onClose }) {
  const [copied, setCopied] = useState(false)
  const [showImageExport, setShowImageExport] = useState(false)

  const parlayText = formatParlayText(legs, wager, parlayOdds, potentialPayout)
  const deepLinks = buildDeepLinks(legs)

  const hasBookmakerData = availableBookmakers && availableBookmakers.length > 0
  const booksToShow = hasBookmakerData
    ? deepLinks.filter(sb => availableBookmakers.includes(sb.key))
    : deepLinks

  const handleCopy = async () => {
    await copyToClipboard(parlayText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
          <h3 className="text-fg font-bold text-base">Export Parlay</h3>
          <button onClick={onClose} className="text-fg-subtle hover:text-fg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Parlay summary */}
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

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm
                ${copied
                  ? 'bg-green/20 text-green border border-green/30'
                  : 'bg-overlay hover:bg-overlay-hover text-fg-muted border border-border'
                }`}
            >
              {copied ? (
                <><Check size={15} /> Copied!</>
              ) : (
                <><Copy size={15} /> Copy Text</>
              )}
            </button>
            <button
              onClick={() => setShowImageExport(true)}
              className="flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20"
            >
              <Image size={15} />
              Save Image
            </button>
          </div>

          {/* Sportsbook deep links */}
          <div>
            <p className="text-fg-subtle text-xs font-semibold uppercase tracking-wider mb-3">
              Place on Sportsbook
            </p>
            <div className="space-y-2">
              {booksToShow.map((book) => (
                <a
                  key={book.key}
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-overlay border border-border hover:bg-overlay-hover hover:border-border-hover transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: book.color }}>
                      {book.name}
                    </span>
                    <span className="text-fg-subtle text-[10px]">{book.note}</span>
                  </div>
                  <ExternalLink size={14} className="text-fg-subtle group-hover:text-fg transition-colors" />
                </a>
              ))}
            </div>

            {/* Step-by-step instructions */}
            <div className="mt-4 bg-overlay rounded-xl border border-border p-4">
              <p className="text-fg-muted text-xs font-semibold mb-2">How to place this parlay:</p>
              <ol className="text-fg-subtle text-[11px] space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Copy your parlay details above</li>
                <li>Open your preferred sportsbook</li>
                <li>Find each game and add the same bets to your bet slip</li>
                <li>Enter your wager amount and confirm</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-fg-subtle text-[10px] font-medium">Your picks to replicate:</p>
                {legs.map((leg, i) => (
                  <p key={leg.id} className="text-fg text-[11px] mt-1">
                    <span className="text-accent font-semibold">{i + 1}.</span>{' '}
                    {leg.game?.awayTeam?.abbreviation} @ {leg.game?.homeTeam?.abbreviation} → <span className="font-semibold">{leg.description}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageExport && (
        <ParlayCardExport
          legs={legs}
          wager={wager}
          parlayOdds={parlayOdds}
          potentialPayout={potentialPayout}
          onClose={() => setShowImageExport(false)}
        />
      )}
    </div>,
    document.body
  )
}
