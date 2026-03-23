import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Sparkles, Send, Loader2 } from 'lucide-react'

export default function AIAdvisor({ legs, wager, parlayOdds, onClose }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState(null) // null | 'analyze' | 'advise'

  const callAI = async (aiMode, userQuestion) => {
    setLoading(true)
    setError(null)
    setMode(aiMode)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legs: legs.map(l => ({
            description: l.description,
            odds: l.odds,
            type: l.type,
            pick: l.pick,
            game: l.game ? {
              homeTeam: { abbreviation: l.game.homeTeam?.abbreviation, name: l.game.homeTeam?.name },
              awayTeam: { abbreviation: l.game.awayTeam?.abbreviation, name: l.game.awayTeam?.name },
            } : null,
          })),
          wager,
          parlayOdds,
          mode: aiMode,
          question: userQuestion,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setAnalysis(data.analysis)
      }
    } catch (err) {
      setError('Failed to connect to AI service. Make sure ANTHROPIC_API_KEY is set in Vercel.')
    }

    setLoading(false)
  }

  const handleAsk = () => {
    if (question.trim()) {
      callAI('advise', question.trim())
      setQuestion('')
    }
  }

  // Simple markdown-like rendering for bold text
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-fg font-semibold">{part.slice(2, -2)}</strong>
        }
        return part
      })
      return <p key={i} className={`${line === '' ? 'h-2' : ''}`}>{parts}</p>
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h3 className="text-fg font-bold text-base">AI Parlay Advisor</h3>
          </div>
          <button onClick={onClose} className="text-fg-subtle hover:text-fg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!analysis && !loading && !error && (
            <>
              {/* Initial state — show action buttons */}
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={24} className="text-accent" />
                </div>
                <p className="text-fg font-semibold">What would you like to know?</p>
                <p className="text-fg-subtle text-sm mt-1">AI will analyze your {legs.length}-leg parlay</p>
              </div>

              <button
                onClick={() => callAI('analyze')}
                className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm"
              >
                Analyze My Parlay
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface px-3 text-fg-subtle text-xs">or ask a question</span>
                </div>
              </div>
            </>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 size={28} className="animate-spin text-accent" />
              <p className="text-fg-muted text-sm">
                {mode === 'analyze' ? 'Analyzing your parlay...' : 'Thinking...'}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
              <p className="text-accent text-sm">{error}</p>
              <button
                onClick={() => { setError(null); setAnalysis(null); setMode(null) }}
                className="text-accent/70 text-xs mt-2 hover:underline cursor-pointer"
              >
                Try again
              </button>
            </div>
          )}

          {/* Analysis result */}
          {analysis && !loading && (
            <div className="bg-overlay rounded-xl border border-border p-4 space-y-2 text-fg-muted text-sm leading-relaxed">
              {renderText(analysis)}
            </div>
          )}

          {/* New analysis button */}
          {analysis && !loading && (
            <button
              onClick={() => callAI('analyze')}
              className="w-full bg-overlay hover:bg-overlay-hover text-fg-muted font-semibold py-2.5 rounded-xl transition-colors cursor-pointer text-sm border border-border"
            >
              Re-analyze
            </button>
          )}
        </div>

        {/* Ask input — always visible */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask about your parlay..."
              className="flex-1 bg-overlay border border-border rounded-xl px-4 py-2.5 text-fg text-sm placeholder:text-fg-subtle outline-none focus:border-accent/50 transition-colors"
            />
            <button
              onClick={handleAsk}
              disabled={!question.trim() || loading}
              className="w-10 h-10 bg-accent hover:bg-accent-hover disabled:opacity-30 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
