import { useState, useEffect, useCallback } from 'react'
import { X, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    targetId: 'tour-navbar',
    title: 'Your Command Center',
    message: 'This is your Command Center. Access your People, Transactions, and Settings here.',
    scroll: false,
  },
  {
    targetId: 'section-aos',
    title: 'AOS Priority Zone',
    message: 'This is where the magic happens. Your AI assistant monitors your pipeline 24/7 and flags urgent actions here.',
    scroll: true,
  },
  {
    targetId: 'section-widgets',
    title: 'Your Traditional Tools',
    message: 'Your traditional tools are still here, now organized by priority.',
    scroll: true,
  },
  {
    targetId: 'section-live-feed',
    title: 'Live Activity Feed',
    message: 'Every buyer action — views, clicks, inquiries — appears here the moment it happens. No more guessing who is interested.',
    scroll: true,
  },
  {
    targetId: 'section-morning-briefing',
    title: 'Morning Briefing',
    message: 'Your AI reads your entire pipeline overnight and surfaces the 3 things that matter most. Start every day with a clear plan.',
    scroll: true,
  },
  {
    targetId: 'section-ai-command',
    title: 'AI Command Center',
    message: 'Ask your AI anything — "Who should I call today?", "Draft a follow-up for my Maple St. listing." It knows your full pipeline.',
    scroll: true,
  },
]

const PAD = 10
const TOOLTIP_W = 320
const TOOLTIP_GAP = 14
const TOOLTIP_H_EST = 210

export default function GuidedTour({ onComplete, agentName }) {
  const [showWelcome, setShowWelcome] = useState(true)
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState(null)
  const [visible, setVisible] = useState(false)

  const currentStep = STEPS[step]

  useEffect(() => {
    setVisible(false)
    const el = document.getElementById(currentStep.targetId)
    if (!el) return

    const measure = () => {
      const r = el.getBoundingClientRect()
      setRect(r)
      setVisible(true)
    }

    let tid
    if (currentStep.scroll) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      tid = setTimeout(measure, 480)
    } else {
      tid = setTimeout(measure, 80)
    }

    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(tid)
      window.removeEventListener('resize', measure)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = useCallback(() => {
    if (step >= STEPS.length - 1) {
      onComplete()
    } else {
      setVisible(false)
      setTimeout(() => setStep(s => s + 1), 160)
    }
  }, [step, onComplete])

  const handleSkip = useCallback(() => onComplete(), [onComplete])

  // ── Welcome screen (shown before the first tour step) ─────────────────────
  if (showWelcome) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(15, 23, 42, 0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="glass-card tour-tooltip-anim" style={{
          borderRadius: 24, padding: '40px 36px 32px',
          maxWidth: 420, width: '90%', textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(59,130,246,0.12)',
        }}>
          {/* Logo mark */}
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
          }}>
            <span style={{ fontSize: 26 }}>🏠</span>
          </div>

          <p style={{ fontSize: 13, fontWeight: 600, color: '#3B82F6', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Welcome to Lofty AI
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>
            Hello, {agentName}!
          </h2>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', margin: '0 0 12px' }}>
            Welcome to Onboarding
          </p>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, margin: '0 0 28px' }}>
            We'll walk you through your new AI-powered dashboard in just a few steps. It takes less than a minute.
          </p>

          {/* Progress dots — welcome is step 0 of 7 total */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 24 }}>
            <div style={{ width: 18, height: 6, borderRadius: 3, background: '#3B82F6' }} />
            {STEPS.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: '#E2E8F0' }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleSkip}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 12,
                border: '1px solid #E2E8F0', background: 'white',
                color: '#64748B', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Skip Tour
            </button>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                flex: 2, padding: '10px 0', borderRadius: 12,
                border: 'none', background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 2px 10px rgba(59,130,246,0.4)',
              }}
            >
              Let's Begin <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!visible || !rect) return null

  const spot = {
    top: Math.max(0, rect.top - PAD),
    left: Math.max(0, rect.left - PAD),
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  }

  const vw = window.innerWidth
  const vh = window.innerHeight

  const tooltipLeft = Math.min(
    Math.max(spot.left + spot.width / 2 - TOOLTIP_W / 2, 12),
    vw - TOOLTIP_W - 12
  )

  const spaceBelow = vh - (spot.top + spot.height)
  const tooltipTop = spaceBelow >= TOOLTIP_H_EST + TOOLTIP_GAP
    ? spot.top + spot.height + TOOLTIP_GAP
    : Math.max(8, spot.top - TOOLTIP_GAP - TOOLTIP_H_EST)

  const arrowBelow = spaceBelow >= TOOLTIP_H_EST + TOOLTIP_GAP

  const overlayBase = {
    position: 'fixed',
    background: 'rgba(15, 23, 42, 0.62)',
    zIndex: 9998,
    cursor: 'pointer',
  }

  return (
    <>
      {/* Four overlay strips — each strip click = skip */}
      <div style={{ ...overlayBase, top: 0, left: 0, right: 0, height: spot.top }} onClick={handleSkip} />
      <div style={{ ...overlayBase, top: spot.top + spot.height, left: 0, right: 0, bottom: 0 }} onClick={handleSkip} />
      <div style={{ ...overlayBase, top: spot.top, left: 0, width: spot.left, height: spot.height }} onClick={handleSkip} />
      <div style={{ ...overlayBase, top: spot.top, left: spot.left + spot.width, right: 0, height: spot.height }} onClick={handleSkip} />

      {/* Spotlight ring */}
      <div style={{
        position: 'fixed',
        top: spot.top,
        left: spot.left,
        width: spot.width,
        height: spot.height,
        borderRadius: 14,
        border: '2px solid rgba(59, 130, 246, 0.75)',
        boxShadow: '0 0 0 5px rgba(59, 130, 246, 0.18), 0 0 24px rgba(59,130,246,0.25)',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'all 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />

      {/* Tooltip card */}
      <div className="tour-tooltip-anim" style={{
        position: 'fixed',
        top: tooltipTop,
        left: tooltipLeft,
        width: TOOLTIP_W,
        zIndex: 10000,
        filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.22)) drop-shadow(0 4px 12px rgba(59,130,246,0.12))',
        transition: 'top 0.32s cubic-bezier(0.22,1,0.36,1), left 0.32s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Arrow — top when tooltip is below spotlight */}
        {arrowBelow && (
          <div style={{
            position: 'absolute',
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: '9px solid white',
          }} />
        )}
        {/* Arrow — bottom when tooltip is above spotlight */}
        {!arrowBelow && (
          <div style={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderTop: '9px solid white',
          }} />
        )}

        <div className="glass-card" style={{
          borderRadius: 16,
          padding: '18px 18px 14px',
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{step + 1}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>
                {currentStep.title}
              </span>
            </div>
            <button
              onClick={handleSkip}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94A3B8', padding: 4, lineHeight: 1, borderRadius: 6,
              }}
              aria-label="Skip tour"
            >
              <X size={15} />
            </button>
          </div>

          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, marginBottom: 14, marginTop: 0 }}>
            {currentStep.message}
          </p>

          {/* Step progress dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? '#3B82F6' : '#E2E8F0',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSkip}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: 'white',
                color: '#64748B',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              style={{
                flex: 2,
                padding: '8px 0',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
              }}
            >
              {step === STEPS.length - 1 ? "Let's Go!" : 'Next'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
