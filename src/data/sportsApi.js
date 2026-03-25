/**
 * Sports data fetching layer.
 * Uses The Odds API for real game data + odds (NBA & NFL).
 * Falls back to generated sample data if no API key or API is down.
 */

import { format } from 'date-fns'
import { generateEstimatedOdds } from '../utils/odds'

const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

// Preferred bookmakers in priority order
const PREFERRED_BOOKMAKERS = ['fanduel', 'draftkings', 'betmgm', 'caesars', 'espnbet']

// Supported sports
export const SPORTS = {
  nba: { key: 'basketball_nba', label: 'NBA', emoji: '🏀', oddsApiKey: 'basketball_nba' },
  nfl: { key: 'americanfootball_nfl', label: 'NFL', emoji: '🏈', oddsApiKey: 'americanfootball_nfl' },
}

// Per-sport cache to avoid burning API requests on every render/navigation
const oddsCache = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/** Clear the odds cache for a sport (or all sports) so the next fetchGames call hits the API. */
export function clearOddsCache(sport = null) {
  if (sport) {
    delete oddsCache[sport]
  } else {
    for (const key of Object.keys(oddsCache)) {
      delete oddsCache[key]
    }
  }
}

/** Return the timestamp of the last successful API fetch for a sport (0 if no cache). */
export function getLastFetchTime(sport = 'nba') {
  return oddsCache[sport]?.timestamp || 0
}

