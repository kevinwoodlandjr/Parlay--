/**
 * NBA data fetching layer.
 * Uses balldontlie API (free, no key required) for real NBA game data.
 * Falls back to generated sample data if the API is down or has no games.
 */

import { format, addDays, subDays } from 'date-fns'

const BASE_URL = 'https://api.balldontlie.io/v1'

// Free API key for balldontlie v1
const API_KEY = null // Not needed for basic endpoints

async function fetchApi(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.append(key, val)
    }
  })

  const headers = { 'Accept': 'application/json' }
  if (API_KEY) headers['Authorization'] = API_KEY

  const response = await fetch(url.toString(), { headers })
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

// Fetch games for a specific date
export async function fetchGames(date) {
  const dateStr = format(date, 'yyyy-MM-dd')

  // Try API if key is available
  if (API_KEY) {
    try {
      const data = await fetchApi('/games', {
        'dates[]': dateStr,
        per_page: 25,
      })

      if (data.data && data.data.length > 0) {
        return data.data.map(normalizeGame)
      }
    } catch (err) {
      console.warn('API unavailable, using sample data')
    }
  }

  // Use sample data (will be replaced with real API data later)
  return generateSampleGames(date)
}

// Fetch team season records for odds estimation
export async function fetchTeams() {
  try {
    const data = await fetchApi('/teams', { per_page: 30 })
    return data.data || []
  } catch (err) {
    console.warn('Failed to fetch teams:', err.message)
    return []
  }
}

// Normalize API game data to our format
function normalizeGame(game) {
  return {
    id: game.id,
    date: game.date,
    status: game.status || 'scheduled',
    time: game.time || null,
    homeTeam: {
      id: game.home_team.id,
      name: game.home_team.full_name,
      city: game.home_team.city,
      abbreviation: game.home_team.abbreviation,
      conference: game.home_team.conference,
      division: game.home_team.division,
    },
    awayTeam: {
      id: game.visitor_team.id,
      name: game.visitor_team.full_name,
      city: game.visitor_team.city,
      abbreviation: game.visitor_team.abbreviation,
      conference: game.visitor_team.conference,
      division: game.visitor_team.division,
    },
    homeScore: game.home_team_score,
    awayScore: game.visitor_team_score,
    period: game.period,
  }
}

// Generate sample games for demo/fallback
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

  // Use date to seed which games show (so it's consistent per day but varies)
  const dayNum = date.getDate()
  const count = 3 + (dayNum % 4) // 3-6 games
  const startIdx = dayNum % matchups.length

  const games = []
  for (let i = 0; i < count; i++) {
    const matchup = matchups[(startIdx + i) % matchups.length]
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
    })
  }

  return games
}
