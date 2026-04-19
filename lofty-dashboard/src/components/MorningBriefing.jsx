import { useState, useEffect, useCallback, useRef } from 'react'
import { Sun, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { generateBriefingInsights, createLeadInsightFromEvent } from '../data/briefingEngine'

/**
 * MorningBriefing — AI-synthesized daily summary.
 *
 * Sits below LiveActivityFeed. Combines Hot Sheets, Updates, and Live Feed
 * into warm, conversational insight cards organized by category.
 * Each card can be dismissed; once all are dismissed the section collapses.
 *
 * Props:
 *   widgetColumns   — current widget data (3-column array)
 *   liveActivities  — real-time lead interactions
 */
export default function MorningBriefing({ widgetColumns, liveActivities }) {
  const { user } = useAuth()
  const agentName = user?.full_name?.split(' ')[0] || 'there'

  const [insights, setInsights] = useState([])
  const [collapsed, setCollapsed] = useState(false)
  const [fullyDismissed, setFullyDismissed] = useState(false)
  const [exitingIds, setExitingIds] = useState(new Set())
  const prevHighInterestCount = useRef(0)

  // Generate insights on mount and when widget data changes
  useEffect(() => {
    const generated = generateBriefingInsights(widgetColumns, liveActivities, agentName)
    setInsights(prev => {
      // Preserve dismissed state for existing insights
      if (prev.length === 0) return generated
      const dismissedIds = new Set(prev.filter(i => i.dismissed).map(i => i.id))
      return generated.map(g => ({
        ...g,
        dismissed: dismissedIds.has(g.id),
      }))
    })
  }, [widgetColumns]) // eslint-disable-line react-hooks/exhaustive-deps

  // Inject new LEAD insights from live events
  useEffect(() => {
    const highInterest = liveActivities.filter(a => a.isHighInterest)
    if (highInterest.length > prevHighInterestCount.current && prevHighInterestCount.current > 0) {
      const newest = highInterest[0]
      const newInsight = createLeadInsightFromEvent(newest)
      setInsights(prev => {
        // Don't add if a live insight for this lead already exists
        if (prev.some(i => i.id.startsWith('briefing-live-') && i.narrative.includes(newest.name))) {
          return prev
        }
        return [newInsight, ...prev]
      })
    }
    prevHighInterestCount.current = highInterest.length
  }, [liveActivities])

  const handleDismiss = useCallback((id) => {
    setExitingIds(prev => new Set([...prev, id]))

    // Wait for exit animation before actually removing
    setTimeout(() => {
      setInsights(prev => {
        const updated = prev.map(i => i.id === id ? { ...i, dismissed: true } : i)
        const allDone = updated.every(i => i.dismissed)
        if (allDone) {
          setTimeout(() => setFullyDismissed(true), 400)
        }
        return updated
      })
      setExitingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 350)
  }, [])

  const activeInsights = insights.filter(i => !i.dismissed)
  const totalCount = insights.length
  const dismissedCount = insights.filter(i => i.dismissed).length

  // Don't render if everything is dismissed
  if (fullyDismissed || insights.length === 0) return null

  const greeting = getGreeting()

  return (
    <div
      className={`mb-5 rounded-2xl overflow-hidden briefing-container ${fullyDismissed ? 'briefing-collapse' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF7ED 30%, #FFF1E6 60%, #FFFBF5 100%)',
        border: '1px solid #FED7AA',
        boxShadow: '0 2px 12px rgba(251, 146, 60, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer"
        style={{ borderBottom: collapsed ? 'none' : '1px solid #FFEDD5' }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 briefing-sun-glow"
            style={{
              background: 'linear-gradient(135deg, #FDE68A, #FDBA74)',
              boxShadow: '0 2px 10px rgba(251, 146, 60, 0.3)',
            }}
          >
            <Sun size={20} color="#C2410C" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              {greeting}, {agentName}!
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: 'linear-gradient(135deg, #FEF3C7, #FFEDD5)',
                  color: '#B45309',
                  border: '1px solid #FCD34D',
                }}
              >
                <Sparkles size={10} className="inline mr-1" style={{ verticalAlign: '-1px' }} />
                AI Briefing
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {activeInsights.length === 0
                ? 'All caught up — great work!'
                : `AOS analyzed overnight activity — ${activeInsights.length} insight${activeInsights.length !== 1 ? 's' : ''} for you`
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress indicator */}
          {totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {insights.map((ins) => (
                  <div
                    key={ins.id}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      background: ins.dismissed ? '#10B981' : `${ins.category.color}40`,
                      border: ins.dismissed ? 'none' : `1px solid ${ins.category.color}60`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-400">
                {dismissedCount}/{totalCount}
              </span>
            </div>
          )}

          {collapsed ? (
            <ChevronDown size={16} color="#94A3B8" />
          ) : (
            <ChevronUp size={16} color="#94A3B8" />
          )}
        </div>
      </div>

      {/* ── Insight Cards ── */}
      {!collapsed && (
        <div className="px-5 pb-4 pt-2 flex flex-col gap-3">
          {activeInsights.map((insight, idx) => {
            const Cat = insight.category
            const Icon = Cat.icon
            const isExiting = exitingIds.has(insight.id)
            const isNew = insight.isNew

            return (
              <div
                key={insight.id}
                className={`
                  briefing-card
                  ${isExiting ? 'briefing-card-exit' : 'briefing-card-enter'}
                  ${isNew ? 'briefing-card-new' : ''}
                `}
                style={{
                  animationDelay: isExiting ? '0ms' : `${idx * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <div
                  className="rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                  style={{
                    background: 'white',
                    border: `1px solid ${Cat.borderColor}`,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Category icon */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: Cat.bgLight,
                        border: `1px solid ${Cat.borderColor}`,
                      }}
                    >
                      <Icon size={16} color={Cat.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                          style={{
                            background: Cat.bgLight,
                            color: Cat.color,
                            border: `1px solid ${Cat.borderColor}`,
                          }}
                        >
                          {Cat.label}
                        </span>
                        {isNew && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded"
                            style={{ background: '#DCFCE7', color: '#16A34A' }}
                          >
                            JUST IN
                          </span>
                        )}
                        <div className="flex items-center gap-1 ml-auto">
                          {insight.sources.map(src => (
                            <span
                              key={src}
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: '#F8FAFC', color: '#94A3B8', border: '1px solid #E2E8F0' }}
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        {insight.narrative}
                      </p>
                    </div>

                    {/* Dismiss button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDismiss(insight.id)
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-[1.04] mt-0.5"
                      style={{
                        background: '#F0FDF4',
                        color: '#16A34A',
                        border: '1px solid #BBF7D0',
                      }}
                    >
                      <Check size={12} />
                      Got it
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* All-done state (shows briefly before collapse) */}
          {activeInsights.length === 0 && !fullyDismissed && (
            <div className="flex items-center justify-center gap-2 py-4 briefing-card-enter">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                <Check size={16} color="white" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-medium text-gray-600">
                All caught up! Your briefing is complete.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
