import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Sparkles, ArrowRight, Navigation } from 'lucide-react'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const NAV_PAGES = [
  'People', 'Transactions', 'Calendar', 'Listings',
  'Marketing', 'Reporting', 'Website', 'Marketplace', 'Settings',
]

// Maps section names the AI can reference → DOM element IDs for smooth scrolling
const SECTION_SCROLL_MAP = {
  'Morning Briefing':   'section-morning-briefing',
  'Live Feed':          'section-live-feed',
  'Live Activity':      'section-live-feed',
  'AOS':                'section-aos',
  'AI Alerts':          'section-aos',
  "Today's Tasks":      'section-today-s-tasks',
  'Tasks':              'section-today-s-tasks',
  'Keep In Touch':      'section-need-keep-in-touch',
  'Contacts':           'section-need-keep-in-touch',
  'Hot Sheets':         'section-hot-sheets',
  'Market Trends':      'section-hot-sheets',
  'New Updates':        'section-new-updates',
  'Updates':            'section-new-updates',
  'My Listings':        'section-my-listings',
  'Pipeline':           'section-transactions',
}

function scrollToSection(sectionName) {
  // Try exact match first, then case-insensitive
  const id = SECTION_SCROLL_MAP[sectionName]
    || Object.entries(SECTION_SCROLL_MAP).find(
         ([key]) => key.toLowerCase() === sectionName.toLowerCase()
       )?.[1]

  if (id) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Brief highlight flash
      el.style.transition = 'box-shadow 0.3s'
      el.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.3), 0 4px 20px rgba(99, 102, 241, 0.12)'
      el.style.borderRadius = '16px'
      setTimeout(() => { el.style.boxShadow = 'none' }, 1500)
      return true
    }
  }
  return false
}

