import { useState, useEffect } from 'react'

const BOOKMAKERS = [
  { key: 'fanduel', name: 'FanDuel', color: '#1493ff' },
  { key: 'draftkings', name: 'DraftKings', color: '#61b510' },
  { key: 'betmgm', name: 'BetMGM', color: '#c4a44a' },
  { key: 'caesars', name: 'Caesars', color: '#1a4731' },
  { key: 'espnbet', name: 'ESPN BET', color: '#ff4747' },
]

const STORAGE_KEY = 'slipmate_bookmaker'

export default function BookmakerSelector({ availableBookmakers = [], selected, onSelect }) {
  // Filter to only show bookmakers that have odds for at least one game
  const available = BOOKMAKERS.filter(b => availableBookmakers.includes(b.key))

  if (available.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      <span className="text-fg-subtle text-[10px] font-semibold uppercase tracking-wider shrink-0 mr-1">
        Odds from
      </span>
      {available.map(book => {
        const isActive = selected === book.key
        return (
          <button
            key={book.key}
            onClick={() => onSelect(book.key)}
            className={`
              shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border
              ${isActive
                ? 'border-accent/40 bg-accent/15 text-accent'
                : 'border-border bg-overlay hover:bg-overlay-hover text-fg-muted hover:text-fg'
              }
            `}
          >
            {book.name}
          </button>
        )
      })}
    </div>
  )
}

// Helper to persist bookmaker preference
export function getSavedBookmaker() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'fanduel'
  } catch {
    return 'fanduel'
  }
}

export function saveBookmaker(key) {
  try {
    localStorage.setItem(STORAGE_KEY, key)
  } catch {}
}
