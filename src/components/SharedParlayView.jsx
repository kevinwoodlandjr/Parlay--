import { useEffect, useState } from 'react'
import { useParlay } from '../hooks/useParlayStore'
import { decodeParlayFromUrl } from '../utils/share'
import { formatOdds, formatCurrency, calculateParlayOdds, calculatePayout } from '../utils/odds'

export default function SharedParlayView({ encoded, onDismiss }) {
  const [parlayData, setParlayData] = useState(null)

  useEffect(() => {
    const data = decodeParlayFromUrl(encoded)
    if (data) setParlayData(data)
  }, [encoded])

  if (!parlayData) return null

  const parlayOdds = calculateParlayOdds(parlayData.legs)
  const potentialPayout = calculatePayout(parlayData.legs, parlayData.wager)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl border border-white/10 max-w-md w-full overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Shared Parlay</p>
          <h2 className="text-white font-bold text-lg mt-1">
            {parlayData.legs.length}-Leg Parlay
          </h2>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {parlayData.legs.map((leg, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{leg.description}</p>
                <p className="text-white/30 text-xs mt-0.5">
                  {leg.game?.awayTeam?.abbreviation} @ {leg.game?.homeTeam?.abbreviation}
                </p>
              </div>
              <span className="text-accent font-bold text-sm">{formatOdds(leg.odds)}</span>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-white/[0.06] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Wager</span>
            <span className="text-white font-semibold">{formatCurrency(parlayData.wager)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Parlay Odds</span>
            <span className="text-accent font-bold">{formatOdds(parlayOdds)}</span>
          </div>
          <div className="flex justify-between bg-green/10 rounded-lg px-3 py-2 mt-2">
            <span className="text-white/50 text-sm">Potential Payout</span>
            <span className="text-green font-bold">{formatCurrency(potentialPayout)}</span>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onDismiss}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
          >
            Build My Own Parlay
          </button>
        </div>
      </div>
    </div>
  )
}
