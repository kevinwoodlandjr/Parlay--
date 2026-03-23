import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'
import { Zap, TrendingUp, Share2, Shield, Sparkles, Sun, Moon, ChevronRight, Mail, ArrowRight, BarChart3, Users, ExternalLink } from 'lucide-react'
import Logo from './Logo'

// Demo data for the animated preview
const DEMO_GAMES = [
  { away: 'BOS', home: 'NYK', spread: '+3.5', ml: '+150', total: 'O 218.5' },
  { away: 'LAL', home: 'GSW', spread: '-2', ml: '-130', total: 'O 231' },
  { away: 'MIA', home: 'MIL', spread: '+5.5', ml: '+210', total: 'U 224' },
]

const DEMO_LEGS = [
  { desc: 'BOS +3.5 (-110)', matchup: 'BOS @ NYK', odds: '-110' },
  { desc: 'Over 231 (-108)', matchup: 'LAL @ GSW', odds: '-108' },
  { desc: 'MIL ML (-250)', matchup: 'MIA @ MIL', odds: '-250' },
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
              LAYUP<span className="text-accent">!</span>
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
          <span className="text-accent">NBA Parlays</span>
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
              <span className="text-fg font-bold text-sm">LAYUP<span className="text-accent">!</span></span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-fg-subtle text-xs hover:text-fg transition-colors">Features</a>
              <a href="#demo" className="text-fg-subtle text-xs hover:text-fg transition-colors">Preview</a>
              <a href="#contact" className="text-fg-subtle text-xs hover:text-fg transition-colors">Contact</a>
            </div>
            <p className="text-fg-subtle text-xs">
              LayUp! — For entertainment purposes only
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
  const [step, setStep] = useState(0)
  const [legs, setLegs] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    // Auto-advance through demo steps
    intervalRef.current = setInterval(() => {
      setStep(prev => {
        const next = (prev + 1) % 6
        // Steps: 0=show games, 1=pick leg 1, 2=pick leg 2, 3=pick leg 3, 4=show payout, 5=reset
        if (next === 1) setLegs([DEMO_LEGS[0]])
        else if (next === 2) setLegs([DEMO_LEGS[0], DEMO_LEGS[1]])
        else if (next === 3) setLegs([DEMO_LEGS[0], DEMO_LEGS[1], DEMO_LEGS[2]])
        else if (next === 5) setLegs([])
        return next
      })
    }, 2000)

    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Fake header */}
        <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-overlay">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-accent to-orange-500 rounded-md" />
            <span className="text-fg font-bold text-sm">LAYUP!</span>
          </div>
          <div className="flex items-center gap-2">
            {legs.length > 0 && (
              <span className="bg-accent/15 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                {legs.length} Picks
              </span>
            )}
          </div>
        </div>

        <div className="p-5 grid sm:grid-cols-[1fr_240px] gap-5">
          {/* Games column */}
          <div className="space-y-2">
            <p className="text-fg-subtle text-xs font-semibold uppercase tracking-wider mb-3">Today's Games</p>
            {DEMO_GAMES.map((game, i) => {
              const isSelected = legs.some(l => l.matchup.includes(game.away))
              return (
                <div key={i} className={`rounded-lg border p-3 transition-all ${isSelected ? 'border-accent/30 bg-accent/5' : 'border-border bg-overlay'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-fg-subtle/20" />
                      <span className="text-fg text-xs font-semibold">{game.away} @ {game.home}</span>
                    </div>
                    <span className="text-green text-[10px] font-medium">FanDuel</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    <div className={`text-center py-1.5 rounded text-[11px] font-semibold transition-all ${isSelected ? 'bg-accent/20 text-accent' : 'bg-surface text-fg-muted'}`}>
                      {game.spread}
                    </div>
                    <div className="text-center py-1.5 rounded bg-surface text-fg-muted text-[11px] font-semibold">
                      {game.total}
                    </div>
                    <div className="text-center py-1.5 rounded bg-surface text-fg-muted text-[11px] font-semibold">
                      {game.ml}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Slip column */}
          <div className="bg-overlay rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-fg text-xs font-bold">Parlay Slip</span>
              {legs.length > 0 && (
                <span className="text-fg-subtle text-[10px]">• {legs.length} legs</span>
              )}
            </div>

            {legs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-fg-subtle text-[11px]">Tap odds to add legs</p>
              </div>
            ) : (
              <div className="space-y-2">
                {legs.map((leg, i) => (
                  <div key={i} className="bg-surface rounded-lg p-2.5 border border-border animate-[fadeIn_0.3s_ease-out]">
                    <p className="text-fg text-[11px] font-semibold">{leg.desc}</p>
                    <p className="text-fg-subtle text-[9px] mt-0.5">{leg.matchup}</p>
                  </div>
                ))}

                {step >= 4 && (
                  <div className="bg-gradient-to-r from-green/10 to-accent/5 rounded-lg p-3 border border-green/10 mt-3 animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-fg-subtle text-[9px] font-semibold uppercase">Payout</p>
                        <p className="text-green font-bold text-lg">$84.20</p>
                      </div>
                      <div className="text-right">
                        <p className="text-fg-subtle text-[9px] font-semibold uppercase">Odds</p>
                        <p className="text-accent font-bold text-sm">+742</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-center gap-1.5">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${step === i ? 'bg-accent' : 'bg-fg-subtle/30'}`} />
          ))}
        </div>
      </div>
    </div>
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
