// NFL team data with colors, abbreviations, and ESPN logo IDs
// Logos from ESPN CDN: https://a.espncdn.com/i/teamlogos/nfl/500/{abbr}.png

const ESPN_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/nfl/500'

export const NFL_TEAMS = {
  'Arizona Cardinals':       { abbr: 'ARI', espnAbbr: 'ari', color: '#97233F', secondary: '#000000' },
  'Atlanta Falcons':         { abbr: 'ATL', espnAbbr: 'atl', color: '#A71930', secondary: '#000000' },
  'Baltimore Ravens':        { abbr: 'BAL', espnAbbr: 'bal', color: '#241773', secondary: '#000000' },
  'Buffalo Bills':           { abbr: 'BUF', espnAbbr: 'buf', color: '#00338D', secondary: '#C60C30' },
  'Carolina Panthers':       { abbr: 'CAR', espnAbbr: 'car', color: '#0085CA', secondary: '#101820' },
  'Chicago Bears':           { abbr: 'CHI', espnAbbr: 'chi', color: '#0B162A', secondary: '#C83803' },
  'Cincinnati Bengals':      { abbr: 'CIN', espnAbbr: 'cin', color: '#FB4F14', secondary: '#000000' },
  'Cleveland Browns':        { abbr: 'CLE', espnAbbr: 'cle', color: '#311D00', secondary: '#FF3C00' },
  'Dallas Cowboys':          { abbr: 'DAL', espnAbbr: 'dal', color: '#003594', secondary: '#869397' },
  'Denver Broncos':          { abbr: 'DEN', espnAbbr: 'den', color: '#FB4F14', secondary: '#002244' },
  'Detroit Lions':           { abbr: 'DET', espnAbbr: 'det', color: '#0076B6', secondary: '#B0B7BC' },
  'Green Bay Packers':       { abbr: 'GB',  espnAbbr: 'gb',  color: '#203731', secondary: '#FFB612' },
  'Houston Texans':          { abbr: 'HOU', espnAbbr: 'hou', color: '#03202F', secondary: '#A71930' },
  'Indianapolis Colts':      { abbr: 'IND', espnAbbr: 'ind', color: '#002C5F', secondary: '#A2AAAD' },
  'Jacksonville Jaguars':    { abbr: 'JAX', espnAbbr: 'jax', color: '#006778', secondary: '#D7A22A' },
  'Kansas City Chiefs':      { abbr: 'KC',  espnAbbr: 'kc',  color: '#E31837', secondary: '#FFB81C' },
  'Las Vegas Raiders':       { abbr: 'LV',  espnAbbr: 'lv',  color: '#000000', secondary: '#A5ACAF' },
  'Los Angeles Chargers':    { abbr: 'LAC', espnAbbr: 'lac', color: '#0080C6', secondary: '#FFC20E' },
  'Los Angeles Rams':        { abbr: 'LAR', espnAbbr: 'lar', color: '#003594', secondary: '#FFA300' },
  'Miami Dolphins':          { abbr: 'MIA', espnAbbr: 'mia', color: '#008E97', secondary: '#FC4C02' },
  'Minnesota Vikings':       { abbr: 'MIN', espnAbbr: 'min', color: '#4F2683', secondary: '#FFC62F' },
  'New England Patriots':    { abbr: 'NE',  espnAbbr: 'ne',  color: '#002244', secondary: '#C60C30' },
  'New Orleans Saints':      { abbr: 'NO',  espnAbbr: 'no',  color: '#D3BC8D', secondary: '#101820' },
  'New York Giants':         { abbr: 'NYG', espnAbbr: 'nyg', color: '#0B2265', secondary: '#A71930' },
  'New York Jets':           { abbr: 'NYJ', espnAbbr: 'nyj', color: '#125740', secondary: '#000000' },
  'Philadelphia Eagles':     { abbr: 'PHI', espnAbbr: 'phi', color: '#004C54', secondary: '#A5ACAF' },
  'Pittsburgh Steelers':     { abbr: 'PIT', espnAbbr: 'pit', color: '#FFB612', secondary: '#101820' },
  'San Francisco 49ers':     { abbr: 'SF',  espnAbbr: 'sf',  color: '#AA0000', secondary: '#B3995D' },
  'Seattle Seahawks':        { abbr: 'SEA', espnAbbr: 'sea', color: '#002244', secondary: '#69BE28' },
  'Tampa Bay Buccaneers':    { abbr: 'TB',  espnAbbr: 'tb',  color: '#D50A0A', secondary: '#FF7900' },
  'Tennessee Titans':        { abbr: 'TEN', espnAbbr: 'ten', color: '#0C2340', secondary: '#4B92DB' },
  'Washington Commanders':   { abbr: 'WSH', espnAbbr: 'wsh', color: '#5A1414', secondary: '#FFB612' },
}

export function getTeamInfo(teamName) {
  // Try exact match first
  if (NFL_TEAMS[teamName]) {
    const team = NFL_TEAMS[teamName]
    return {
      name: teamName,
      ...team,
      logo: `${ESPN_LOGO_BASE}/${team.espnAbbr}.png`,
    }
  }

  // Try partial match
  const match = Object.keys(NFL_TEAMS).find(
    key => key.toLowerCase().includes(teamName.toLowerCase()) ||
           teamName.toLowerCase().includes(key.toLowerCase())
  )
  if (match) {
    const team = NFL_TEAMS[match]
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

export function getTeamLogo(abbreviation) {
  const team = Object.values(NFL_TEAMS).find(t => t.abbr === abbreviation)
  if (team) return `${ESPN_LOGO_BASE}/${team.espnAbbr}.png`
  return null
}
