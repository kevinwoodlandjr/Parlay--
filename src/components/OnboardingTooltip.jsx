import { useState, useEffect } from 'react'

const STORAGE_KEY = 'slipmate_onboarded'

const STEPS = [
  {
    title: 'Pick Your Odds',
    body: 'Tap any odds cell to add a leg to your parlay',
    target: 'game-cards',    // selector hint
    pointDown: true,
  },
  {
    title: 'Build Your Slip',
    body: 'See your picks, combined odds, and potential payout',
    target: 'parlay-slip',
    pointDown: false,
  },
  {
    title: 'Export & Share',
    body: 'Save, share, or export to your sportsbook',
    target: 'action-buttons',
    pointDown: false,
  },
]

function getTargetRect(stepIndex) {
  const selectors = {
    0: '[data-onboard="game-cards"]',
    1: '[data-onboard="parlay-slip"]',
    2: '[data-onboard="action-buttons"]',
  }
  const el = document.querySelector(selectors[stepIndex])
  if (el) {
    return el.getBoundingClientRect()
  }
  // Fallback positions when the elements don't exist yet
  const fallbacks = [
    { top: 220, left: 40, width: 340, height: 260 },
    { top: 220, left: window.innerWidth - 360, width: 320, height: 300 },
    { top: 520, left: window.innerWidth - 360, width: 320, height: 60 },
  ]
  return fallbacks[stepIndex]
}

export default function OnboardingTooltip() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [rect, setRect] = useState(null)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    // Small delay so the page content renders first
    const timer = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) return
    const update = () => setRect(getTargetRect(step))
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [step, visible])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      dismiss()
    }
  }

  if (!visible || !rect) return null

  const current = STEPS[step]
  const spotPadding = 12

  // Tooltip positioning: below target if pointDown, above otherwise
  const tooltipStyle = {}
  if (current.pointDown) {
    tooltipStyle.top = rect.top + rect.height + spotPadding + 16
    tooltipStyle.left = Math.max(16, rect.left + rect.width / 2 - 160)
  } else {
    tooltipStyle.top = Math.max(16, rect.top - 16 - 170)
    tooltipStyle.left = Math.max(16, Math.min(rect.left + rect.width / 2 - 160, window.innerWidth - 336))
  }

  return (
    <div className="fixed inset-0 z-[200]" onClick={dismiss}>
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={rect.left - spotPadding}
              y={rect.top - spotPadding}
              width={rect.width + spotPadding * 2}
              height={rect.height + spotPadding * 2}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.65)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border ring */}
      <div
        className="absolute rounded-xl border-2 border-accent pointer-events-none"
        style={{
          top: rect.top - spotPadding,
          left: rect.left - spotPadding,
          width: rect.width + spotPadding * 2,
          height: rect.height + spotPadding * 2,
          boxShadow: '0 0 0 4px rgba(200,150,46,0.25)',
        }}
      />

      {/* Tooltip card */}
      <div
        className="absolute bg-surface border border-border rounded-xl shadow-2xl p-4 w-[320px]"
        style={{ top: tooltipStyle.top, left: tooltipStyle.left }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Arrow */}
        <div
          className="absolute w-3 h-3 bg-surface border-border rotate-45"
          style={current.pointDown
            ? { top: -6, left: '50%', marginLeft: -6, borderTop: '1px solid', borderLeft: '1px solid' }
            : { bottom: -6, left: '50%', marginLeft: -6, borderBottom: '1px solid', borderRight: '1px solid' }
          }
        />

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-fg font-bold text-sm">{current.title}</h3>
          <span className="text-fg-subtle text-xs font-medium">
            {step + 1}/{STEPS.length}
          </span>
        </div>

        <p className="text-fg-muted text-sm leading-relaxed mb-4">
          {current.body}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={dismiss}
            className="text-fg-subtle text-xs hover:text-fg transition-colors cursor-pointer"
          >
            Skip
          </button>

          <button
            onClick={next}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
            style={{ backgroundColor: '#C8962E', color: '#fff' }}
          >
            {step === STEPS.length - 1 ? 'Got It!' : 'Next'}
          </button>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ backgroundColor: i === step ? '#C8962E' : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