function buildSystemPrompt(widgetData) {
  const tasks = widgetData?.tasks?.length
    ? widgetData.tasks.map(t => `- ${t.text}${t.tag ? ` [${t.tag}]` : ''}${t.done ? ' ✓' : ''}`).join('\n')
    : 'No tasks'

  const hotSheets = widgetData?.hotSheets?.length
    ? widgetData.hotSheets.map(h => `- ${h.label}: ${h.count} properties (trend: ${h.trend})`).join('\n')
    : 'No hot sheet data'

  const contacts = widgetData?.contacts?.length
    ? widgetData.contacts.map(c => `- ${c.name}: last contacted ${c.days} days ago, engagement score ${c.score}`).join('\n')
    : 'No contacts'

  const transactions = widgetData?.transactions?.length
    ? widgetData.transactions.map(t => `- ${t.address}: ${t.stage} at ${t.price} (${t.progress}% progress)`).join('\n')
    : 'No transactions'

  const listings = widgetData?.listings?.length
    ? widgetData.listings.map(l => `- ${l.address}: ${l.status} at ${l.price}, ${l.views} views`).join('\n')
    : 'No listings'

  // ── Morning Briefing insights ──
  const briefing = widgetData?.briefingInsights?.length
    ? widgetData.briefingInsights
        .filter(i => !i.dismissed)
        .map(i => `- [${i.category.label.toUpperCase()}] ${i.narrative}`)
        .join('\n')
    : 'No active briefing insights'

  // ── Live activity feed ──
  const liveActivity = widgetData?.liveActivities?.length
    ? widgetData.liveActivities.slice(0, 5)
        .map(a => `- ${a.name}: ${a.propertyTitle}${a.viewCount > 0 ? ` (${a.viewCount} views)` : ''}${a.leadScore > 0 ? ` [Score: ${a.leadScore}]` : ''}${a.isHighInterest ? ' ⚠️ HIGH INTEREST' : ''}`)
        .join('\n')
    : 'No recent live activity'

  return `You are the Lofty AI Command Center — an intelligent assistant built into a real estate CRM dashboard for agents.

## Your Core Jobs
1. **Dashboard Navigation** – Route the agent to any section of their dashboard instantly.
2. **Task Execution** – Help agents accomplish real estate tasks: drafting messages, summarizing market data, composing client outreach emails, prioritizing follow-ups, and more.
3. **Morning Briefing Expert** – You have full awareness of the AI Morning Briefing, which synthesizes overnight activity into personalized, strategic recommendations. When asked about the morning briefing, your priorities, or "what should I focus on", reference the briefing insights below — not just raw dashboard data.

## Available Navigation Targets

**Top-level Pages (navbar):** ${NAV_PAGES.join(', ')}

**Dashboard Sections (scroll to):** Morning Briefing, Live Feed, AOS, Today's Tasks, Keep In Touch, Hot Sheets, New Updates, My Listings, Pipeline

## Navigation Rule (CRITICAL — MUST FOLLOW)
You are a **guide**, not just a chatbot. Whenever the user asks about ANY section, feature, or data — you MUST:
1. **Answer their question** with relevant data
2. **ALSO navigate them there** by including this marker: <<NAVIGATE:TargetName>>

The target name can be any of the pages or sections listed above.

Examples:
- User: "Show me the morning briefing" → Answer with briefing insights + <<NAVIGATE:Morning Briefing>>
- User: "What are my tasks?" → Summarize tasks + <<NAVIGATE:Tasks>>
- User: "Take me to Calendar" → Confirm + <<NAVIGATE:Calendar>>
- User: "How are my transactions?" → Summarize pipeline + <<NAVIGATE:Pipeline>>
- User: "What's happening with my leads?" → Summarize live feed + <<NAVIGATE:Live Feed>>

Always include <<NAVIGATE:X>> when the conversation involves any specific section. Only skip navigation for purely general questions like "how are you?" or pure drafting tasks.

## Current Dashboard Data (Live Context)

**🌅 AI Morning Briefing (Today's Personalized Insights):**
${briefing}

**📊 Live Activity Feed (Real-time Lead Interactions):**
${liveActivity}

**Today's Tasks:**
${tasks}

**Hot Sheets — Market Trends:**
${hotSheets}

**Contacts Needing Follow-up:**
${contacts}

**Active Transactions:**
${transactions}

**My Listings:**
${listings}

## Behavioral Guidelines
- You are a **guide and assistant** — always answer AND navigate to the relevant section
- Be concise, warm, and professional — you're a trusted real estate assistant
- Use actual data from the dashboard when answering questions
- **When asked about "morning briefing", "priorities", "what matters today", or "what should I focus on", ALWAYS reference the Morning Briefing insights first and include <<NAVIGATE:Morning Briefing>>**
- When drafting messages/emails, make them personal, professional, and ready to send
- **ALWAYS include <<NAVIGATE:X>> when discussing any specific dashboard section** — this scrolls the user to that section or switches the page
- Format drafted content clearly (use line breaks for readability)
- Keep replies focused — agents are busy people
- If the user asks about live activity, real-time leads, or recent interactions, reference the Live Activity Feed data and include <<NAVIGATE:Live Feed>>`
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isUser && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', flexShrink: 0 }}
        >
          <Bot size={12} color="#fff" />
        </div>
      )}

      <div
        className="max-w-[76%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
        style={
          isUser
            ? {
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                color: '#fff',
                borderBottomRightRadius: '4px',
              }
            : {
                background: msg.isError ? '#FEF2F2' : '#F1F5F9',
                color: msg.isError ? '#DC2626' : '#1E293B',
                border: `1px solid ${msg.isError ? '#FECACA' : '#E2E8F0'}`,
                borderBottomLeftRadius: '4px',
              }
        }
      >
        <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</p>

        {msg.navigatedTo && (
          <div
            className="mt-2 flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 w-fit"
            style={{ background: '#EEF2FF', color: '#6366F1' }}
          >
            <Navigation size={10} />
            Navigated to {msg.navigatedTo}
          </div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}
      >
        <Bot size={12} color="#fff" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-[4px] flex gap-1.5 items-center"
        style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}
      >
        {[0, 1, 2].map(d => (
          <span
            key={d}
            className="w-2 h-2 rounded-full block"
            style={{
              background: '#94A3B8',
              animation: `aiTypingDot 1.2s ease-in-out ${d * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  'Summarize my hot sheets',
  'Take me to Calendar',
  'Draft an email to David Park',
  'Who needs follow-up?',
]

export default function AICommandCenter({ onNavigate, widgetData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your Lofty AI Command Center.\n\nI can navigate the dashboard for you, draft client messages, summarize your hot sheets, and handle real estate tasks.\n\nWhat would you like to do?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsLoading(true)

    try {
      const systemPrompt = buildSystemPrompt(widgetData)
      const history = messages.map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'system', content: systemPrompt }, ...history, userMsg],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      })

      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      const raw = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

      const navMatch = raw.match(/<<NAVIGATE:([^>]+)>>/)
      if (navMatch) {
        const target = navMatch[1].trim()
        const clean = raw.replace(/<<NAVIGATE:[^>]+>>/g, '').trim()
        setMessages(prev => [...prev, { role: 'assistant', content: clean, navigatedTo: target }])

        // Try section scroll first, then nav page switch
        setTimeout(() => {
          const scrolled = scrollToSection(target)
          if (!scrolled && NAV_PAGES.includes(target)) {
            onNavigate?.(target)
          }
        }, 500)
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: raw }])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble connecting to the AI. Please try again.',
          isError: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showSuggestions = messages.length === 1 && !isLoading

  return (
    <>
      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9999] flex flex-col"
          style={{
            width: '390px',
            height: '540px',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 24px rgba(59,130,246,0.12)',
            border: '1px solid rgba(226,232,240,0.8)',
            animation: 'aiPanelOpen 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: 'bottom right',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 shrink-0"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              borderRadius: '20px 20px 0 0',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <Sparkles size={17} color="#fff" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Lofty AI Command Center</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#86EFAC', boxShadow: '0 0 4px #86EFAC' }}
                />
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>
                  Online · Powered by Groq
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              <X size={14} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
          >
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {showSuggestions && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(s)
                    setTimeout(() => inputRef.current?.focus(), 0)
                  }}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    background: '#EFF6FF',
                    color: '#3B82F6',
                    border: '1px solid #BFDBFE',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#DBEAFE')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#EFF6FF')}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div
            className="px-3 py-3 flex gap-2 items-end shrink-0"
            style={{ borderTop: '1px solid #F1F5F9' }}
          >
            <textarea
              ref={el => {
                inputRef.current = el
                textareaRef.current = el
              }}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                autoResize()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              rows={1}
              className="flex-1 resize-none text-sm rounded-xl px-3.5 py-2.5 outline-none"
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#1E293B',
                lineHeight: '1.5',
                maxHeight: '100px',
                minHeight: '40px',
                fontFamily: 'inherit',
              }}
              onFocus={e => (e.target.style.borderColor = '#93C5FD')}
              onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0"
              style={{
                background:
                  input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #3B82F6, #6366F1)'
                    : '#F1F5F9',
                color: input.trim() && !isLoading ? '#fff' : '#94A3B8',
                boxShadow:
                  input.trim() && !isLoading ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center transition-all"
        style={{
          background: isOpen
            ? '#EF4444'
            : 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
          boxShadow: isOpen
            ? '0 4px 20px rgba(239,68,68,0.4)'
            : '0 4px 24px rgba(99,102,241,0.45)',
          transform: 'scale(1)',
          transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1.07)')}
      >
        {isOpen ? <X size={22} color="#fff" /> : <MessageSquare size={22} color="#fff" />}
      </button>
    </>
  )
}
