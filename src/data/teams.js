// NBA team data with colors, abbreviations, and ESPN logo IDs
// Logos from ESPN CDN: https://a.espncdn.com/i/teamlogos/nba/500/{abbr}.png

const ESPN_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/nba/500'

export const NBA_TEAMS = {
  'Atlanta Hawks':          { abbr: 'ATL', espnAbbr: 'atl', color: '#E03A3E', secondary: '#C1D32F' },
  'Boston Celtics':         { abbr: 'BOS', espnAbbr: 'bos', color: '#007A33', secondary: '#BA9653' },
  'Brooklyn Nets':          { abbr: 'BKN', espnAbbr: 'bkn', color: '#000000', secondary: '#FFFFFF' },
  'Charlotte Hornets':      { abbr: 'CHA', espnAbbr: 'cha', color: '#1D1160', secondary: '#00788C' },
  'Chicago Bulls':          { abbr: 'CHI', espnAbbr: 'chi', color: '#CE1141', secondary: '#000000' },
  'Cleveland Cavaliers':    { abbr: 'CLE', espnAbbr: 'cle', color: '#860038', secondary: '#FDBB30' },
  'Dallas Mavericks':       { abbr: 'DAL', espnAbbr: 'dal', color: '#00538C', secondary: '#002B5E' },
  'Denver Nuggets':         { abbr: 'DEN', espnAbbr: 'den', color: '#0E2240', secondary: '#FEC524' },
  'Detroit Pistons':        { abbr: 'DET', espnAbbr: 'det', color: '#C8102E', secondary: '#006BB6' },
  'Golden State Warriors':  { abbr: 'GSW', espnAbbr: 'gs',  color: '#1D428A', secondary: '#FFC72C' },
  'Houston Rockets':        { abbr: 'HOU', espnAbbr: 'hou', color: '#CE1141', secondary: '#000000' },
  'Indiana Pacers':         { abbr: 'IND', espnAbbr: 'ind', color: '#002D62', secondary: '#FDBB30' },
  'LA Clippers':            { abbr: 'LAC', espnAbbr: 'lac', color: '#C8102E', secondary: '#1D428A' },
  'Los Angeles Lakers':     { abbr: 'LAL', espnAbbr: 'lal', color: '#552583', secondary: '#FDB927' },
  'Memphis Grizzlies':      { abbr: 'MEM', espnAbbr: 'mem', color: '#5D76A9', secondary: '#12173F' },
  'Miami Heat':             { abbr: 'MIA', espnAbbr: 'mia', color: '#98002E', secondary: '#F9A01B' },
  'Milwaukee Bucks':        { abbr: 'MIL', espnAbbr: 'mil', color: '#00471B', secondary: '#EEE1C6' },
  'Minnesota Timberwolves': { abbr: 'MIN', espnAbbr: 'min', color: '#0C2340', secondary: '#236192' },
  'New Orleans Pelicans':   { abbr: 'NOP', espnAbbr: 'no',  color: '#0C2340', secondary: '#C8102E' },
  'New York Knicks':        { abbr: 'NYK', espnAbbr: 'ny',  color: '#006BB6', secondary: '#F58426' },
  'Oklahoma City Thunder':  { abbr: 'OKC', espnAbbr: 'okc', color: '#007AC1', secondary: '#EF6100' },
  'Orlando Magic':          { abbr: 'ORL', espnAbbr: 'orl', color: '#0077C0', secondary: '#C4CED4' },
  'Philadelphia 76ers':     { abbr: 'PHI', espnAbbr: 'phi', color: '#006BB6', secondary: '#ED174C' },
  'Phoenix Suns':           { abbr: 'PHX', espnAbbr: 'phx', color: '#1D1160', secondary: '#E56020' },
  'Portland Trail Blazers': { abbr: 'POR', espnAbbr: 'por', color: '#E03A3E', secondary: '#000000' },
  'Sacramento Kings':       { abbr: 'SAC', espnAbbr: 'sac', color: '#5A2D81', secondary: '#63727A' },
  'San Antonio Spurs':      { abbr: 'SAS', espnAbbr: 'sa',  color: '#C4CED4', secondary: '#000000' },
  'Toronto Raptors':        { abbr: 'TOR', espnAbbr: 'tor', color: '#CE1141', secondary: '#000000' },
  'Utah Jazz':              { abbr: 'UTA', espnAbbr: 'utah', color: '#002B5C', secondary: '#00471B' },
  'Washington Wizards':     { abbr: 'WAS', espnAbbr: 'wsh', color: '#002B5C', secondary: '#E31837' },
}

export function getTeamInfo(teamName) {
  // Try exact match first
  if (NBA_TEAMS[teamName]) {
    const team = NBA_TEAMS[teamName]
    return {
      name: teamName,
      ...team,
      logo: `${ESPN_LOGO_BASE}/${team.espnAbbr}.png`,
    }
  }

  // Try partial match
  const match = Object.keys(NBA_TEAMS).find(
    key => key.toLowerCase().includes(teamName.toLowerCase()) ||
           teamName.toLowerCase().includes(key.toLowerCase())
  )
  if (match) {
    const team = NBA_TEAMS[match]
    return {
      name: match,
      ...team,
      logo: `${ESPN_LOGO_BASE}/${team.espnAbbr}.png`,
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

export function getTeamAbbr(teamName) {
  return getTeamInfo(teamName).abbr
}

export function getTeamLogo(abbreviation) {
  const team = Object.values(NBA_TEAMS).find(t => t.abbr === abbreviation)
  if (team) return `${ESPN_LOGO_BASE}/${team.espnAbbr}.png`
  return null
}
