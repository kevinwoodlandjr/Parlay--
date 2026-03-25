/**
 * Checks parlay results against completed game scores.
 *
 * Takes a parlay's legs and completed scores from The Odds API,
 * and determines if each leg hit and whether the parlay as a whole won.
 */

// Map full team names to abbreviations (same as nbaApi.js)
const TEAM_ABBR_MAP = {
  'Atlanta Hawks': 'ATL', 'Boston Celtics': 'BOS', 'Brooklyn Nets': 'BKN',
  'Charlotte Hornets': 'CHA', 'Chicago Bulls': 'CHI', 'Cleveland Cavaliers': 'CLE',
  'Dallas Mavericks': 'DAL', 'Denver Nuggets': 'DEN', 'Detroit Pistons': 'DET',
  'Golden State Warriors': 'GSW', 'Houston Rockets': 'HOU', 'Indiana Pacers': 'IND',
  'Los Angeles Clippers': 'LAC', 'Los Angeles Lakers': 'LAL', 'Memphis Grizzlies': 'MEM',
  'Miami Heat': 'MIA', 'Milwaukee Bucks': 'MIL', 'Minnesota Timberwolves': 'MIN',
  'New Orleans Pelicans': 'NOP', 'New York Knicks': 'NYK', 'Oklahoma City Thunder': 'OKC',
  'Orlando Magic': 'ORL', 'Philadelphia 76ers': 'PHI', 'Phoenix Suns': 'PHX',
  'Portland Trail Blazers': 'POR', 'Sacramento Kings': 'SAC', 'San Antonio Spurs': 'SAS',
  'Toronto Raptors': 'TOR', 'Utah Jazz': 'UTA', 'Washington Wizards': 'WAS',
}

// Reverse map: abbreviation -> full name
const ABBR_TO_TEAM = Object.fromEntries(
  Object.entries(TEAM_ABBR_MAP).map(([name, abbr]) => [abbr, name])
)

/**
 * Find the matching completed game for a leg.
 * Matches by gameId (the Odds API event ID).
 */
function findGameScore(leg, completedScores) {
  return completedScores.find(game => game.id === leg.gameId)
}

/**
 * Extract numeric scores from a completed game.
 * The Odds API scores array: [{ name: "Team Name", score: "110" }, ...]
 */
function getScores(game) {
  const homeEntry = game.scores?.find(s => s.name === game.home_team)
  const awayEntry = game.scores?.find(s => s.name === game.away_team)
  return {
    homeScore: parseInt(homeEntry?.score, 10) || 0,
    awayScore: parseInt(awayEntry?.score, 10) || 0,
    homeTeam: game.home_team,
    awayTeam: game.away_team,
  }
}

/**
 * Resolve the picked team's full name from the leg.
 * The leg.pick can be a full name or abbreviation.
 */
function resolveTeamName(pick) {
  // If it's already a full name in our map, return it
  if (TEAM_ABBR_MAP[pick]) return pick
  // If it's an abbreviation, look it up
  if (ABBR_TO_TEAM[pick]) return ABBR_TO_TEAM[pick]
  // Fallback: return as-is
  return pick
}

/**
 * Check a moneyline leg: did the picked team win?
 */
function checkMoneyline(leg, gameScores) {
  const pickedTeam = resolveTeamName(leg.pick)
  const { homeScore, awayScore, homeTeam, awayTeam } = gameScores

  if (pickedTeam === homeTeam) {
    return homeScore > awayScore
  } else if (pickedTeam === awayTeam) {
    return awayScore > homeScore
  }
  return false
}

/**
 * Check a spread leg: did the picked team cover?
 *
 * The spread value is stored in the description, e.g. "LAL -4.5" or "BOS +3.5".
 * We parse the spread from the description.
 */
function checkSpread(leg, gameScores) {
  const pickedTeam = resolveTeamName(leg.pick)
  const { homeScore, awayScore, homeTeam, awayTeam } = gameScores

  // Parse the spread from the description (e.g., "LAL -4.5", "BOS +3.5")
  const spreadMatch = leg.description?.match(/([+-]?\d+\.?\d*)/)
  const spread = spreadMatch ? parseFloat(spreadMatch[1]) : 0

  if (pickedTeam === homeTeam) {
    // Picked team is home: homeScore + spread > awayScore
    return (homeScore + spread) > awayScore
  } else if (pickedTeam === awayTeam) {
    // Picked team is away: awayScore + spread > homeScore
    return (awayScore + spread) > homeScore
  }
  return false
}

/**
 * Check an over/under leg: was the total over or under?
 *
 * The total line is in the description, e.g. "Over 220.5" or "Under 215.0".
 */
function checkOverUnder(leg, gameScores) {
  const { homeScore, awayScore } = gameScores
  const totalScore = homeScore + awayScore

  // Parse the total from the description
  const totalMatch = leg.description?.match(/(\d+\.?\d*)/)
  const totalLine = totalMatch ? parseFloat(totalMatch[1]) : 0

  if (leg.pick === 'Over') {
    return totalScore > totalLine
  } else if (leg.pick === 'Under') {
    return totalScore < totalLine
  }
  return false
}

/**
 * Check a single leg against its game score.
 * Returns { hit: boolean, score: string } or null if the game hasn't completed.
 */
function checkLeg(leg, completedScores) {
  const game = findGameScore(leg, completedScores)
  if (!game) {
    return null // Game not yet completed
  }

  const gameScores = getScores(game)
  const { homeScore, awayScore } = gameScores
  const homeAbbr = TEAM_ABBR_MAP[game.home_team] || '???'
  const awayAbbr = TEAM_ABBR_MAP[game.away_team] || '???'
  const scoreStr = `${awayAbbr} ${awayScore} - ${homeAbbr} ${homeScore}`

  let hit = false
  switch (leg.type) {
    case 'moneyline':
      hit = checkMoneyline(leg, gameScores)
      break
    case 'spread':
      hit = checkSpread(leg, gameScores)
      break
    case 'over_under':
      hit = checkOverUnder(leg, gameScores)
      break
    default:
      hit = false
  }

  return { hit, score: scoreStr }
}

/**
 * Check all legs of a parlay against completed scores.
 *
 * @param {Array} legs - The parlay's legs array
 * @param {Array} completedScores - Completed games from fetchCompletedScores()
 * @returns {{ allHit: boolean, results: Array<{ leg, hit: boolean, score: string }>, pending: number }}
 */
export function checkParlayResult(legs, completedScores) {
  const results = []
  let pending = 0

  for (const leg of legs) {
    const result = checkLeg(leg, completedScores)
    if (result === null) {
      pending++
      results.push({ leg, hit: false, score: 'Pending', pending: true })
    } else {
      results.push({ leg, hit: result.hit, score: result.score, pending: false })
    }
  }

  // A parlay wins only if ALL legs hit and none are pending
  const allHit = pending === 0 && results.every(r => r.hit)
  // A parlay loses if ANY completed leg missed (even with pending games)
  const anyMissed = results.some(r => !r.pending && !r.hit)

  return { allHit, anyMissed, results, pending }
}
