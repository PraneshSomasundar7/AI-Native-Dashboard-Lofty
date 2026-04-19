import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'
import AOSActionZone from './AOSActionZone'
import LiveActivityFeed from './LiveActivityFeed'
import TasksCard from './widgets/TasksCard'
import KeepInTouchCard from './widgets/KeepInTouchCard'
import TransactionsCard from './widgets/TransactionsCard'
import ListingsCard from './widgets/ListingsCard'
import HotSheetsCard from './widgets/HotSheetsCard'
import UpdatesCard from './widgets/UpdatesCard'
import { getInitialWidgetColumns } from '../data/widgetData'
import { insforge } from '../lib/insforge'

const widgetRenderers = {
  "Today's Tasks":      TasksCard,
  'Need Keep In Touch': KeepInTouchCard,
  Transactions:         TransactionsCard,
  'My Listings':        ListingsCard,
  'Hot Sheets':         HotSheetsCard,
  'New Updates':        UpdatesCard,
}

const MAX_FEED = 20

// ── AI message generator ──────────────────────────────────────────────────────
async function generateAIMessage({ leadName, propertyTitle, agentFirstName, viewCount }) {
  try {
    const completion = await insforge.ai.chat.completions.create({
      model: 'anthropic/claude-sonnet-4.5',
      messages: [{
        role: 'user',
        content: `You are ${agentFirstName}, a real estate agent. Write a warm, personalized SMS (under 160 characters) to ${leadName} who has viewed the property "${propertyTitle}" ${viewCount} times. Invite them for a private showing this weekend. Sign with your first name. Return ONLY the SMS text, no quotes or labels.`,
      }],
      maxTokens: 120,
    })
    return completion.choices[0].message.content.trim()
  } catch {
    // Graceful fallback if AI call fails
    const fn = leadName.split(' ')[0]
    return `Hi ${fn}! I noticed you've been looking at ${propertyTitle} — it's a fantastic property. I'd love to set up a private showing this weekend. — ${agentFirstName}`
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LoftyDashboard() {
  const { user } = useAuth()
  const agentEmail     = user?.email || ''
  const agentFirstName = user?.full_name?.split(' ')[0] || 'Agent'
  const agentFullName  = user?.full_name || agentFirstName

  const [activeNav, setActiveNav]         = useState('People')
  const [mounted, setMounted]             = useState(false)
  const [widgetColumns, setWidgetColumns] = useState(getInitialWidgetColumns)

  const [removingItemId, setRemovingItemId]   = useState(null)
  const [newUpdateId, setNewUpdateId]         = useState(null)
  const [flashingWidgets, setFlashingWidgets] = useState(new Set())

  // Live feed — only events for THIS agent's properties
  const [liveActivities, setLiveActivities] = useState([])

  // AI alert state
  const [liveAlert, setLiveAlert]           = useState(null)
  const [dismissedLeads, setDismissedLeads] = useState(new Set())
  const liveAlertRef                        = useRef(null)
  const dismissedLeadsRef                   = useRef(new Set())

  useEffect(() => { liveAlertRef.current       = liveAlert },       [liveAlert])
  useEffect(() => { dismissedLeadsRef.current  = dismissedLeads },  [dismissedLeads])
  useEffect(() => { setMounted(true) }, [])

  // ── Fetch this agent's listings for My Listings widget ────────────────────
  useEffect(() => {
    if (!agentEmail) return
    let cancelled = false

    async function fetchListings() {
      const { data: props } = await insforge.database
        .from('PropertyDetails')
        .select('id, title, price')
        .eq('agent_email', agentEmail)

      if (cancelled || !props?.length) return

      const { data: viewData } = await insforge.database
        .from('leads')
        .select('property_title, view_count')
        .eq('agent_email', agentEmail)

      const viewMap = {}
      viewData?.forEach(l => {
        viewMap[l.property_title] = (viewMap[l.property_title] || 0) + (l.view_count || 0)
      })

      const items = props.map(p => ({
        id:      `lst-${p.id}`,
        address: p.title,
        status:  'Active',
        price:   p.price >= 1_000_000
          ? `$${(p.price / 1_000_000).toFixed(1)}M`
          : `$${p.price.toLocaleString('en-US')}`,
        views:   viewMap[p.title] || 0,
      }))

      if (!cancelled) {
        setWidgetColumns(prev =>
          prev.map(col =>
            col.map(widget =>
              widget.title === 'My Listings' ? { ...widget, items } : widget
            )
          )
        )
      }
    }

    fetchListings()
    return () => { cancelled = true }
  }, [agentEmail])

  // ── Real-time subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!agentEmail) return
    let active = true

    async function setup() {
      try {
        await insforge.realtime.connect()
        await insforge.realtime.subscribe('leads')

        insforge.realtime.on('UPDATE_lead', async (payload) => {
          if (!active) return

          // Only process events that belong to THIS agent
          if (payload.agent_email !== agentEmail) return

          const {
            id,
            name           = 'Unknown User',
            email          = '',
            property_title = 'Unknown Property',
            view_count     = 0,
            lead_score     = 0,
          } = payload

          const isHighInterest = view_count >= 3 || lead_score >= 70

          // Add to live feed immediately
          setLiveActivities(prev => [{
            id:            `${id}-${Date.now()}`,
            name,
            propertyTitle: property_title,
            viewCount:     view_count,
            leadScore:     lead_score,
            isHighInterest,
            time:          new Date(),
          }, ...prev.slice(0, MAX_FEED - 1)])

          // Trigger AOS alert + AI message generation for high-interest events
          if (isHighInterest && !dismissedLeadsRef.current.has(id)) {
            // Set alert immediately (aiMessage = null → shows loading spinner in AOS)
            setLiveAlert({
              leadId:        id,
              leadName:      name,
              leadEmail:     email,
              propertyTitle: property_title,
              leadScore:     lead_score,
              viewCount:     view_count,
              aiMessage:     null,
            })

            // Generate AI message async — update alert once ready
            const aiMsg = await generateAIMessage({
              leadName:      name,
              propertyTitle: property_title,
              agentFirstName,
              viewCount:     view_count,
            })

            if (active) {
              setLiveAlert(prev =>
                prev?.leadId === id ? { ...prev, aiMessage: aiMsg } : prev
              )
            }
          }
        })
      } catch {
        // Realtime unavailable — dashboard still works without live feed
      }
    }

    setup()
    return () => {
      active = false
      insforge.realtime.unsubscribe('leads')
      insforge.realtime.disconnect()
    }
  }, [agentEmail, agentFirstName]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAlertDismiss = useCallback(() => {
    const alert = liveAlertRef.current
    if (alert?.leadId) setDismissedLeads(prev => new Set([...prev, alert.leadId]))
    setLiveAlert(null)
  }, [])

  // ── Ripple cascade ────────────────────────────────────────────────────────
  const handleActionComplete = useCallback(async (aiMessage) => {
    setRemovingItemId('kristin-watson-task')
    setTimeout(() => setFlashingWidgets(new Set(["Today's Tasks"])), 200)

    setTimeout(() => {
      setWidgetColumns(prev => {
        const next = JSON.parse(JSON.stringify(prev, (_k, v) => typeof v === 'function' ? undefined : v))
        for (let c = 0; c < prev.length; c++)
          for (let w = 0; w < prev[c].length; w++)
            next[c][w].icon = prev[c][w].icon
        next[0][0].items = next[0][0].items.filter(i => i.id !== 'kristin-watson-task')
        return next
      })
      setRemovingItemId(null)
    }, 600)

    setTimeout(() => {
      const alert         = liveAlertRef.current
      const leadName      = alert?.leadName      || 'Lead'
      const propertyTitle = alert?.propertyTitle || 'the property'

      setWidgetColumns(prev =>
        prev.map(col =>
          col.map(widget =>
            widget.title === 'New Updates'
              ? { ...widget, items: [{ id: 'upd-ai-resolved', text: `AOS sent SMS to ${leadName} — showing invite for ${propertyTitle}`, time: 'Just now', type: 'ai_resolved' }, ...widget.items] }
              : widget
          )
        )
      )
      setNewUpdateId('upd-ai-resolved')
      setFlashingWidgets(new Set(['New Updates']))
      handleAlertDismiss()
    }, 700)

    setTimeout(() => { setFlashingWidgets(new Set()); setNewUpdateId(null) }, 2500)

    // Deliver message to buyer via messages table (triggers realtime to UserPortal)
    const alert = liveAlertRef.current
    if (alert?.leadEmail && aiMessage) {
      try {
        await insforge.database.from('messages').insert([{
          from_email:     agentEmail,
          from_name:      agentFullName,
          to_email:       alert.leadEmail,
          content:        aiMessage,
          property_title: alert.propertyTitle,
        }])
      } catch { /* silent fail — UI already shows success */ }
    }
  }, [handleAlertDismiss, agentEmail, agentFullName])

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FB' }}>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="max-w-[1440px] mx-auto px-6 pb-12">
        <AOSActionZone
          onActionComplete={handleActionComplete}
          liveAlert={liveAlert}
          onAlertDismiss={handleAlertDismiss}
        />

        <LiveActivityFeed activities={liveActivities} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {widgetColumns.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-5">
              {column.map((widget, widgetIdx) => {
                const Component = widgetRenderers[widget.title]
                if (!Component) return null
                const extraProps = {}
                if (widget.title === "Today's Tasks") extraProps.removingItemId = removingItemId
                if (widget.title === 'New Updates')   extraProps.newItemId      = newUpdateId
                const isFlashing = flashingWidgets.has(widget.title)
                return (
                  <div key={widget.title}
                    className={`${mounted ? 'widget-appear' : ''} ${isFlashing ? 'ripple-flash' : ''}`}
                    style={{ animationDelay: mounted && !isFlashing ? `${colIdx * 100 + widgetIdx * 150}ms` : undefined, animationFillMode: 'forwards' }}>
                    <Component widget={widget} {...extraProps} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
