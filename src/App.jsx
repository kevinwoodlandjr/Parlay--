import { useState, useEffect } from 'react'
import { ParlayProvider, useParlay } from './hooks/useParlayStore'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import { formatOdds } from './utils/odds'
import Header from './components/Header'
import GameCard from './components/GameCard'
import ParlaySlip from './components/ParlaySlip'
import SharedParlayView from './components/SharedParlayView'
import AuthPage from './components/AuthPage'
import ProfilePage from './components/ProfilePage'
import LandingPage from './components/LandingPage'
import ErrorBoundary from './components/ErrorBoundary'
import BookmakerSelector, { getSavedBookmaker, saveBookmaker } from './components/BookmakerSelector'
import OnboardingTooltip from './components/OnboardingTooltip'
import { fetchGames, clearOddsCache, getLastFetchTime, SPORTS } from './data/sportsApi'
import { format, addDays, subDays, isToday as checkIsToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Calendar, RefreshCw } from 'lucide-react'

function AppContent() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [sharedParlay, setSharedParlay] = useState(null)
  const [mobileSlipOpen, setMobileSlipOpen] = useState(false)
  const [page, setPage] = useState('landing') // landing | home | auth | profile
  const [selectedBookmaker, setSelectedBookmaker] = useState(getSavedBookmaker)
  const [lastFetchTime, setLastFetchTime] = useState(0)
  const [refreshCounter, setRefreshCounter] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedSport, setSelectedSport] = useState(() => localStorage.getItem('slipmate_sport') || 'nba')
  const { user } = useAuth()

  // Route authenticated users to home, unauthenticated to landing
  useEffect(() => {
    if (user) {
      if (page === 'auth' || page === 'landing') {
        setPage('home')
      }
    } else {
      if (page === 'home' || page === 'profile') {
        setPage('landing')
      }
    }
  }, [user])

  // Check for shared parlay in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('parlay')
    if (encoded) {
      setSharedParlay(encoded)
    }
  }, [])

  // Show onboarding for first-time users on home page
  useEffect(() => {
    if (page === 'home' && user && !localStorage.getItem('slipmate_onboarded')) {
      setShowOnboarding(true)
    } else {
      setShowOnboarding(false)
    }
  }, [page, user])

  // Fetch games when date changes (only when on home page)
  useEffect(() => {
    if (page !== 'home') return
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchGames(selectedDate, selectedSport)
      .then(data => {
        if (!cancelled) {
          setGames(data)
          setLoading(false)
          setLastFetchTime(getLastFetchTime(selectedSport) || Date.now())
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError('Failed to load games.')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [selectedDate, page, refreshCounter, selectedSport])

  // Tick counter to keep "X min ago" fresh
  const [, setTick] = useState(0)
  useEffect(() => {
    if (page !== 'home' || !lastFetchTime) return
    const interval = setInterval(() => setTick(t => t + 1), 30_000)
    return () => clearInterval(interval)
  }, [page, lastFetchTime])

  const handleRefreshOdds = () => {
    clearOddsCache()
    setRefreshCounter(c => c + 1)
  }

  const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY

  const goToDay = (offset) => {
    setSelectedDate(prev => offset > 0 ? addDays(prev, offset) : subDays(prev, Math.abs(offset)))
  }

  const isToday = checkIsToday(selectedDate)

  // Collect all available bookmakers across loaded games
  const allBookmakers = [...new Set(games.flatMap(g => g.availableBookmakers || []))]

  const handleBookmakerChange = (key) => {
    setSelectedBookmaker(key)
    saveBookmaker(key)
  }

  const handleSportChange = (sport) => {
    setSelectedSport(sport)
    localStorage.setItem('slipmate_sport', sport)
  }

  const sportConfig = SPORTS[selectedSport]

  // Page routing
  if (page === 'landing') {
    return <LandingPage onAuth={() => setPage('auth')} />
  }

  if (page === 'auth') {
    return <AuthPage onBack={() => setPage(user ? 'home' : 'landing')} />
  }

  if (page === 'profile') {
    return <ProfilePage onBack={() => setPage('home')} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onProfileClick={() => setPage('profile')}
        onAuthClick={() => setPage('auth')}
        onHomeClick={() => setPage('landing')}
      />

      {/* Shared parlay overlay */}
      {sharedParlay && (
        <SharedParlayView
          encoded={sharedParlay}
          onDismiss={() => {
            setSharedParlay(null)
            window.history.replaceState({}, '', window.location.pathname)
          }}
        />
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-5">
        {/* Sport selector */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {Object.entries(SPORTS).map(([key, sport]) => (
            <button
              key={key}
              onClick={() => handleSportChange(key)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer
                ${selectedSport === key
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-overlay text-fg-muted hover:bg-overlay-hover hover:text-fg'
                }
              `}
            >
              <span className="mr-1.5">{sport.emoji}</span>
              {sport.label}
            </button>
          ))}
        </div>

        {/* Date navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => goToDay(-1)}
            className="p-2 rounded-lg bg-overlay hover:bg-overlay-hover text-fg-muted hover:text-fg transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <h2 className="text-fg font-bold text-lg leading-tight">
              {isToday ? "Today's Games" : format(selectedDate, 'EEEE')}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <p className="text-fg-subtle text-sm flex items-center gap-1.5">
                <Calendar size={12} />
                {format(selectedDate, 'MMM d, yyyy')}
              </p>
              {!isToday && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="text-accent text-xs font-semibold hover:underline cursor-pointer"
                >
                  Today
                </button>
              )}
            </div>
            {/* Odds freshness indicator */}
            <OddsFreshnessIndicator
              lastFetchTime={lastFetchTime}
              hasApiKey={!!ODDS_API_KEY}
              loading={loading}
              onRefresh={handleRefreshOdds}
            />
          </div>

          <button
            onClick={() => goToDay(1)}
            className="p-2 rounded-lg bg-overlay hover:bg-overlay-hover text-fg-muted hover:text-fg transition-colors cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Main layout: Games + Slip */}
        <div className="xl:grid xl:grid-cols-[1fr_320px] xl:gap-6 items-start">
          {/* Games column */}
          <div className="min-w-0 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="animate-spin text-accent" size={28} />
                <p className="text-fg-subtle text-sm">Loading games...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16 gap-3 text-fg-muted">
                <AlertCircle size={18} />
                <p className="text-sm">{error}</p>
              </div>
            ) : games.length === 0 && !loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-overlay rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{sportConfig.emoji}</span>
                </div>
                <p className="text-fg-muted font-semibold">No games scheduled</p>
                <p className="text-fg-subtle text-sm mt-1">Try checking another date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allBookmakers.length > 0 && (
                  <BookmakerSelector
                    availableBookmakers={allBookmakers}
                    selected={selectedBookmaker}
                    onSelect={handleBookmakerChange}
                  />
                )}
                <div className="space-y-2" data-onboard="game-cards">
                  {games.map(game => (
                    <GameCard key={game.id} game={game} selectedBookmaker={selectedBookmaker} sport={selectedSport} />
                  ))}
                </div>
                <p className="text-[10px] text-fg-subtle text-center pt-3 pb-1">
                  Odds for planning purposes • Tap any cell to add to your parlay
                </p>
              </div>
            )}
          </div>

          {/* Parlay slip - desktop sidebar */}
          <div className="hidden xl:block sticky top-20" data-onboard="parlay-slip">
            <ParlaySlip onAuthRequired={() => setPage('auth')} />
          </div>
        </div>
      </main>

      {/* Mobile slip toggle */}
      <MobileSlipToggle
        open={mobileSlipOpen}
        onToggle={() => setMobileSlipOpen(!mobileSlipOpen)}
      />

      {/* Mobile slip drawer */}
      {mobileSlipOpen && (
        <div className="xl:hidden fixed inset-0 z-[90]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileSlipOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-bg rounded-t-2xl border-t border-border">
            <div className="p-4 pb-6">
              <div className="w-10 h-1 bg-fg-subtle rounded-full mx-auto mb-4" />
              <ParlaySlip onAuthRequired={() => { setMobileSlipOpen(false); setPage('auth') }} />
            </div>
          </div>
        </div>
      )}

      {/* Onboarding walkthrough */}
      {showOnboarding && <OnboardingTooltip />}

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-6 mb-16 xl:mb-0">
        <p className="text-center text-fg-subtle text-[11px]">
          Parlay — Sports Parlay Generator • Odds for entertainment purposes
        </p>
      </footer>
    </div>
  )
}

function OddsFreshnessIndicator({ lastFetchTime, hasApiKey, loading, onRefresh }) {
  if (!hasApiKey) {
    return (
      <div className="flex items-center justify-center gap-1.5 mt-1">
        <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
        <span className="text-fg-subtle text-[11px]">Sample data</span>
      </div>
    )
  }

  if (!lastFetchTime) return null

  const ageMs = Date.now() - lastFetchTime
  const ageMin = Math.floor(ageMs / 60_000)

  // Green < 5 min, yellow 5-15 min, gray > 15 min
  let dotColor = '#22c55e'
  if (ageMin >= 15) {
    dotColor = '#6b7280'
  } else if (ageMin >= 5) {
    dotColor = '#eab308'
  }

  const label = ageMin < 1 ? 'just now' : `${ageMin} min ago`

  return (
    <div className="flex items-center justify-center gap-1.5 mt-1">
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: dotColor }}
      />
      <span className="text-fg-subtle text-[11px]">
        Odds updated {label}
      </span>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="ml-1 p-0.5 rounded hover:bg-overlay transition-colors cursor-pointer disabled:opacity-40"
        title="Refresh odds"
      >
        <RefreshCw size={11} className={`text-fg-subtle ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}

function MobileSlipToggle({ open, onToggle }) {
  const { legs, parlayOdds } = useParlay()

  if (legs.length === 0) return null

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-[80]">
      <button
        onClick={onToggle}
        className="w-full bg-accent hover:bg-accent-hover text-white py-3 px-4 flex items-center justify-between font-semibold cursor-pointer shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="w-6 h-6 bg-fg-subtle rounded-full flex items-center justify-center text-xs font-bold">
            {legs.length}
          </span>
          <span className="text-sm">View Parlay Slip</span>
        </span>
        <span className="text-sm font-bold">
          {formatOdds(parlayOdds)}
        </span>
      </button>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ParlayProvider>
            <AppContent />
          </ParlayProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
