/**
 * Shareable link utilities.
 * Encodes parlay data into a URL parameter so it can be shared without a database.
 */

// Encode parlay data to a URL-safe string
export function encodeParlayToUrl(legs, wager) {
  const data = {
    l: legs.map(leg => ({
      g: leg.gameId,
      t: leg.type,
      p: leg.pick,
      o: leg.odds,
      d: leg.description,
      h: leg.game?.homeTeam?.abbreviation || '',
      a: leg.game?.awayTeam?.abbreviation || '',
    })),
    w: wager,
  }

  const encoded = btoa(JSON.stringify(data))
  return encoded
}

// Decode parlay data from URL parameter
export function decodeParlayFromUrl(encoded) {
  try {
    const data = JSON.parse(atob(encoded))
    const legs = data.l.map((leg, i) => ({
      id: `shared-${i}`,
      gameId: leg.g,
      type: leg.t,
      pick: leg.p,
      odds: leg.o,
      description: leg.d,
      game: {
        homeTeam: { abbreviation: leg.h },
        awayTeam: { abbreviation: leg.a },
      },
    }))
    return { legs, wager: data.w || 10 }
  } catch (err) {
    console.error('Failed to decode parlay:', err)
    return null
  }
}

// Generate the full shareable URL
export function generateShareUrl(legs, wager) {
  const encoded = encodeParlayToUrl(legs, wager)
  const url = new URL(window.location.origin + window.location.pathname)
  url.searchParams.set('parlay', encoded)
  return url.toString()
}

// Format parlay as readable text for clipboard
export function formatParlayText(legs, wager, parlayOdds, potentialPayout) {
  const lines = [
    `PARLAY (${legs.length} Legs) | ${parlayOdds > 0 ? '+' : ''}${parlayOdds}`,
    '─'.repeat(30),
  ]

  legs.forEach(leg => {
    const matchup = leg.game
      ? `${leg.game.awayTeam?.abbreviation} @ ${leg.game.homeTeam?.abbreviation}`
      : ''
    lines.push(`${leg.description} | ${matchup}`)
  })

  lines.push('─'.repeat(30))
  lines.push(`Wager: $${wager.toFixed(2)} | Payout: $${potentialPayout.toFixed(2)}`)
  lines.push('')
  lines.push('Built with PARLAY.')

  return lines.join('\n')
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}
