/**
 * Odds calculation utilities for the parlay generator.
 *
 * American odds format:
 * - Positive (+150): Underdog. Bet $100 to win $150.
 * - Negative (-150): Favorite. Bet $150 to win $100.
 */

// Convert American odds to decimal odds
export function americanToDecimal(american) {
  if (american > 0) {
    return (american / 100) + 1
  } else {
    return (100 / Math.abs(american)) + 1
  }
}

// Convert decimal odds to American odds
export function decimalToAmerican(decimal) {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100)
  } else {
    return Math.round(-100 / (decimal - 1))
  }
}

// Convert American odds to implied probability
export function americanToImpliedProbability(american) {
  if (american > 0) {
    return 100 / (american + 100)
  } else {
    return Math.abs(american) / (Math.abs(american) + 100)
  }
}

// Calculate parlay odds from array of American odds
export function calculateParlayOdds(legs) {
  if (legs.length === 0) return 0

  const combinedDecimal = legs.reduce((acc, leg) => {
    return acc * americanToDecimal(leg.odds)
  }, 1)

  return decimalToAmerican(combinedDecimal)
}

// Calculate potential payout
export function calculatePayout(legs, wager) {
  if (legs.length === 0 || wager <= 0) return 0

  const combinedDecimal = legs.reduce((acc, leg) => {
    return acc * americanToDecimal(leg.odds)
  }, 1)

  return Math.round((wager * combinedDecimal) * 100) / 100
}

// Format American odds for display
export function formatOdds(odds) {
  if (odds > 0) return `+${odds}`
  return `${odds}`
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Generate estimated odds based on simple win probability
// This is our "estimated odds" feature - generates realistic-looking odds
export function generateEstimatedOdds(homeWinPct, awayWinPct) {
  // Normalize win percentages
  const homeStrength = homeWinPct || 0.5
  const awayStrength = awayWinPct || 0.5

  // Home court advantage factor
  const homeAdvantage = 0.03

  // Calculate implied probabilities
  const totalStrength = homeStrength + awayStrength
  let homeProb = (homeStrength / totalStrength) + homeAdvantage
  let awayProb = 1 - homeProb

  // Clamp probabilities
  homeProb = Math.max(0.15, Math.min(0.85, homeProb))
  awayProb = 1 - homeProb

  // Add vig (bookmaker's margin ~4.5%)
  const vig = 1.045
  const homeVigProb = homeProb * vig
  const awayVigProb = awayProb * vig

  // Convert to American odds
  const homeOdds = probToAmerican(homeVigProb)
  const awayOdds = probToAmerican(awayVigProb)

  // Generate spread (roughly correlated with moneyline)
  const spread = Math.round((homeProb - 0.5) * 20 * 2) / 2 // half-point increments

  // Generate total (typical NBA game: 210-235)
  const baseTotal = 222.5
  const totalVariance = (Math.random() - 0.5) * 20
  const total = Math.round((baseTotal + totalVariance) * 2) / 2

  return {
    moneyline: { home: homeOdds, away: awayOdds },
    spread: {
      home: { line: -spread, odds: -110 },
      away: { line: spread, odds: -110 },
    },
    overUnder: {
      total,
      over: { odds: -110 },
      under: { odds: -110 },
    },
  }
}

function probToAmerican(prob) {
  if (prob >= 0.5) {
    return Math.round((-prob / (1 - prob)) * 100)
  } else {
    return Math.round(((1 - prob) / prob) * 100)
  }
}
