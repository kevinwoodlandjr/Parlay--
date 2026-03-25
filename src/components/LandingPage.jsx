import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../hooks/useTheme'
import { Zap, TrendingUp, Share2, Shield, Sparkles, Sun, Moon, ChevronRight, Mail, ArrowRight, BarChart3, Users, ExternalLink, X, RotateCcw } from 'lucide-react'
import Logo from './Logo'
import TeamLogo from './TeamLogo'
import { getTeamLogo } from '../data/teams'

// Demo data with ESPN abbreviations for real logos
const DEMO_GAMES = [
  {
    id: 'g1', away: 'BOS', home: 'NYK', awayFull: 'Celtics', homeFull: 'Knicks',
    awayEspn: 'bos', homeEspn: 'ny', time: '7:00 PM ET',
    odds: {
      spread: { away: { line: '+3.5', odds: -110 }, home: { line: '-3.5', odds: -110 } },
      total: { over: { line: 'O 218.5', odds: -110 }, under: { line: 'U 218.5', odds: -108 } },
      ml: { away: { line: '+150', odds: 150 }, home: { line: '-185', odds: -185 } },
    }
  },
  {
    id: 'g2', away: 'LAL', home: 'GSW', awayFull: 'Lakers', homeFull: 'Warriors',
    awayEspn: 'lal', homeEspn: 'gs', time: '10:00 PM ET',
    odds: {
      spread: { away: { line: '-2', odds: -110 }, home: { line: '+2', odds: -110 } },
      total: { over: { line: 'O 231', odds: -108 }, under: { line: 'U 231', odds: -112 } },
      ml: { away: { line: '-130', odds: -130 }, home: { line: '+110', odds: 110 } },
    }
  },
  {
    id: 'g3', away: 'MIA', home: 'MIL', awayFull: 'Heat', homeFull: 'Bucks',
    awayEspn: 'mia', homeEspn: 'mil', time: '8:00 PM ET',
    odds: {
      spread: { away: { line: '+5.5', odds: -110 }, home: { line: '-5.5', odds: -110 } },
      total: { over: { line: 'O 224', odds: -110 }, under: { line: 'U 224', odds: -110 } },
      ml: { away: { line: '+210', odds: 210 }, home: { line: '-250', odds: -250 } },
    }
  },
]

// Auto-play sequence for demo
const AUTO_LEGS = [
  { gameId: 'g1', type: 'spread', team: 'away', desc: 'BOS +3.5 (-110)', matchup: 'BOS @ NYK', odds: -110 },
  { gameId: 'g2', type: 'total', team: 'over', desc: 'Over 231 (-108)', matchup: 'LAL @ GSW', odds: -108 },
  { gameId: 'g3', type: 'ml', team: 'home', desc: 'MIL ML (-250)', matchup: 'MIA @ MIL', odds: -250 },
]

