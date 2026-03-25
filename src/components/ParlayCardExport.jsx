import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, Copy, Check } from 'lucide-react'
import { formatOdds, formatCurrency } from '../utils/odds'

const COLORS = {
  bg: '#171729',
  surface: '#1e1e36',
  gold: '#C8962E',
  lightGold: '#E8C468',
  green: '#34d399',
  text: '#e0e0e0',
  muted: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.06)',
}

const CARD_WIDTH = 600
const PADDING = 36
const LEG_HEIGHT = 72
const HEADER_HEIGHT = 120
const FOOTER_HEIGHT = 160
const WATERMARK_HEIGHT = 48

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawCard(ctx, { legs, wager, parlayOdds, potentialPayout }) {
  const legsSection = legs.length * LEG_HEIGHT + 24
  const cardHeight = HEADER_HEIGHT + legsSection + FOOTER_HEIGHT + WATERMARK_HEIGHT + PADDING * 2
  const canvas = ctx.canvas
  canvas.width = CARD_WIDTH * 2
  canvas.height = cardHeight * 2
  ctx.scale(2, 2)

  // Background
  ctx.fillStyle = COLORS.bg
  drawRoundedRect(ctx, 0, 0, CARD_WIDTH, cardHeight, 20)
  ctx.fill()

  // Outer border
  ctx.strokeStyle = 'rgba(200,150,46,0.25)'
  ctx.lineWidth = 1.5
  drawRoundedRect(ctx, 1, 1, CARD_WIDTH - 2, cardHeight - 2, 20)
  ctx.stroke()

  // Top accent line
  ctx.fillStyle = COLORS.gold
  drawRoundedRect(ctx, 0, 0, CARD_WIDTH, 5, 0)
  ctx.fill()

  let y = PADDING

  // SlipMate branding
  ctx.fillStyle = COLORS.gold
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('SLIPMATE', PADDING, y + 14)

  // Date on the right
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  ctx.fillStyle = COLORS.muted
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(dateStr, CARD_WIDTH - PADDING, y + 14)

  y += 36

  // PARLAY SLIP header
  ctx.textAlign = 'left'
  ctx.fillStyle = COLORS.text
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText('PARLAY SLIP', PADDING, y + 28)

  // Leg count badge
  const badgeText = `${legs.length} LEGS`
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  const badgeWidth = ctx.measureText(badgeText).width + 20
  const badgeX = PADDING + ctx.measureText('PARLAY SLIP').width + 16
  // Reset font to measure PARLAY SLIP width at 28px
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  const headerWidth = ctx.measureText('PARLAY SLIP').width
  const bx = PADDING + headerWidth + 16

  ctx.fillStyle = 'rgba(200,150,46,0.15)'
  drawRoundedRect(ctx, bx, y + 8, ctx.measureText(badgeText).width + 24, 26, 13)
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  const bw = ctx.measureText(badgeText).width + 24
  drawRoundedRect(ctx, bx, y + 8, bw, 26, 13)
  ctx.fill()
  ctx.fillStyle = COLORS.gold
  ctx.fillText(badgeText, bx + 12, y + 25)

  y += 56

  // Divider
  ctx.strokeStyle = COLORS.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PADDING, y)
  ctx.lineTo(CARD_WIDTH - PADDING, y)
  ctx.stroke()

  y += 16

  // Legs
  legs.forEach((leg, i) => {
    const legY = y + i * LEG_HEIGHT

    // Leg number circle
    ctx.fillStyle = 'rgba(200,150,46,0.12)'
    ctx.beginPath()
    ctx.arc(PADDING + 14, legY + 20, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = COLORS.gold
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${i + 1}`, PADDING + 14, legY + 24)

    // Description
    ctx.textAlign = 'left'
    ctx.fillStyle = COLORS.text
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    const desc = leg.description || 'Pick'
    const maxDescWidth = CARD_WIDTH - PADDING * 2 - 120
    let displayDesc = desc
    while (ctx.measureText(displayDesc).width > maxDescWidth && displayDesc.length > 3) {
      displayDesc = displayDesc.slice(0, -4) + '...'
    }
    ctx.fillText(displayDesc, PADDING + 38, legY + 24)

    // Matchup
    const matchup = leg.game
      ? `${leg.game.awayTeam?.abbreviation || '???'} @ ${leg.game.homeTeam?.abbreviation || '???'}`
      : ''
    ctx.fillStyle = COLORS.muted
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.fillText(matchup, PADDING + 38, legY + 44)

    // Odds badge
    const oddsText = formatOdds(leg.odds)
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    const oddsWidth = ctx.measureText(oddsText).width + 20
    const oddsX = CARD_WIDTH - PADDING - oddsWidth
    ctx.fillStyle = 'rgba(200,150,46,0.1)'
    drawRoundedRect(ctx, oddsX, legY + 10, oddsWidth, 28, 8)
    ctx.fill()
    ctx.fillStyle = COLORS.lightGold
    ctx.textAlign = 'center'
    ctx.fillText(oddsText, oddsX + oddsWidth / 2, legY + 29)

    // Separator line between legs
    if (i < legs.length - 1) {
      ctx.strokeStyle = COLORS.border
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PADDING + 38, legY + LEG_HEIGHT - 4)
      ctx.lineTo(CARD_WIDTH - PADDING, legY + LEG_HEIGHT - 4)
      ctx.stroke()
    }
  })

  y += legs.length * LEG_HEIGHT + 8

  // Divider before footer
  ctx.strokeStyle = 'rgba(200,150,46,0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PADDING, y)
  ctx.lineTo(CARD_WIDTH - PADDING, y)
  ctx.stroke()

  y += 20

  // Footer: Wager / Odds / Payout
  const colWidth = (CARD_WIDTH - PADDING * 2) / 3

  // Wager
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.muted
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText('WAGER', PADDING + colWidth * 0.5, y)
  ctx.fillStyle = COLORS.text
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText(formatCurrency(wager), PADDING + colWidth * 0.5, y + 30)

  // Combined odds
  ctx.fillStyle = COLORS.muted
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText('COMBINED ODDS', PADDING + colWidth * 1.5, y)
  ctx.fillStyle = COLORS.lightGold
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText(formatOdds(parlayOdds), PADDING + colWidth * 1.5, y + 30)

  // Potential payout
  ctx.fillStyle = COLORS.muted
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText('POTENTIAL PAYOUT', PADDING + colWidth * 2.5, y)
  ctx.fillStyle = COLORS.green
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.fillText(formatCurrency(potentialPayout), PADDING + colWidth * 2.5, y + 30)

  y += 60

  // Payout highlight bar
  ctx.fillStyle = 'rgba(52,211,153,0.08)'
  drawRoundedRect(ctx, PADDING, y, CARD_WIDTH - PADDING * 2, 40, 10)
  ctx.fill()
  ctx.strokeStyle = 'rgba(52,211,153,0.15)'
  ctx.lineWidth = 1
  drawRoundedRect(ctx, PADDING, y, CARD_WIDTH - PADDING * 2, 40, 10)
  ctx.stroke()
  ctx.fillStyle = COLORS.green
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    `Win ${formatCurrency(potentialPayout)} on a ${formatCurrency(wager)} bet`,
    CARD_WIDTH / 2,
    y + 25
  )

  y += 56

  // Watermark
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Built with SlipMate', CARD_WIDTH / 2, y + 10)

  return cardHeight
}

export default function ParlayCardExport({ legs, wager, parlayOdds, potentialPayout, onClose }) {
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [cardHeight, setCardHeight] = useState(600)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const h = drawCard(ctx, { legs, wager, parlayOdds, potentialPayout })
    setCardHeight(h)
  }, [legs, wager, parlayOdds, potentialPayout])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `slipmate-parlay-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopyImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: download instead
      handleDownload()
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
          <h3 className="text-fg font-bold text-base">Export Parlay Card</h3>
          <button onClick={onClose} className="text-fg-subtle hover:text-fg transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="rounded-xl overflow-hidden border border-border flex justify-center bg-[#0d0d1a]">
            <canvas
              ref={canvasRef}
              style={{ width: 300, height: cardHeight * (300 / CARD_WIDTH) }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30"
            >
              <Download size={16} />
              Download PNG
            </button>
            <button
              onClick={handleCopyImage}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm
                ${copied
                  ? 'bg-green/20 text-green border border-green/30'
                  : 'bg-overlay hover:bg-overlay-hover text-fg-muted border border-border'
                }`}
            >
              {copied ? (
                <><Check size={16} /> Copied!</>
              ) : (
                <><Copy size={16} /> Copy to Clipboard</>
              )}
            </button>
          </div>

          <p className="text-fg-subtle text-[10px] text-center leading-relaxed">
            Save or share your parlay card on social media
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
