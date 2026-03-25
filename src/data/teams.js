// Unified team data — checks both NBA and NFL databases
// Logos from ESPN CDN:
//   NBA: https://a.espncdn.com/i/teamlogos/nba/500/{abbr}.png
//   NFL: https://a.espncdn.com/i/teamlogos/nfl/500/{abbr}.png

const NBA_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/nba/500'
const NFL_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/nfl/500'

export const NBA_TEAMS = {
  'Atlanta Hawks':          { abbr: 'ATL', espnAbbr: 'atl', color: '#E03A3E', secondary: '#C1D32F', sport: 'nba' },
  'Boston Celtics':         { abbr: 'BOS', espnAbbr: 'bos', color: '#007A33', secondary: '#BA9653', sport: 'nba' },
  'Brooklyn Nets':          { abbr: 'BKN', espnAbbr: 'bkn', color: '#000000', secondary: '#FFFFFF', sport: 'nba' },
  'Charlotte Hornets':      { abbr: 'CHA', espnAbbr: 'cha', color: '#1D1160', secondary: '#00788C', sport: 'nba' },
  'Chicago Bulls':          { abbr: 'CHI', espnAbbr: 'chi', color: '#CE1141', secondary: '#000000', sport: 'nba' },
  'Cleveland Cavaliers':    { abbr: 'CLE', espnAbbr: 'cle', color: '#860038', secondary: '#FDBB30', sport: 'nba' },
  'Dallas Mavericks':       { abbr: 'DAL', espnAbbr: 'dal', color: '#00538C', secondary: '#002B5E', sport: 'nba' },
  'Denver Nuggets':         { abbr: 'DEN', espnAbbr: 'den', color: '#0E2240', secondary: '#FEC524', sport: 'nba' },
  'Detroit Pistons':        { abbr: 'DET', espnAbbr: 'det', color: '#C8102E', secondary: '#006BB6', sport: 'nba' },
  'Golden State Warriors':  { abbr: 'GSW', espnAbbr: 'gs',  color: '#1D428A', secondary: '#FFC72C', sport: 'nba' },
  'Houston Rockets':        { abbr: 'HOU', espnAbbr: 'hou', color: '#CE1141', secondary: '#000000', sport: 'nba' },
  'Indiana Pacers':         { abbr: 'IND', espnAbbr: 'ind', color: '#002D62', secondary: '#FDBB30', sport: 'nba' },
  'LA Clippers':            { abbr: 'LAC', espnAbbr: 'lac', color: '#C8102E', secondary: '#1D428A', sport: 'nba' },
  'Los Angeles Lakers':     { abbr: 'LAL', espnAbbr: 'lal', color: '#552583', secondary: '#FDB927', sport: 'nba' },
  'Memphis Grizzlies':      { abbr: 'MEM', espnAbbr: 'mem', color: '#5D76A9', secondary: '#12173F', sport: 'nba' },
  'Miami Heat':             { abbr: 'MIA', espnAbbr: 'mia', color: '#98002E', secondary: '#F9A01B', sport: 'nba' },
  'Milwaukee Bucks':        { abbr: 'MIL', espnAbbr: 'mil', color: '#00471B', secondary: '#EEE1C6', sport: 'nba' },
  'Minnesota Timberwolves': { abbr: 'MIN', espnAbbr: 'min', color: '#0C2340', secondary: '#236192', sport: 'nba' },
  'New Orleans Pelicans':   { abbr: 'NOP', espnAbbr: 'no',  color: '#0C2340', secondary: '#C8102E', sport: 'nba' },
  'New York Knicks':        { abbr: 'NYK', espnAbbr: 'ny',  color: '#006BB6', secondary: '#F58426', sport: 'nba' },
  'Oklahoma City Thunder':  { abbr: 'OKC', espnAbbr: 'okc', color: '#007AC1', secondary: '#EF6100', sport: 'nba' },
  'Orlando Magic':          { abbr: 'ORL', espnAbbr: 'orl', color: '#0077C0', secondary: '#C4CED4', sport: 'nba' },
  'Philadelphia 76ers':     { abbr: 'PHI', espnAbbr: 'phi', color: '#006BB6', secondary: '#ED174C', sport: 'nba' },
  'Phoenix Suns':           { abbr: 'PHX', espnAbbr: 'phx', color: '#1D1160', secondary: '#E56020', sport: 'nba' },
  'Portland Trail Blazers': { abbr: 'POR', espnAbbr: 'por', color: '#E03A3E', secondary: '#000000', sport: 'nba' },
  'Sacramento Kings':       { abbr: 'SAC', espnAbbr: 'sac', color: '#5A2D81', secondary: '#63727A', sport: 'nba' },
  'San Antonio Spurs':      { abbr: 'SAS', espnAbbr: 'sa',  color: '#C4CED4', secondary: '#000000', sport: 'nba' },
  'Toronto Raptors':        { abbr: 'TOR', espnAbbr: 'tor', color: '#CE1141', secondary: '#000000', sport: 'nba' },
  'Utah Jazz':              { abbr: 'UTA', espnAbbr: 'utah', color: '#002B5C', secondary: '#00471B', sport: 'nba' },
  'Washington Wizards':     { abbr: 'WAS', espnAbbr: 'wsh', color: '#002B5C', secondary: '#E31837', sport: 'nba' },
}

