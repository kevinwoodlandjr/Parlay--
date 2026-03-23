const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are an expert NBA sports betting analyst. You provide sharp, concise analysis of parlay bets.

When analyzing a parlay:
- Assess each leg's risk (low/medium/high) based on the odds and matchup
- Note any correlated legs (same game, same conference, similar bet types)
- Give an overall confidence rating (1-10)
- Keep responses under 250 words
- Use a direct, confident tone like a veteran bettor
- Format with clear sections using **bold** headers

When advising:
- Give specific, actionable suggestions
- Reference the odds when making points
- Be honest about risk — never oversell a bet`

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'AI features not configured. Add ANTHROPIC_API_KEY to Vercel environment variables.' })
  }

  const { legs, wager, parlayOdds, mode, question } = req.body

  if (!legs || !Array.isArray(legs) || legs.length === 0) {
    return res.status(400).json({ error: 'No parlay legs provided' })
  }

  // Build the parlay context
  const parlayDescription = legs.map((leg, i) => {
    const matchup = leg.game
      ? `${leg.game.awayTeam?.abbreviation || leg.game.awayTeam?.name} @ ${leg.game.homeTeam?.abbreviation || leg.game.homeTeam?.name}`
      : 'Unknown matchup'
    return `Leg ${i + 1}: ${leg.description} | ${matchup} | Odds: ${leg.odds > 0 ? '+' : ''}${leg.odds}`
  }).join('\n')

  let userMessage
  if (mode === 'analyze') {
    userMessage = `Analyze this ${legs.length}-leg NBA parlay:

${parlayDescription}

Combined Parlay Odds: ${parlayOdds > 0 ? '+' : ''}${parlayOdds}
Wager: $${wager}

Give me a risk breakdown for each leg, note any correlations, and rate overall confidence 1-10.`
  } else {
    userMessage = `I have this ${legs.length}-leg NBA parlay:

${parlayDescription}

Combined Parlay Odds: ${parlayOdds > 0 ? '+' : ''}${parlayOdds}
Wager: $${wager}

My question: ${question || 'What do you think of this parlay?'}`
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Anthropic API error:', errorData)
      return res.status(500).json({ error: 'AI service temporarily unavailable' })
    }

    const data = await response.json()
    const analysis = data.content?.[0]?.text || 'Unable to generate analysis'

    return res.status(200).json({ analysis })
  } catch (err) {
    console.error('AI analysis error:', err)
    return res.status(500).json({ error: 'Failed to generate analysis' })
  }
}
