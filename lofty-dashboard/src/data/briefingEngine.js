import { Sun, TrendingUp, Users, GitPullRequest, Handshake } from 'lucide-react'

/**
 * Briefing insight categories — each has a distinct visual identity.
 */
export const CATEGORIES = {
  MARKET: {
    key: 'MARKET',
    label: 'Market Insight',
    icon: TrendingUp,
    color: '#F59E0B',
    bgLight: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  LEAD: {
    key: 'LEAD',
    label: 'Lead Activity',
    icon: Users,
    color: '#3B82F6',
    bgLight: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  PIPELINE: {
    key: 'PIPELINE',
    label: 'Pipeline Update',
    icon: GitPullRequest,
    color: '#10B981',
    bgLight: '#ECFDF5',
    borderColor: '#6EE7B7',
  },
  RELATIONSHIP: {
    key: 'RELATIONSHIP',
    label: 'Relationship',
    icon: Handshake,
    color: '#8B5CF6',
    bgLight: '#F5F3FF',
    borderColor: '#C4B5FD',
  },
}

/**
 * Generates morning briefing insights by cross-referencing widget data
 * and live activity feed. Returns an array of insight objects.
 *
 * @param {Array} widgetColumns  — the 3-column widget data from getInitialWidgetColumns()
 * @param {Array} liveActivities — real-time lead interactions from InsForge
 * @param {string} agentName     — the logged-in agent's first name
 * @returns {Array<{id, category, narrative, sources, dismissed}>}
 */
export function generateBriefingInsights(widgetColumns, liveActivities, agentName) {
  const insights = []
  const flat = widgetColumns.flat()

  const hotSheets    = flat.find(w => w.title === 'Hot Sheets')
  const updates      = flat.find(w => w.title === 'New Updates')
  const transactions = flat.find(w => w.title === 'Transactions')
  const keepInTouch  = flat.find(w => w.title === 'Need Keep In Touch')
  const tasks        = flat.find(w => w.title === "Today's Tasks")

  // ── MARKET insight ──────────────────────────────────────────────────
  if (hotSheets?.items?.length) {
    const topSheet = hotSheets.items[0]
    const priceReductions = hotSheets.items.find(i =>
      i.label?.toLowerCase().includes('price reduction')
    )

    let narrative = `${topSheet.count} new listings hit ${topSheet.label.replace('New listings in ', '')} overnight`
    if (topSheet.trend) narrative += ` (${topSheet.trend}).`
    else narrative += '.'

    narrative += ` Consider sharing this hot sheet with your active buyers in that area`

    if (priceReductions) {
      narrative += ` — and note ${priceReductions.count} price reductions in ${priceReductions.label.replace('Price reductions — ', '')} that could motivate fence-sitters`
    }
    narrative += '.'

    insights.push({
      id: 'briefing-market',
      category: CATEGORIES.MARKET,
      narrative,
      sources: ['Hot Sheets'],
      dismissed: false,
    })
  }

  // ── LEAD insight ────────────────────────────────────────────────────
  // Cross-reference Updates (email opens) with Live Feed (property views)
  const emailUpdate = updates?.items?.find(i => i.type === 'email')
  const highInterestActivities = liveActivities.filter(a => a.isHighInterest)

  if (emailUpdate || highInterestActivities.length > 0) {
    let narrative = ''

    if (emailUpdate && highInterestActivities.length > 0) {
      const topLead = highInterestActivities[0]
      narrative = `${topLead.name} opened your email ${emailUpdate.time} and has viewed ${topLead.propertyTitle} ${topLead.viewCount}×. `
      narrative += `They're warming up — a quick call could convert them this week.`
    } else if (emailUpdate) {
      const name = emailUpdate.text.split(' ')[0] + ' ' + emailUpdate.text.split(' ')[1]
      narrative = `${name.replace(' opened', '')} opened your email ${emailUpdate.time}. `
      narrative += `This is a good signal — consider following up while you're top of mind.`
    } else {
      const topLead = highInterestActivities[0]
      narrative = `${topLead.name} has viewed ${topLead.propertyTitle} ${topLead.viewCount} times `
      if (topLead.leadScore > 0) narrative += `with a lead score of ${topLead.leadScore}. `
      else narrative += 'recently. '
      narrative += `They're showing strong intent — this lead is worth prioritizing today.`
    }

    insights.push({
      id: 'briefing-lead',
      category: CATEGORIES.LEAD,
      narrative,
      sources: [
        ...(emailUpdate ? ['New Updates'] : []),
        ...(highInterestActivities.length > 0 ? ['Live Feed'] : []),
      ],
      dismissed: false,
    })
  } else {
    // Fallback LEAD insight from seeded data
    if (updates?.items?.length) {
      const leadUpdate = updates.items.find(i => i.type === 'lead')
      if (leadUpdate) {
        insights.push({
          id: 'briefing-lead',
          category: CATEGORIES.LEAD,
          narrative: `${leadUpdate.text.replace('New lead from Zillow — ', '')} just came in from Zillow (${leadUpdate.time}). Early outreach to new leads sees 3× higher conversion — consider a quick intro today.`,
          sources: ['New Updates'],
          dismissed: false,
        })
      }
    }
  }

  // ── PIPELINE insight ────────────────────────────────────────────────
  // Cross-reference Transactions with Updates (offer accepted)
  if (transactions?.items?.length) {
    const closingTx = transactions.items.find(i =>
      i.stage?.toLowerCase().includes('closing') || i.progress >= 80
    )
    const offerUpdate = updates?.items?.find(i => i.type === 'transaction')

    if (closingTx) {
      let narrative = `${closingTx.address} is ${closingTx.progress}% through closing at ${closingTx.price}`

      if (offerUpdate) {
        narrative += ` — the offer was accepted ${offerUpdate.time}`
      }

      narrative += `. Stay on top of any inspection deadlines and lender milestones this week.`

      insights.push({
        id: 'briefing-pipeline',
        category: CATEGORIES.PIPELINE,
        narrative,
        sources: ['Transactions', ...(offerUpdate ? ['New Updates'] : [])],
        dismissed: false,
      })
    } else {
      // General pipeline health
      const activeCount = transactions.items.length
      const totalValue = transactions.items.reduce((sum, tx) => {
        const num = parseInt(tx.price?.replace(/[$,]/g, '') || '0', 10)
        return sum + num
      }, 0)

      insights.push({
        id: 'briefing-pipeline',
        category: CATEGORIES.PIPELINE,
        narrative: `You have ${activeCount} active transactions worth $${(totalValue / 1000).toFixed(0)}K total. Review each stage to ensure nothing slips through the cracks.`,
        sources: ['Transactions'],
        dismissed: false,
      })
    }
  }

  // ── RELATIONSHIP insight ────────────────────────────────────────────
  // Cross-reference Keep In Touch with Hot Sheets market data
  if (keepInTouch?.items?.length) {
    const coldest = keepInTouch.items.reduce((a, b) => (a.days > b.days ? a : b))
    const priceReductions = hotSheets?.items?.find(i =>
      i.label?.toLowerCase().includes('price reduction')
    )

    let narrative = `${coldest.name} hasn't heard from you in ${coldest.days} days (engagement score: ${coldest.score})`

    if (priceReductions) {
      const area = priceReductions.label.replace('Price reductions — ', '')
      narrative += `. With ${priceReductions.count} price reductions in ${area}, now's a great time to re-engage with fresh market data that could reignite their interest`
    } else {
      narrative += `. A personal check-in goes a long way — even a quick "thinking of you" text can keep the relationship warm`
    }
    narrative += '.'

    insights.push({
      id: 'briefing-relationship',
      category: CATEGORIES.RELATIONSHIP,
      narrative,
      sources: ['Keep In Touch', ...(priceReductions ? ['Hot Sheets'] : [])],
      dismissed: false,
    })
  }

  return insights
}

/**
 * Creates a new LEAD insight from a live InsForge event.
 * Used to dynamically inject insights into the briefing.
 */
export function createLeadInsightFromEvent(event) {
  const { name, propertyTitle, viewCount, leadScore } = event

  let narrative = `${name} just showed high interest in ${propertyTitle}`
  if (viewCount >= 3) narrative += ` — ${viewCount} views`
  if (leadScore >= 70) narrative += `, lead score ${leadScore}`
  narrative += '. This is a hot signal worth acting on today.'

  return {
    id: `briefing-live-${Date.now()}`,
    category: CATEGORIES.LEAD,
    narrative,
    sources: ['Live Feed'],
    dismissed: false,
    isNew: true,
  }
}