import { NFL_TEAMS } from './nflTeams'

// Combined lookup: checks NBA first, then NFL
const ALL_TEAMS = { ...NBA_TEAMS }
for (const [name, data] of Object.entries(NFL_TEAMS)) {
  ALL_TEAMS[`NFL:${name}`] = { ...data, sport: 'nfl' }
}

function getLogoBase(sport) {
  return sport === 'nfl' ? NFL_LOGO_BASE : NBA_LOGO_BASE
}

export function getTeamInfo(teamName, sport = null) {
  // If sport is specified, search only that sport's teams
  if (sport === 'nfl') {
    return getNFLTeamInfo(teamName)
  }
  if (sport === 'nba') {
    return getNBATeamInfo(teamName)
  }

  // No sport specified — try NBA first, then NFL
  const nbaResult = getNBATeamInfo(teamName)
  if (nbaResult.logo) return nbaResult

  const nflResult = getNFLTeamInfo(teamName)
  if (nflResult.logo) return nflResult

  return nbaResult // fallback to NBA default
}

function getNBATeamInfo(teamName) {
  if (NBA_TEAMS[teamName]) {
    const team = NBA_TEAMS[teamName]
    return {
      name: teamName,
      ...team,
      logo: `${NBA_LOGO_BASE}/${team.espnAbbr}.png`,
    }
  }

  const match = Object.keys(NBA_TEAMS).find(
    key => key.toLowerCase().includes(teamName.toLowerCase()) ||
           teamName.toLowerCase().includes(key.toLowerCase())
  )
  if (match) {
    const team = NBA_TEAMS[match]
    return {
      name: match,
      ...team,
      logo: `${NBA_LOGO_BASE}/${team.espnAbbr}.png`,
    }
  }

  return {
    name: teamName,
    abbr: teamName.slice(0, 3).toUpperCase(),
    color: '#666',
    secondary: '#999',
    logo: null,
  }
}

function getNFLTeamInfo(teamName) {
  if (NFL_TEAMS[teamName]) {
    const team = NFL_TEAMS[teamName]
    return {
      name: teamName,
      ...team,
      logo: `${NFL_LOGO_BASE}/${team.espnAbbr}.png`,
    }
  }

  const match = Object.keys(NFL_TEAMS).find(
    key => key.toLowerCase().includes(teamName.toLowerCase()) ||
           teamName.toLowerCase().includes(key.toLowerCase())
  )
  if (match) {
    const team = NFL_TEAMS[match]
    return {
      name: match,
      ...team,
      logo: `${NFL_LOGO_BASE}/${team.espnAbbr}.png`,
    }
  }

  return {
    name: teamName,
    abbr: teamName.slice(0, 3).toUpperCase(),
    color: '#666',
    secondary: '#999',
    logo: null,
  }
}

export function getTeamAbbr(teamName, sport = null) {
  return getTeamInfo(teamName, sport).abbr
}

export function getTeamLogo(abbreviation, sport = null) {
  // Check NBA
  if (sport !== 'nfl') {
    const nbaTeam = Object.values(NBA_TEAMS).find(t => t.abbr === abbreviation)
    if (nbaTeam) return `${NBA_LOGO_BASE}/${nbaTeam.espnAbbr}.png`
  }

  // Check NFL
  if (sport !== 'nba') {
    const nflTeam = Object.values(NFL_TEAMS).find(t => t.abbr === abbreviation)
    if (nflTeam) return `${NFL_LOGO_BASE}/${nflTeam.espnAbbr}.png`
  }

  return null
}
