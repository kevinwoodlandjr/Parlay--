import { useState } from 'react'
import { getTeamInfo } from '../data/teams'
import { formatOdds, generateEstimatedOdds } from '../utils/odds'
import { useParlay } from '../hooks/useParlayStore'
import TeamLogo from './TeamLogo'

export default function GameCard({ game }) {
  const { addLeg, legs } = useParlay()

  const homeInfo = getTeamInfo(game.homeTeam.name)
  const awayInfo = getTeamInfo(game.awayTeam.name)

  // Generate estimated odds (seeded by team names for consistency)
  const [odds] = useState(() => {
    const seed = (game.homeTeam.name.length + game.awayTeam.name.length) / 30
    return generateEstimatedOdds(0.5 + (seed - 0.5) * 0.3, 0.5 - (seed - 0.5) * 0.3)
  })

  const isSelected = (gameId, type, pick) => {
    return legs.some(l => l.gameId === gameId && l.type === type && l.pick === pick)
  }

  const pick = (type, side, pickOdds, description) => {
    addLeg({ gameId: game.id, type, pick: side, odds: pickOdds, description, game })
  }

  const fmtLine = (n) => (n > 0 ? `+${n}` : `${n}`)

  return (
    <div className="bg-surface rounded-xl border border-white/[0.06] overflow-hidden max-w-2xl">
      {/* Game time bar */}
      <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between">
        <span className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">
          {game.time || 'TBD'}
        </span>
        <span className="text-[10px] text-white/25 font-medium">
          EST. ODDS
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 px-4 pt-3 pb-1">
        <div /> {/* team column spacer */}
        <div className="text-center text-[10px] text-white/30 font-bold uppercase tracking-wider">Spread</div>
        <div className="text-center text-[10px] text-white/30 font-bold uppercase tracking-wider">Total</div>
        <div className="text-center text-[10px] text-white/30 font-bold uppercase tracking-wider">Money</div>
      </div>

      {/* Away team row */}
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 px-4 py-1.5 items-center">
        <TeamRow info={awayInfo} abbr={game.awayTeam.abbreviation} />

        <OddsCell
          top={fmtLine(odds.spread.away.line)}
          bottom={formatOdds(odds.spread.away.odds)}
          selected={isSelected(game.id, 'spread', 'away')}
          onClick={() => pick(
            'spread', 'away', odds.spread.away.odds,
            `${game.awayTeam.abbreviation} ${fmtLine(odds.spread.away.line)} (${formatOdds(odds.spread.away.odds)})`
          )}
        />
        <OddsCell
          top={`O ${odds.overUnder.total}`}
          bottom={formatOdds(odds.overUnder.over.odds)}
          selected={isSelected(game.id, 'overunder', 'over')}
          onClick={() => pick(
            'overunder', 'over', odds.overUnder.over.odds,
            `Over ${odds.overUnder.total} (${formatOdds(odds.overUnder.over.odds)})`
          )}
        />
        <OddsCell
          top={formatOdds(odds.moneyline.away)}
          selected={isSelected(game.id, 'moneyline', 'away')}
          isMoneyline
          onClick={() => pick(
            'moneyline', 'away', odds.moneyline.away,
            `${game.awayTeam.abbreviation} ML (${formatOdds(odds.moneyline.away)})`
          )}
        />
      </div>

      {/* Home team row */}
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 px-4 pt-1.5 pb-3 items-center">
        <TeamRow info={homeInfo} abbr={game.homeTeam.abbreviation} isHome />

        <OddsCell
          top={fmtLine(odds.spread.home.line)}
          bottom={formatOdds(odds.spread.home.odds)}
          selected={isSelected(game.id, 'spread', 'home')}
          onClick={() => pick(
            'spread', 'home', odds.spread.home.odds,
            `${game.homeTeam.abbreviation} ${fmtLine(odds.spread.home.line)} (${formatOdds(odds.spread.home.odds)})`
          )}
        />
        <OddsCell
          top={`U ${odds.overUnder.total}`}
          bottom={formatOdds(odds.overUnder.under.odds)}
          selected={isSelected(game.id, 'overunder', 'under')}
          onClick={() => pick(
            'overunder', 'under', odds.overUnder.under.odds,
            `Under ${odds.overUnder.total} (${formatOdds(odds.overUnder.under.odds)})`
          )}
        />
        <OddsCell
          top={formatOdds(odds.moneyline.home)}
          selected={isSelected(game.id, 'moneyline', 'home')}
          isMoneyline
          onClick={() => pick(
            'moneyline', 'home', odds.moneyline.home,
            `${game.homeTeam.abbreviation} ML (${formatOdds(odds.moneyline.home)})`
          )}
        />
      </div>
    </div>
  )
}

function TeamRow({ info, abbr, isHome = false }) {
  // Get a clean short name from the full team name
  const shortName = info.name.split(' ').pop()

  return (
    <div className="flex items-center gap-2 min-w-0">
      <TeamLogo src={info.logo} abbr={abbr} size={26} />
      <div className="min-w-0">
        <p className="text-white font-semibold text-[13px] truncate leading-tight">
          {shortName}
        </p>
        <p className="text-white/30 text-[10px] leading-tight">{abbr}</p>
      </div>
    </div>
  )
}

function OddsCell({ top, bottom, selected, onClick, isMoneyline = false }) {
  const isPositive = typeof top === 'string' && top.startsWith('+')

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center rounded-lg py-2 px-1 min-h-[48px] cursor-pointer
        transition-all duration-150 border
        ${selected
          ? 'bg-accent/20 border-accent text-white ring-1 ring-accent/30'
          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12]'
        }
      `}
    >
      <span className={`text-[13px] font-bold leading-tight
        ${selected ? 'text-white' : isMoneyline ? (isPositive ? 'text-green' : 'text-accent') : 'text-white/80'}
      `}>
        {top}
      </span>
      {bottom && (
        <span className={`text-[11px] leading-tight mt-0.5
          ${selected ? 'text-white/70' : isPositive ? 'text-green/60' : 'text-accent/60'}
        `}>
          {bottom}
        </span>
      )}
    </button>
  )
}