export default function LandingPage({ onAuth }) {
  const { theme, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('hero')

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <h1 className="text-lg font-extrabold text-fg tracking-tight">
              Slip<span className="text-accent">Mate</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              <a href="#features" className="text-fg-muted hover:text-fg text-sm px-3 py-1.5 rounded-lg transition-colors">Features</a>
              <a href="#demo" className="text-fg-muted hover:text-fg text-sm px-3 py-1.5 rounded-lg transition-colors">Preview</a>
              <a href="#contact" className="text-fg-muted hover:text-fg text-sm px-3 py-1.5 rounded-lg transition-colors">Contact</a>
            </div>
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-overlay hover:bg-overlay-hover border border-border flex items-center justify-center cursor-pointer transition-colors text-fg-muted hover:text-fg"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={onAuth}
              className="bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <Sparkles size={14} />
          AI-Powered Parlay Analysis
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-fg tracking-tight leading-tight">
          Build Smarter<br />
          <span className="text-accent">Multi-Sport Parlays</span>
        </h2>
        <p className="text-fg-muted text-lg sm:text-xl max-w-2xl mx-auto mt-5 leading-relaxed">
          Real-time odds from top sportsbooks. AI-powered analysis. Build, save, and track your parlays all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button
            onClick={onAuth}
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl text-base font-semibold cursor-pointer transition-colors flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            Get Started Free
            <ArrowRight size={18} />
          </button>
          <a
            href="#demo"
            className="bg-overlay hover:bg-overlay-hover text-fg-muted px-8 py-3 rounded-xl text-base font-semibold cursor-pointer transition-colors border border-border"
          >
            See It In Action
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-14">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-fg">30+</p>
            <p className="text-fg-subtle text-xs mt-1">NBA Teams</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-fg">5+</p>
            <p className="text-fg-subtle text-xs mt-1">Sportsbooks</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-accent">AI</p>
            <p className="text-fg-subtle text-xs mt-1">Bet Analysis</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h3 className="text-3xl font-bold text-fg">Everything You Need</h3>
            <p className="text-fg-muted mt-3 max-w-xl mx-auto">From real-time odds to AI analysis, we've built the ultimate parlay planning tool.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<TrendingUp size={22} />}
              title="Live Odds"
              desc="Real-time moneyline, spread, and over/under odds from FanDuel, DraftKings, BetMGM, and more."
            />
            <FeatureCard
              icon={<BarChart3 size={22} />}
              title="Parlay Builder"
              desc="Tap to add legs, see combined odds and payouts calculated instantly. Edit any odds to match your book."
            />
            <FeatureCard
              icon={<Sparkles size={22} />}
              title="AI Advisor"
              desc="Claude-powered analysis rates your parlay's risk, spots correlations, and suggests improvements."
            />
            <FeatureCard
              icon={<Share2 size={22} />}
              title="Share & Export"
              desc="Share parlays via link or export to your sportsbook with one tap."
            />
            <FeatureCard
              icon={<Shield size={22} />}
              title="Save & Track"
              desc="Save parlays to your account. Mark them as placed, won, or lost. Track your record over time."
            />
            <FeatureCard
              icon={<Users size={22} />}
              title="Light & Dark Mode"
              desc="Automatically matches your system preference, or toggle manually. Looks great either way."
            />
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section id="demo" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-fg">See It In Action</h3>
            <p className="text-fg-muted mt-3">A quick look at how easy it is to build a parlay</p>
          </div>
          <DemoPreview />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-fg">Ready to Build Your Edge?</h3>
          <p className="text-fg-muted mt-3">Create a free account and start building smarter parlays today.</p>
          <button
            onClick={onAuth}
            className="mt-6 bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl text-base font-semibold cursor-pointer transition-colors inline-flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            Create Free Account
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-fg">Contact Us</h3>
            <p className="text-fg-muted mt-3">Questions, feedback, or partnership inquiries? We'd love to hear from you.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo size={24} />
              <span className="text-fg font-bold text-sm">Slip<span className="text-accent">Mate</span></span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-fg-subtle text-xs hover:text-fg transition-colors">Features</a>
              <a href="#demo" className="text-fg-subtle text-xs hover:text-fg transition-colors">Preview</a>
              <a href="#contact" className="text-fg-subtle text-xs hover:text-fg transition-colors">Contact</a>
            </div>
            <p className="text-fg-subtle text-xs">
              SlipMate — For entertainment purposes only
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-overlay rounded-xl border border-border p-6 hover:border-border-hover transition-colors">
      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4">
        {icon}
      </div>
      <h4 className="text-fg font-semibold text-base">{title}</h4>
      <p className="text-fg-muted text-sm mt-2 leading-relaxed">{desc}</p>
    </div>
  )
}