// Fetch games + odds from The Odds API (with per-sport caching)
async function fetchOddsApi(sport = 'nba') {
  const sportConfig = SPORTS[sport]
  if (!sportConfig) throw new Error(`Unknown sport: ${sport}`)

  const cacheKey = sport
  const cached = oddsCache[cacheKey]
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const url = new URL(`${ODDS_API_BASE}/sports/${sportConfig.oddsApiKey}/odds`)
  url.searchParams.set('apiKey', ODDS_API_KEY)
  url.searchParams.set('regions', 'us')
  url.searchParams.set('markets', 'h2h,spreads,totals')
  url.searchParams.set('oddsFormat', 'american')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Odds API error: ${response.status}`)
  }

  // Log remaining requests for awareness
  const remaining = response.headers.get('x-requests-remaining')
  const used = response.headers.get('x-requests-used')
  if (remaining) {
    console.log(`Odds API (${sport}): ${used} used, ${remaining} remaining`)
  }

  const data = await response.json()
  oddsCache[cacheKey] = { data, timestamp: Date.now() }
  return data
}

// Pick the best bookmaker from the list
function pickBookmaker(bookmakers) {
  for (const preferred of PREFERRED_BOOKMAKERS) {
    const found = bookmakers.find(b => b.key === preferred)
    if (found) return found
  }
  return bookmakers[0] // fallback to first available
}

// Extract odds from a bookmaker's markets
function extractOdds(bookmaker, homeTeam, awayTeam, sport) {
  const markets = {}
  for (const market of bookmaker.markets) {
    markets[market.key] = market.outcomes
  }

  // Moneyline (h2h)
  const h2h = markets.h2h || []
  const homeML = h2h.find(o => o.name === homeTeam)
  const awayML = h2h.find(o => o.name === awayTeam)

  // Spreads
  const spreads = markets.spreads || []
  const homeSpread = spreads.find(o => o.name === homeTeam)
  const awaySpread = spreads.find(o => o.name === awayTeam)

  // Totals (over/under)
  const totals = markets.totals || []
  const over = totals.find(o => o.name === 'Over')
  const under = totals.find(o => o.name === 'Under')

  // Default total depends on sport
  const defaultTotal = sport === 'nfl' ? 45 : 220

  return {
    moneyline: {
      home: homeML?.price || -110,
      away: awayML?.price || -110,
    },
    spread: {
      home: { line: homeSpread?.point || 0, odds: homeSpread?.price || -110 },
      away: { line: awaySpread?.point || 0, odds: awaySpread?.price || -110 },
    },
    overUnder: {
      total: over?.point || defaultTotal,
      over: { odds: over?.price || -110 },
      under: { odds: under?.price || -110 },
    },
    source: 'api',
    bookmaker: bookmaker.title,
  }
}

// Map The Odds API team names to our abbreviation format
const NBA_TEAM_ABBR_MAP = {
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

const NFL_TEAM_ABBR_MAP = {
  'Arizona Cardinals': 'ARI', 'Atlanta Falcons': 'ATL', 'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF', 'Carolina Panthers': 'CAR', 'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN', 'Cleveland Browns': 'CLE', 'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN', 'Detroit Lions': 'DET', 'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU', 'Indianapolis Colts': 'IND', 'Jacksonville Jaguars': 'JAX',
  'Kansas City Chiefs': 'KC', 'Las Vegas Raiders': 'LV', 'Los Angeles Chargers': 'LAC',
  'Los Angeles Rams': 'LAR', 'Miami Dolphins': 'MIA', 'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE', 'New Orleans Saints': 'NO', 'New York Giants': 'NYG',
  'New York Jets': 'NYJ', 'Philadelphia Eagles': 'PHI', 'Pittsburgh Steelers': 'PIT',
  'San Francisco 49ers': 'SF', 'Seattle Seahawks': 'SEA', 'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN', 'Washington Commanders': 'WSH',
}

function getTeamAbbrMap(sport) {
  return sport === 'nfl' ? NFL_TEAM_ABBR_MAP : NBA_TEAM_ABBR_MAP
}

function teamNameToInfo(name, sport) {
  const map = getTeamAbbrMap(sport)
  const abbr = map[name] || name.substring(0, 3).toUpperCase()
  const city = name.replace(/ [^ ]+$/, '') // everything before last word
  return {
    id: abbr,
    name,
    city,
    abbreviation: abbr,
    conference: '',
    division: '',
  }
}

// Transform Odds API event to our game format
function transformEvent(event, sport) {
  const defaultBookmaker = event.bookmakers?.length > 0 ? pickBookmaker(event.bookmakers) : null
  const homeTeam = teamNameToInfo(event.home_team, sport)
  const awayTeam = teamNameToInfo(event.away_team, sport)

  const gameTime = new Date(event.commence_time)
  const timeStr = gameTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  const defaultOdds = defaultBookmaker
    ? extractOdds(defaultBookmaker, event.home_team, event.away_team, sport)
    : { ...generateEstimatedOdds(0.5, 0.5), source: 'estimated', bookmaker: null }

  // Build odds for ALL available bookmakers
  const oddsByBookmaker = {}
  for (const bm of (event.bookmakers || [])) {
    oddsByBookmaker[bm.key] = extractOdds(bm, event.home_team, event.away_team, sport)
  }

  // Collect all bookmaker keys that have odds for this game
  const availableBookmakers = (event.bookmakers || []).map(b => b.key)

  return {
    id: event.id,
    date: format(gameTime, 'yyyy-MM-dd'),
    status: 'scheduled',
    time: timeStr,
    commenceTime: gameTime.getTime(),
    homeTeam,
    awayTeam,
    homeScore: 0,
    awayScore: 0,
    period: 0,
    odds: defaultOdds,
    oddsByBookmaker,
    availableBookmakers,
    sport,
  }
}

// Fetch games for a specific date and sport
export async function fetchGames(date, sport = 'nba') {
  const dateStr = format(date, 'yyyy-MM-dd')

  if (ODDS_API_KEY) {
    try {
      const events = await fetchOddsApi(sport)

      if (events && events.length > 0) {
        // Filter to games on the requested date
        const dayGames = events
          .map(e => transformEvent(e, sport))
          .filter(g => g.date === dateStr)
          .sort((a, b) => a.commenceTime - b.commenceTime)

        if (dayGames.length > 0) {
          return dayGames
        }
      }
    } catch (err) {
      console.warn('Odds API unavailable, using sample data:', err.message)
    }
  }

  // Fallback to sample data
  return sport === 'nfl' ? generateSampleNFLGames(date) : generateSampleGames(date)
}

// Generate sample NBA games for demo/fallback
function generateSampleGames(date) {
  const matchups = [
    {
      home: { id: 1, name: 'Boston Celtics', city: 'Boston', abbreviation: 'BOS', conference: 'East', division: 'Atlantic' },
      away: { id: 2, name: 'New York Knicks', city: 'New York', abbreviation: 'NYK', conference: 'East', division: 'Atlantic' },
      time: '7:30 PM ET',
    },
    {
      home: { id: 3, name: 'Los Angeles Lakers', city: 'Los Angeles', abbreviation: 'LAL', conference: 'West', division: 'Pacific' },
      away: { id: 4, name: 'Golden State Warriors', city: 'Golden State', abbreviation: 'GSW', conference: 'West', division: 'Pacific' },
      time: '10:00 PM ET',
    },
    {
      home: { id: 5, name: 'Milwaukee Bucks', city: 'Milwaukee', abbreviation: 'MIL', conference: 'East', division: 'Central' },
      away: { id: 6, name: 'Miami Heat', city: 'Miami', abbreviation: 'MIA', conference: 'East', division: 'Southeast' },
      time: '8:00 PM ET',
    },
    {
      home: { id: 7, name: 'Denver Nuggets', city: 'Denver', abbreviation: 'DEN', conference: 'West', division: 'Northwest' },
      away: { id: 8, name: 'Phoenix Suns', city: 'Phoenix', abbreviation: 'PHX', conference: 'West', division: 'Pacific' },
      time: '9:00 PM ET',
    },
    {
      home: { id: 9, name: 'Dallas Mavericks', city: 'Dallas', abbreviation: 'DAL', conference: 'West', division: 'Southwest' },
      away: { id: 10, name: 'Oklahoma City Thunder', city: 'Oklahoma City', abbreviation: 'OKC', conference: 'West', division: 'Northwest' },
      time: '8:30 PM ET',
    },
    {
      home: { id: 11, name: 'Philadelphia 76ers', city: 'Philadelphia', abbreviation: 'PHI', conference: 'East', division: 'Atlantic' },
      away: { id: 12, name: 'Cleveland Cavaliers', city: 'Cleveland', abbreviation: 'CLE', conference: 'East', division: 'Central' },
      time: '7:00 PM ET',
    },
  ]

  const dayNum = date.getDate()
  const count = 3 + (dayNum % 4)
  const startIdx = dayNum % matchups.length

  const games = []
  for (let i = 0; i < count; i++) {
    const matchup = matchups[(startIdx + i) % matchups.length]
    const seed = (matchup.home.name.length + matchup.away.name.length) / 30
    const odds = generateEstimatedOdds(0.5 + (seed - 0.5) * 0.3, 0.5 - (seed - 0.5) * 0.3)

    games.push({
      id: `sample-${i}-${format(date, 'yyyyMMdd')}`,
      date: format(date, 'yyyy-MM-dd'),
      status: 'scheduled',
      time: matchup.time,
      homeTeam: matchup.home,
      awayTeam: matchup.away,
      homeScore: 0,
      awayScore: 0,
      period: 0,
      odds: { ...odds, source: 'estimated', bookmaker: null },
      availableBookmakers: [],
      sport: 'nba',
    })
  }

  return games
}

// Generate sample NFL games for demo/fallback
function generateSampleNFLGames(date) {
  const matchups = [
    {
      home: { id: 1, name: 'Kansas City Chiefs', city: 'Kansas City', abbreviation: 'KC', conference: 'AFC', division: 'West' },
      away: { id: 2, name: 'Buffalo Bills', city: 'Buffalo', abbreviation: 'BUF', conference: 'AFC', division: 'East' },
      time: '4:25 PM ET',
    },
    {
      home: { id: 3, name: 'San Francisco 49ers', city: 'San Francisco', abbreviation: 'SF', conference: 'NFC', division: 'West' },
      away: { id: 4, name: 'Philadelphia Eagles', city: 'Philadelphia', abbreviation: 'PHI', conference: 'NFC', division: 'East' },
      time: '1:00 PM ET',
    },
    {
      home: { id: 5, name: 'Dallas Cowboys', city: 'Dallas', abbreviation: 'DAL', conference: 'NFC', division: 'East' },
      away: { id: 6, name: 'Detroit Lions', city: 'Detroit', abbreviation: 'DET', conference: 'NFC', division: 'North' },
      time: '1:00 PM ET',
    },
    {
      home: { id: 7, name: 'Baltimore Ravens', city: 'Baltimore', abbreviation: 'BAL', conference: 'AFC', division: 'North' },
      away: { id: 8, name: 'Cincinnati Bengals', city: 'Cincinnati', abbreviation: 'CIN', conference: 'AFC', division: 'North' },
      time: '8:20 PM ET',
    },
    {
      home: { id: 9, name: 'Green Bay Packers', city: 'Green Bay', abbreviation: 'GB', conference: 'NFC', division: 'North' },
      away: { id: 10, name: 'Minnesota Vikings', city: 'Minnesota', abbreviation: 'MIN', conference: 'NFC', division: 'North' },
      time: '4:25 PM ET',
    },
    {
      home: { id: 11, name: 'Miami Dolphins', city: 'Miami', abbreviation: 'MIA', conference: 'AFC', division: 'East' },
      away: { id: 12, name: 'New York Jets', city: 'New York', abbreviation: 'NYJ', conference: 'AFC', division: 'East' },
      time: '1:00 PM ET',
    },
  ]

  const dayNum = date.getDate()
  const count = 3 + (dayNum % 4)
  const startIdx = dayNum % matchups.length

  const games = []
  for (let i = 0; i < count; i++) {
    const matchup = matchups[(startIdx + i) % matchups.length]
    const seed = (matchup.home.name.length + matchup.away.name.length) / 30
    const odds = generateEstimatedOdds(0.5 + (seed - 0.5) * 0.3, 0.5 - (seed - 0.5) * 0.3)

    // NFL-appropriate over/under (around 43-50)
    const nflTotal = 43 + (dayNum % 8)
    odds.overUnder.total = nflTotal

    games.push({
      id: `sample-nfl-${i}-${format(date, 'yyyyMMdd')}`,
      date: format(date, 'yyyy-MM-dd'),
      status: 'scheduled',
      time: matchup.time,
      homeTeam: matchup.home,
      awayTeam: matchup.away,
      homeScore: 0,
      awayScore: 0,
      period: 0,
      odds: { ...odds, source: 'estimated', bookmaker: null },
      availableBookmakers: [],
      sport: 'nfl',
    })
  }

  return games
}
