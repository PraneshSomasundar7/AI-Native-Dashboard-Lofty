import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Brain, Sparkles, AlertCircle, Eye, TrendingUp,
  MessageSquare, Send, Pencil, X, CheckCircle2, Loader2,
} from 'lucide-react'

/**
 * AOS Action Zone
 * - Auto-expands when liveAlert arrives from InsForge realtime
 * - Shows AI-generated SMS draft (streams in as aiMessage populates)
 * - No fake "Simulate AI Trigger" button
 */
export default function AOSActionZone({ onActionComplete, liveAlert, onAlertDismiss }) {
  const { user } = useAuth()
  const agentFirstName = user?.full_name?.split(' ')[0] || 'Agent'

  const [phase, setPhase] = useState('collapsed')

  // Derive liveAlert fields BEFORE any callbacks that reference them
  const leadName      = liveAlert?.leadName      ?? 'Unknown Lead'
  const propertyTitle = liveAlert?.propertyTitle ?? 'a property'
  const leadScore     = liveAlert?.leadScore      ?? 0
  const viewCount     = liveAlert?.viewCount      ?? 0
  const aiMessage     = liveAlert?.aiMessage      ?? null   // null = still generating
  const firstName     = leadName.split(' ')[0]

  useEffect(() => {
    if (liveAlert) setPhase('idle')
  }, [liveAlert])

  const handleSend = useCallback(() => {
    setPhase('sending')
    setTimeout(() => {
      setPhase('success')
      onActionComplete?.(aiMessage)
      setTimeout(() => setPhase('collapsed'), 1800)
    }, 1500)
  }, [onActionComplete, aiMessage])

  const handleDismiss = () => {
    setPhase('collapsed')
    onAlertDismiss?.()
  }

  const isExpanded = phase !== 'collapsed'

  const triggerReason = leadScore >= 70
    ? `lead score reached ${leadScore}`
    : `viewed this property ${viewCount} time${viewCount !== 1 ? 's' : ''}`

  // Slim monitoring bar when idle and no alert pending
  if (phase === 'collapsed' && !liveAlert) {
    return (
      <div className="mt-6 mb-2 flex items-center gap-2.5 px-5 py-3 rounded-2xl"
        style={{ background: 'white', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: '#22C55E' }} />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5"
            style={{ background: '#16A34A' }} />
        </span>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">AOS</span> is monitoring your pipeline — all clear
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 mb-3">
      <div className={`rounded-2xl overflow-hidden transition-all duration-500 ${
        isExpanded
          ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-200/60 shadow-[0_4px_24px_rgba(59,130,246,0.12)]'
          : 'bg-white border border-amber-300 shadow-sm hover:shadow-[0_4px_12px_rgba(251,191,36,0.15)]'
      }`}>
        {/* Banner */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isExpanded ? 'linear-gradient(135deg, #3B82F6, #06B6D4)' : 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                boxShadow: isExpanded ? '0 2px 10px rgba(59,130,246,0.3)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
              }}>
              <Brain size={20} color={isExpanded ? 'white' : '#D97706'} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {phase === 'success' ? '✅ Action Complete'
                  : phase === 'collapsed' ? '🚨 New Alert'
                  : `Good Morning, ${agentFirstName}`}
              </p>
              <p className="text-xs text-gray-500">
                {phase === 'collapsed' && `${leadName} is showing high interest`}
                {phase === 'idle'      && 'AOS detected a high-interest lead — review and send'}
                {phase === 'sending'   && `Delivering message to ${firstName}...`}
                {phase === 'success'   && `SMS delivered · ${firstName} moved to "Contacted"`}
              </p>
            </div>
          </div>

          {phase === 'collapsed' && liveAlert && (
            <button onClick={() => setPhase('idle')}
              className="trigger-pulse flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer hover:scale-[1.03] transition-transform"
              style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: 'white', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>
              <Sparkles size={15} /> View Alert
            </button>
          )}
        </div>

        {/* Expanded card */}
        {isExpanded && (
          <div className="ai-card-enter px-5 pb-5">
            <div className={`rounded-xl p-5 transition-all duration-300 ${phase === 'success' ? 'success-card-flash' : ''}`}
              style={{ background: 'white', border: `1px solid ${phase === 'success' ? '#6EE7B7' : '#BAE6FD'}`, boxShadow: '0 2px 12px rgba(59,130,246,0.08)' }}>

              {/* SUCCESS */}
              {phase === 'success' && (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center success-pop success-glow"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    <CheckCircle2 size={32} color="white" strokeWidth={2.5} />
                  </div>
                  <p className="text-lg font-bold text-gray-800 success-pop" style={{ animationDelay: '0.1s' }}>Message Delivered!</p>
                  <p className="text-sm text-gray-500 success-pop" style={{ animationDelay: '0.2s' }}>SMS sent to {leadName} · Task auto-resolved</p>
                </div>
              )}

              {/* IDLE / SENDING */}
              {(phase === 'idle' || phase === 'sending') && (
                <>
                  {/* Alert header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '1px solid #FCD34D' }}>
                      <AlertCircle size={20} color="#D97706" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                          style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' }}>
                          🚨 HIGH INTEREST ALERT
                        </span>
                        <span className="text-xs text-gray-400">Just now</span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        <strong className="text-gray-800">{leadName}</strong> is showing high interest in{' '}
                        <strong>{propertyTitle}</strong> —{' '}
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold"
                          style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                          <TrendingUp size={11} /> {triggerReason}
                        </span>
                        {viewCount >= 3 && (
                          <>{' '}·{' '}
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold"
                              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                              <Eye size={11} /> {viewCount} views
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* AI-generated SMS draft */}
                  <div className="rounded-lg px-4 py-3 mb-4"
                    style={{ background: '#F8FAFC', border: `1px solid ${phase === 'sending' ? '#93C5FD' : '#E2E8F0'}`, transition: 'border-color 0.3s' }}>
                    <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                      <MessageSquare size={12} />
                      AI-DRAFTED SMS
                      {aiMessage === null && (
                        <span className="flex items-center gap-1 ml-1 text-indigo-400">
                          <Loader2 size={11} className="animate-spin" /> generating…
                        </span>
                      )}
                    </p>
                    {aiMessage === null ? (
                      <div className="space-y-1.5 animate-pulse">
                        <div className="h-3 w-full rounded bg-gray-100" />
                        <div className="h-3 w-5/6 rounded bg-gray-100" />
                        <div className="h-3 w-3/4 rounded bg-gray-100" />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">"{aiMessage}"</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={phase === 'idle' ? handleSend : undefined}
                      disabled={phase === 'sending' || aiMessage === null}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${
                        phase === 'sending' ? 'btn-sending cursor-not-allowed opacity-90'
                        : aiMessage === null ? 'cursor-not-allowed opacity-50 bg-blue-300'
                        : 'cursor-pointer hover:bg-blue-700 bg-blue-600 active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-lg hover:-translate-y-[1px]'
                      }`}
                    >
                      {phase === 'sending' ? <><Loader2 size={15} className="spin" /> Sending…</> : <><Send size={15} /> Send Now</>}
                    </button>

                    <button disabled={phase === 'sending'}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-slate-700 border border-slate-300 cursor-pointer hover:bg-slate-50 transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-[1px]"
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    <button onClick={phase === 'idle' ? handleDismiss : undefined} disabled={phase === 'sending'}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 bg-transparent cursor-pointer hover:text-slate-800 transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
                    >
                      <X size={14} /> Dismiss
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