function DemoPreview() {
  const [legs, setLegs] = useState([])
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [autoStep, setAutoStep] = useState(0)
  const intervalRef = useRef(null)

  // Calculate parlay payout
  const calcPayout = useCallback((currentLegs) => {
    if (currentLegs.length === 0) return { odds: 0, payout: 0 }
    const decimal = currentLegs.reduce((acc, leg) => {
      const o = leg.odds
      return acc * (o > 0 ? (o / 100) + 1 : (100 / Math.abs(o)) + 1)
    }, 1)
    const american = decimal >= 2 ? Math.round((decimal - 1) * 100) : Math.round(-100 / (decimal - 1))
    return { odds: american, payout: (decimal * 10).toFixed(2) }
  }, [])

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying) return
    intervalRef.current = setInterval(() => {
      setAutoStep(prev => {
        const next = (prev + 1) % 7
        if (next === 1) setLegs([AUTO_LEGS[0]])
        else if (next === 2) setLegs([AUTO_LEGS[0], AUTO_LEGS[1]])
        else if (next === 3) setLegs([AUTO_LEGS[0], AUTO_LEGS[1], AUTO_LEGS[2]])
        // steps 4-5 show payout
        else if (next === 6) setLegs([])
        return next
      })
    }, 1800)
    return () => clearInterval(intervalRef.current)
  }, [isAutoPlaying])

  // Stop auto-play on user interaction
  const stopAutoPlay = () => {
    if (isAutoPlaying) {
      clearInterval(intervalRef.current)
      setIsAutoPlaying(false)
      setLegs([])
    }
  }

  const resetDemo = () => {
    setLegs([])
    setAutoStep(0)
    setIsAutoPlaying(true)
  }

  // Toggle a leg interactively
  const toggleLeg = (gameId, type, team, desc, matchup, odds) => {
    stopAutoPlay()
    setLegs(prev => {
      const exists = prev.find(l => l.gameId === gameId && l.type === type && l.team === team)
      if (exists) return prev.filter(l => l !== exists)
      // Replace same game+type with new pick
      const filtered = prev.filter(l => !(l.gameId === gameId && l.type === type))
      return [...filtered, { gameId, type, team, desc, matchup, odds }]
    })
  }

  const isLegSelected = (gameId, type, team) => {
    return legs.some(l => l.gameId === gameId && l.type === type && l.team === team)
  }

  const isGameTypeSelected = (gameId, type) => {
    return legs.some(l => l.gameId === gameId && l.type === type)
  }

  const { odds: parlayOdds, payout } = calcPayout(legs)
  const showPayout = isAutoPlaying ? autoStep >= 4 && legs.length > 0 : legs.length > 0

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Demo header */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-overlay">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-fg font-bold text-sm">Slip<span className="text-accent">Mate</span></span>
          </div>
          <div className="flex items-center gap-2">
            {legs.length > 0 && (
              <span className="bg-accent/15 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                {legs.length} {legs.length === 1 ? 'Pick' : 'Picks'}
              </span>
            )}
            {!isAutoPlaying && (
              <button
                onClick={resetDemo}
                className="flex items-center gap-1 text-fg-subtle hover:text-fg text-[10px] font-medium px-2 py-1 rounded-md bg-surface border border-border cursor-pointer transition-colors"
              >
                <RotateCcw size={10} />
                Replay
              </button>
            )}
            {isAutoPlaying && (
              <span className="text-accent text-[10px] font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Auto-playing
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 grid sm:grid-cols-[1fr_220px] gap-4 sm:gap-5">
          {/* Games column */}
          <div className="space-y-3">
            <p className="text-fg-subtle text-[10px] font-semibold uppercase tracking-wider">Today's Games</p>
            {DEMO_GAMES.map((game) => {
              const gameSelected = legs.some(l => l.gameId === game.id)
              return (
                <div key={game.id} className={`rounded-xl border transition-all ${gameSelected ? 'border-accent/30 bg-accent/[0.03]' : 'border-border bg-overlay'}`}>
                  {/* Game header */}
                  <div className="px-3 py-2 flex items-center justify-between border-b border-border/50">
                    <span className="text-fg-subtle text-[10px] font-medium">{game.time}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
                      <span className="text-[9px]">SPREAD</span>
                      <span className="mx-3 text-[9px]">TOTAL</span>
                      <span className="text-[9px]">MONEY</span>
                    </span>
                  </div>

                  {/* Away team row */}
                  <div className="px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamLogo src={getTeamLogo(game.away)} abbr={game.away} size={20} />
                      <div className="min-w-0">
                        <span className="text-fg text-xs font-semibold block leading-tight">{game.awayFull}</span>
                        <span className="text-fg-subtle text-[9px]">{game.away}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DemoOddsCell
                        selected={isLegSelected(game.id, 'spread', 'away')}
                        highlighted={isGameTypeSelected(game.id, 'spread')}
                        onClick={() => toggleLeg(game.id, 'spread', 'away', `${game.away} ${game.odds.spread.away.line} (${game.odds.spread.away.odds})`, `${game.away} @ ${game.home}`, game.odds.spread.away.odds)}
                        top={game.odds.spread.away.line}
                        bottom={game.odds.spread.away.odds}
                      />
                      <DemoOddsCell
                        selected={isLegSelected(game.id, 'total', 'over')}
                        highlighted={isGameTypeSelected(game.id, 'total')}
                        onClick={() => toggleLeg(game.id, 'total', 'over', `${game.odds.total.over.line} (${game.odds.total.over.odds})`, `${game.away} @ ${game.home}`, game.odds.total.over.odds)}
                        top={game.odds.total.over.line}
                        bottom={game.odds.total.over.odds}
                      />
                      <DemoOddsCell
                        selected={isLegSelected(game.id, 'ml', 'away')}
                        highlighted={isGameTypeSelected(game.id, 'ml')}
                        onClick={() => toggleLeg(game.id, 'ml', 'away', `${game.away} ML (${game.odds.ml.away.odds})`, `${game.away} @ ${game.home}`, game.odds.ml.away.odds)}
                        top={game.odds.ml.away.line}
                        bottom={game.odds.ml.away.odds}
                        isMl
                      />
                    </div>
                  </div>

                  {/* Home team row */}
                  <div className="px-3 py-2 flex items-center justify-between border-t border-border/30">
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamLogo src={getTeamLogo(game.home)} abbr={game.home} size={20} />
                      <div className="min-w-0">
                        <span className="text-fg text-xs font-semibold block leading-tight">{game.homeFull}</span>
                        <span className="text-fg-subtle text-[9px]">{game.home}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DemoOddsCell
                        selected={isLegSelected(game.id, 'spread', 'home')}
                        highlighted={isGameTypeSelected(game.id, 'spread')}
                        onClick={() => toggleLeg(game.id, 'spread', 'home', `${game.home} ${game.odds.spread.home.line} (${game.odds.spread.home.odds})`, `${game.away} @ ${game.home}`, game.odds.spread.home.odds)}
                        top={game.odds.spread.home.line}
                        bottom={game.odds.spread.home.odds}
                      />
                      <DemoOddsCell
                        selected={isLegSelected(game.id, 'total', 'under')}
                        highlighted={isGameTypeSelected(game.id, 'total')}
                        onClick={() => toggleLeg(game.id, 'total', 'under', `${game.odds.total.under.line} (${game.odds.total.under.odds})`, `${game.away} @ ${game.home}`, game.odds.total.under.odds)}
                        top={game.odds.total.under.line}
                        bottom={game.odds.total.under.odds}
                      />
                      <DemoOddsCell
                        selected={isLegSelected(game.id, 'ml', 'home')}
                        highlighted={isGameTypeSelected(game.id, 'ml')}
                        onClick={() => toggleLeg(game.id, 'ml', 'home', `${game.home} ML (${game.odds.ml.home.odds})`, `${game.away} @ ${game.home}`, game.odds.ml.home.odds)}
                        top={game.odds.ml.home.line}
                        bottom={game.odds.ml.home.odds}
                        isMl
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {!isAutoPlaying && (
              <p className="text-fg-subtle text-[10px] text-center pt-1">Tap any odds cell to build a parlay</p>
            )}
          </div>

          {/* Slip column */}
          <div className="bg-overlay rounded-xl border border-border p-3 self-start">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-fg text-[11px] font-bold">Parlay Slip</span>
                {legs.length > 0 && (
                  <span className="text-fg-subtle text-[9px]">• {legs.length} {legs.length === 1 ? 'leg' : 'legs'}</span>
                )}
              </div>
              {legs.length > 0 && !isAutoPlaying && (
                <button
                  onClick={() => setLegs([])}
                  className="text-fg-subtle hover:text-accent text-[10px] cursor-pointer transition-colors"
                  title="Clear all"
                >
                  Clear
                </button>
              )}
            </div>

            {legs.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-2xl">🎯</span>
                <p className="text-fg-subtle text-[10px] mt-2">Tap odds to add legs</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {legs.map((leg, i) => (
                  <div key={`${leg.gameId}-${leg.type}-${leg.team}`} className="bg-surface rounded-lg p-2 border border-border animate-[fadeIn_0.3s_ease-out] flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-fg text-[10px] font-semibold leading-tight">{leg.desc}</p>
                      <p className="text-fg-subtle text-[8px] mt-0.5">{leg.matchup}</p>
                    </div>
                    {!isAutoPlaying && (
                      <button
                        onClick={() => setLegs(prev => prev.filter(l => l !== leg))}
                        className="text-fg-subtle hover:text-accent cursor-pointer shrink-0 mt-0.5"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}

                {showPayout && (
                  <div className="bg-gradient-to-r from-green/10 to-accent/5 rounded-lg p-2.5 border border-green/10 mt-2 animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-fg-subtle text-[8px] font-semibold uppercase">Wager $10</p>
                        <p className="text-green font-bold text-base leading-tight">${payout}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-fg-subtle text-[8px] font-semibold uppercase">Odds</p>
                        <p className="text-accent font-bold text-sm leading-tight">{parlayOdds > 0 ? '+' : ''}{parlayOdds}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-5 py-2.5 border-t border-border flex items-center justify-between">
          <p className="text-fg-subtle text-[10px]">
            {isAutoPlaying ? 'Click any odds cell to try it yourself' : 'Interactive demo — sign up for the full experience'}
          </p>
          {isAutoPlaying && (
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`w-1 h-1 rounded-full transition-colors ${autoStep === i ? 'bg-accent' : 'bg-fg-subtle/30'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DemoOddsCell({ selected, highlighted, onClick, top, bottom, isMl }) {
  const isPositive = typeof bottom === 'number' ? bottom > 0 : String(bottom).startsWith('+')
  return (
    <button
      onClick={onClick}
      className={`w-[60px] py-1.5 rounded-md text-center transition-all cursor-pointer border
        ${selected
          ? 'bg-accent/20 border-accent/40 ring-1 ring-accent/20'
          : highlighted
            ? 'bg-surface-lighter border-border-hover'
            : 'bg-surface border-transparent hover:bg-surface-light hover:border-border-hover'
        }`}
    >
      <p className={`text-[10px] font-semibold leading-tight ${selected ? 'text-accent' : 'text-fg'}`}>{top}</p>
      <p className={`text-[9px] font-medium leading-tight mt-0.5 ${selected ? 'text-accent' : isMl && isPositive ? 'text-green' : 'text-fg-muted'}`}>
        {typeof bottom === 'number' ? (bottom > 0 ? `+${bottom}` : bottom) : bottom}
      </p>
    </button>
  )
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8 text-center">
        <div className="w-14 h-14 bg-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-green" />
        </div>
        <h4 className="text-fg font-bold text-lg">Message Sent!</h4>
        <p className="text-fg-muted text-sm mt-2">We'll get back to you as soon as possible.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-accent text-sm font-semibold mt-4 hover:underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-fg-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full bg-overlay border border-border rounded-lg px-4 py-2.5 text-fg text-sm placeholder:text-fg-subtle outline-none focus:border-accent/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-fg-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full bg-overlay border border-border rounded-lg px-4 py-2.5 text-fg text-sm placeholder:text-fg-subtle outline-none focus:border-accent/50 transition-colors"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-fg-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Subject</label>
        <input
          type="text"
          placeholder="What's this about?"
          className="w-full bg-overlay border border-border rounded-lg px-4 py-2.5 text-fg text-sm placeholder:text-fg-subtle outline-none focus:border-accent/50 transition-colors"
          required
        />
      </div>
      <div>
        <label className="block text-fg-muted text-xs font-semibold uppercase tracking-wider mb-1.5">Message</label>
        <textarea
          placeholder="Your message..."
          rows={4}
          className="w-full bg-overlay border border-border rounded-lg px-4 py-2.5 text-fg text-sm placeholder:text-fg-subtle outline-none focus:border-accent/50 transition-colors resize-none"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Mail size={16} />
        Send Message
      </button>
    </form>
  )
}
