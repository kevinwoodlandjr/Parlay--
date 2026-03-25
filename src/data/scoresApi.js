/**
 * Fetches completed NBA game scores from The Odds API.
 * Used by the auto-result tracker to determine parlay outcomes.
 */

const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

// Cache to avoid burning API requests
let scoresCache = { data: null, timestamp: 0 }
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

/**
 * Fetch completed NBA game scores from the last 3 days.
 * Returns an array of completed game objects with scores.
 *
 * Each returned game has:
 *   { id, home_team, away_team, scores: [{ name, score }], completed }
 */
export async function fetchCompletedScores() {
  if (!ODDS_API_KEY) {
    throw new Error('No Odds API key configured')
  }

  // Return cached data if fresh
  if (scoresCache.data && Date.now() - scoresCache.timestamp < CACHE_DURATION) {
    return scoresCache.data
  }

  const url = new URL(`${ODDS_API_BASE}/sports/basketball_nba/scores`)
  url.searchParams.set('apiKey', ODDS_API_KEY)
  url.searchParams.set('daysFrom', '3')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Scores API error: ${response.status}`)
  }

  // Log remaining requests for awareness
  const remaining = response.headers.get('x-requests-remaining')
  const used = response.headers.get('x-requests-used')
  if (remaining) {
    console.log(`Scores API: ${used} used, ${remaining} remaining`)
  }

  const data = await response.json()

  // Filter to only completed games
  const completed = data.filter(game => game.completed)

  scoresCache = { data: completed, timestamp: Date.now() }
  return completed
}
