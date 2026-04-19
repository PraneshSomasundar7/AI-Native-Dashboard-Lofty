import { useState } from 'react'
import {
  DollarSign, TrendingUp, Clock, CheckCircle2, CalendarDays,
  Home, Eye, Bed, Bath, Maximize2, Mail, MousePointer,
  Globe, Users, Bell, Shield, Link, ArrowRightLeft,
  FileText, ExternalLink, Layers, Package, Plus, Search,
  ChevronLeft, ChevronRight, BarChart2, PieChart, Activity,
  Phone, MapPin, Star, Zap, Settings2, ToggleLeft,
} from 'lucide-react'

const card = {
  background: 'white',
  borderRadius: 16,
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
}

// ──────────────────────────────────────────────────────────────
// TRANSACTIONS
// ──────────────────────────────────────────────────────────────
const STAGE_META = {
  'Lead': { color: '#64748B', bg: '#F1F5F9', pct: 10 },
  'Under Offer': { color: '#D97706', bg: '#FFFBEB', pct: 35 },
  'Inspection': { color: '#7C3AED', bg: '#F5F3FF', pct: 55 },
  'Appraisal': { color: '#0284C7', bg: '#EFF6FF', pct: 70 },
  'Closing': { color: '#059669', bg: '#ECFDF5', pct: 88 },
  'Closed': { color: '#15803D', bg: '#DCFCE7', pct: 100 },
}

const TXS = [
  { client: 'Sarah & Tom Breen', property: '412 Maple Ridge Dr', stage: 'Closing', price: '$645,000', agent: 'Agent6', close: 'Apr 28' },
  { client: 'Marcus Webb', property: '88 Sunset Blvd #4C', stage: 'Appraisal', price: '$490,000', agent: 'Agent7', close: 'May 5' },
  { client: 'Priya Nair', property: '2201 Lakeview Terrace', stage: 'Inspection', price: '$820,000', agent: 'Agent8', close: 'May 12' },
  { client: 'Jordan & Kim Fischer', property: '37 Elm Court', stage: 'Under Offer', price: '$375,000', agent: 'Agent9', close: 'May 20' },
  { client: 'Diana Cho', property: '1905 Harbor Point Ln', stage: 'Closed', price: '$1,120,000', agent: 'Agent10', close: 'Apr 10' },
  { client: 'Ryan Kowalski', property: '504 Oak Street', stage: 'Lead', price: '$295,000', agent: 'Agent6', close: 'TBD' },
  { client: 'Amara Osei', property: '770 Pacific Ave #12', stage: 'Under Offer', price: '$560,000', agent: 'Agent7', close: 'May 18' },
  { client: 'Liam & Cora Walsh', property: '3300 Cedar Creek Rd', stage: 'Closing', price: '$735,000', agent: 'Agent8', close: 'Apr 30' },
]

function TransactionsView() {
  const stats = [
    { label: 'Active Transactions', value: '6', icon: Activity, color: '#3B82F6' },
    { label: 'Closing This Month', value: '3', icon: CheckCircle2, color: '#10B981' },
    { label: 'Total Volume', value: '$5.0M', icon: DollarSign, color: '#8B5CF6' },
    { label: 'Avg. Days to Close', value: '26', icon: Clock, color: '#F59E0B' },
  ]

  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Transactions</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Track your full pipeline from lead to close</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={14} /> New Transaction
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
              {['Client', 'Property', 'Stage', 'Progress', 'Price', 'Agent', 'Est. Close'].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TXS.map((tx, i) => {
              const meta = STAGE_META[tx.stage]
              return (
                <tr key={i} style={{ borderBottom: i < TXS.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{tx.client}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>{tx.property}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, background: meta.bg, padding: '3px 9px', borderRadius: 20 }}>{tx.stage}</span>
                  </td>
                  <td style={{ padding: '13px 16px', minWidth: 120 }}>
                    <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${meta.pct}%`, background: meta.color, borderRadius: 3, transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: 10, color: '#94A3B8', marginTop: 3, display: 'block' }}>{meta.pct}%</span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{tx.price}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#475569' }}>{tx.agent}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748B' }}>{tx.close}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// CALENDAR
// ──────────────────────────────────────────────────────────────
const EVENTS = {
  20: [{ label: 'Open House – 412 Maple', color: '#3B82F6' }],
  22: [{ label: 'Closing – Harbor Point', color: '#10B981' }, { label: 'Client Call – Priya N.', color: '#8B5CF6' }],
  24: [{ label: 'Inspection – Lakeview', color: '#F59E0B' }],
  26: [{ label: 'Broker Tour', color: '#EC4899' }],
  28: [{ label: 'Closing – Maple Ridge', color: '#10B981' }],
  30: [{ label: 'Closing – Cedar Creek', color: '#10B981' }],
  5: [{ label: 'Listing Presentation', color: '#3B82F6' }],
  8: [{ label: 'Photography – Oak St.', color: '#64748B' }],
}

const UPCOMING = [
  { date: 'Apr 20', label: 'Open House – 412 Maple Ridge Dr', time: '1:00 – 4:00 PM', color: '#3B82F6' },
  { date: 'Apr 22', label: 'Closing – Harbor Point Ln', time: '10:00 AM', color: '#10B981' },
  { date: 'Apr 22', label: 'Client Call – Priya Nair', time: '2:30 PM', color: '#8B5CF6' },
  { date: 'Apr 24', label: 'Home Inspection – Lakeview', time: '9:00 AM', color: '#F59E0B' },
  { date: 'Apr 26', label: 'Broker Tour', time: '11:00 AM – 1 PM', color: '#EC4899' },
  { date: 'Apr 28', label: 'Closing – Maple Ridge Dr', time: '3:00 PM', color: '#10B981' },
]

function CalendarView() {
  const [month, setMonth] = useState(new Date(2026, 3, 1))

  const year = month.getFullYear()
  const mon = month.getMonth()
  const firstDay = new Date(year, mon, 1).getDay()
  const daysInMonth = new Date(year, mon + 1, 0).getDate()
  const today = 19

  const monthName = month.toLocaleString('default', { month: 'long', year: 'numeric' })
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Calendar</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Schedule & upcoming events</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={14} /> Add Event
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* Calendar grid */}
        <div style={{ ...card, padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonth(new Date(year, mon - 1, 1))} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, padding: '5px 8px', cursor: 'pointer' }}><ChevronLeft size={15} color="#64748B" /></button>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{monthName}</span>
            <button onClick={() => setMonth(new Date(year, mon + 1, 1))} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 8, padding: '5px 8px', cursor: 'pointer' }}><ChevronRight size={15} color="#64748B" /></button>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {days.map(d => (
              <div key={d} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textAlign: 'center', paddingBottom: 8 }}>{d}</div>
            ))}
            {cells.map((d, i) => {
              const evts = d ? (EVENTS[d] || []) : []
              const isToday = d === today && mon === 3 && year === 2026
              return (
                <div key={i} style={{
                  minHeight: 70, borderRadius: 8, padding: '6px 6px 4px',
                  background: isToday ? '#EFF6FF' : '#F8FAFC',
                  border: isToday ? '1.5px solid #3B82F6' : '1px solid #F1F5F9',
                }}>
                  {d && (
                    <>
                      <span style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isToday ? '#2563EB' : '#475569' }}>{d}</span>
                      {evts.map((ev, j) => (
                        <div key={j} style={{
                          marginTop: 3, fontSize: 9, fontWeight: 600, color: 'white',
                          background: ev.color, borderRadius: 4, padding: '1px 4px',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{ev.label}</div>
                      ))}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming events */}
        <div style={{ ...card, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', margin: '0 0 16px' }}>Upcoming Events</h3>
          <div className="flex flex-col gap-3">
            {UPCOMING.map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 3, borderRadius: 3, background: ev.color, alignSelf: 'stretch', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{ev.label}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{ev.date} · {ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// LISTINGS
// ──────────────────────────────────────────────────────────────
const LISTINGS = [
  { img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=480&q=70', address: '412 Maple Ridge Dr', city: 'Austin, TX', price: '$649,000', status: 'Active', beds: 4, baths: 3, sqft: 2780, agent: 'Agent6' },
  { img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=480&q=70', address: '88 Sunset Blvd #4C', city: 'San Diego, CA', price: '$499,500', status: 'Active', beds: 2, baths: 2, sqft: 1120, agent: 'Agent7' },
  { img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=480&q=70', address: '2201 Lakeview Terrace', city: 'Miami, FL', price: '$825,000', status: 'Coming Soon', beds: 5, baths: 4, sqft: 3600, agent: 'Agent8' },
  { img: 'https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=480&q=70', address: '37 Elm Court', city: 'Nashville, TN', price: '$379,000', status: 'Active', beds: 3, baths: 2, sqft: 1850, agent: 'Agent9' },
  { img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=480&q=70', address: '1905 Harbor Point Ln', city: 'Seattle, WA', price: '$1,125,000', status: 'Sold', beds: 4, baths: 3, sqft: 2950, agent: 'Agent10' },
  { img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=480&q=70', address: '504 Oak Street', city: 'Austin, TX', price: '$295,000', status: 'Active', beds: 2, baths: 1, sqft: 950, agent: 'Agent6' },
  { img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=480&q=70', address: '770 Pacific Ave #12', city: 'San Diego, CA', price: '$565,000', status: 'Active', beds: 3, baths: 2, sqft: 1480, agent: 'Agent7' },
  { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=480&q=70', address: '3300 Cedar Creek Rd', city: 'Nashville, TN', price: '$739,000', status: 'Coming Soon', beds: 4, baths: 3, sqft: 2640, agent: 'Agent8' },
  { img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=480&q=70', address: '901 Bayshore Drive', city: 'Miami, FL', price: '$980,000', status: 'Active', beds: 5, baths: 4, sqft: 3200, agent: 'Agent9' },
  { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&q=70', address: '142 Pine Summit Way', city: 'Seattle, WA', price: '$615,000', status: 'Sold', beds: 3, baths: 2, sqft: 1920, agent: 'Agent10' },
]

const STATUS_STYLE = {
  'Active': { color: '#059669', bg: '#ECFDF5' },
  'Coming Soon': { color: '#D97706', bg: '#FFFBEB' },
  'Sold': { color: '#64748B', bg: '#F1F5F9' },
}

const TABS = ['All', 'Active', 'Coming Soon', 'Sold']

function ListingsView() {
  const [tab, setTab] = useState('All')
  const filtered = tab === 'All' ? LISTINGS : LISTINGS.filter(l => l.status === tab)

  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Listings</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>{LISTINGS.length} total properties across all agents</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={14} /> Add Listing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: tab === t ? 'none' : '1px solid #E2E8F0',
            background: tab === t ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'white',
            color: tab === t ? 'white' : '#64748B',
          }}>{t}</button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map((l, i) => {
          const ss = STATUS_STYLE[l.status]
          return (
            <div key={i} style={{ ...card, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                <img src={l.img} alt={l.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 11, fontWeight: 700, color: ss.color, background: ss.bg, padding: '3px 9px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>{l.status}</span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', marginBottom: 2 }}>{l.price}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 2 }}>{l.address}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>{l.city}</div>
                <div className="flex items-center gap-4" style={{ fontSize: 12, color: '#475569' }}>
                  <span className="flex items-center gap-1"><Bed size={12} color="#94A3B8" /> {l.beds} bd</span>
                  <span className="flex items-center gap-1"><Bath size={12} color="#94A3B8" /> {l.baths} ba</span>
                  <span className="flex items-center gap-1"><Maximize2 size={12} color="#94A3B8" /> {l.sqft.toLocaleString()} sqft</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: '#94A3B8' }}>Agent: <span style={{ fontWeight: 600, color: '#3B82F6' }}>{l.agent}</span></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// MARKETING
// ──────────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { name: 'April Buyer Newsletter', type: 'Email', sent: 842, opens: 541, clicks: 134, date: 'Apr 15' },
  { name: 'New Listing Alert – Maple', type: 'Email', sent: 320, opens: 289, clicks: 97, date: 'Apr 18' },
  { name: 'Spring Market Report', type: 'Email', sent: 1240, opens: 680, clicks: 195, date: 'Apr 10' },
  { name: 'Open House – Cedar Creek', type: 'Social', sent: 5400, opens: 2100, clicks: 480, date: 'Apr 19' },
  { name: 'Price Drop – Sunset Blvd', type: 'Email', sent: 410, opens: 310, clicks: 72, date: 'Apr 8' },
]

const OPEN_HOUSES = [
  { address: '412 Maple Ridge Dr', date: 'Sun, Apr 20', time: '1 – 4 PM', agent: 'Agent6', rsvps: 14 },
  { address: '3300 Cedar Creek Rd', date: 'Sat, Apr 26', time: '11 AM – 2 PM', agent: 'Agent8', rsvps: 9 },
  { address: '37 Elm Court', date: 'Sun, Apr 27', time: '2 – 5 PM', agent: 'Agent9', rsvps: 6 },
]

function MarketingView() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Marketing</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Campaigns, emails, and open houses</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={14} /> New Campaign
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Campaign table */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Campaigns</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                {['Campaign', 'Type', 'Sent', 'Opens', 'Clicks', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((c, i) => (
                <tr key={i} style={{ borderBottom: i < CAMPAIGNS.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{c.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: c.type === 'Email' ? '#3B82F6' : '#8B5CF6', background: c.type === 'Email' ? '#EFF6FF' : '#F5F3FF', padding: '2px 8px', borderRadius: 20 }}>{c.type}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', fontWeight: 600 }}>{c.sent.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#059669', fontWeight: 600 }}>{c.opens.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#D97706', fontWeight: 600 }}>{c.clicks}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#94A3B8' }}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Open houses */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Upcoming Open Houses</span>
          </div>
          <div className="flex flex-col gap-4">
            {OPEN_HOUSES.map((oh, i) => (
              <div key={i} style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>{oh.address}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{oh.date} · {oh.time}</div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 11, color: '#3B82F6', fontWeight: 600 }}>{oh.agent}</span>
                  <span style={{ fontSize: 11, background: '#ECFDF5', color: '#059669', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{oh.rsvps} RSVPs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// REPORTING
// ──────────────────────────────────────────────────────────────
const MONTHLY_GCI = [
  { month: 'Jan', gci: 42000, vol: 1800000 },
  { month: 'Feb', gci: 38000, vol: 1550000 },
  { month: 'Mar', gci: 61000, vol: 2400000 },
  { month: 'Apr', gci: 54000, vol: 2150000 },
]
const MAX_GCI = Math.max(...MONTHLY_GCI.map(m => m.gci))

const SOURCES = [
  { label: 'Lofty Website', pct: 38, color: '#3B82F6' },
  { label: 'Referrals', pct: 27, color: '#8B5CF6' },
  { label: 'Zillow', pct: 18, color: '#F59E0B' },
  { label: 'Social Media', pct: 12, color: '#EC4899' },
  { label: 'Other', pct: 5, color: '#94A3B8' },
]

function ReportingView() {
  const ytd = [
    { label: 'GCI YTD', value: '$195,000', icon: DollarSign, color: '#10B981' },
    { label: 'Volume YTD', value: '$7.9M', icon: TrendingUp, color: '#3B82F6' },
    { label: 'Transactions', value: '14', icon: FileText, color: '#8B5CF6' },
    { label: 'Lead Conversion', value: '22%', icon: Activity, color: '#F59E0B' },
  ]

  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Reporting</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Year-to-date performance metrics</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, border: '1px solid #E2E8F0',
          background: 'white', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <FileText size={14} /> Export Report
        </button>
      </div>

      {/* YTD stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {ytd.map(s => (
          <div key={s.label} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 280px' }}>
        {/* Monthly GCI chart */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 20 }}>Monthly GCI (Jan – Apr 2026)</div>
          <div className="flex flex-col gap-4">
            {MONTHLY_GCI.map(m => (
              <div key={m.month} className="flex items-center gap-4">
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', width: 28 }}>{m.month}</span>
                <div style={{ flex: 1, height: 22, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(m.gci / MAX_GCI) * 100}%`, background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', borderRadius: 6, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', width: 70, textAlign: 'right' }}>${(m.gci / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>

          {/* Volume bars */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Monthly Volume</div>
            {MONTHLY_GCI.map(m => (
              <div key={m.month + 'v'} className="flex items-center gap-4 mb-3">
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', width: 28 }}>{m.month}</span>
                <div style={{ flex: 1, height: 22, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(m.vol / 2400000) * 100}%`, background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)', borderRadius: 6 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', width: 70, textAlign: 'right' }}>${(m.vol / 1000000).toFixed(1)}M</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead sources */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Lead Sources</div>
          <div className="flex flex-col gap-3">
            {SOURCES.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 12 }}>Conversion Funnel</div>
            {[
              { stage: 'Leads', count: 148, color: '#3B82F6' },
              { stage: 'Qualified', count: 72, color: '#8B5CF6' },
              { stage: 'Under Offer', count: 24, color: '#F59E0B' },
              { stage: 'Closed', count: 14, color: '#10B981' },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>{f.stage}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// WEBSITE
// ──────────────────────────────────────────────────────────────
const WEB_LEADS = [
  { name: 'Chloe Park', page: '/listings/maple-ridge', action: 'Schedule a Tour', time: '2 min ago' },
  { name: 'Derek Santos', page: '/listings/sunset-blvd', action: 'Contact Agent', time: '18 min ago' },
  { name: 'Amelia Torres', page: '/home-valuation', action: 'Get Valuation', time: '47 min ago' },
  { name: 'Nate Jefferson', page: '/listings/lakeview', action: 'Schedule a Tour', time: '1 hr ago' },
  { name: 'Hana Yamamoto', page: '/listings/harbor-point', action: 'Save Listing', time: '2 hr ago' },
]

const TOP_PAGES = [
  { page: '/listings', views: 3842, change: '+12%' },
  { page: '/listings/maple-ridge', views: 1204, change: '+34%' },
  { page: '/home-valuation', views: 987, change: '+8%' },
  { page: '/about', views: 621, change: '-3%' },
  { page: '/contact', views: 418, change: '+2%' },
]

function WebsiteView() {
  const stats = [
    { label: 'Sessions (30d)', value: '9,420', icon: Globe, color: '#3B82F6' },
    { label: 'Unique Visitors', value: '6,118', icon: Users, color: '#8B5CF6' },
    { label: 'Avg. Session', value: '3m 14s', icon: Clock, color: '#F59E0B' },
    { label: 'Web Leads (30d)', value: '47', icon: MousePointer, color: '#10B981' },
  ]

  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Website</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Traffic analytics and online lead capture</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, border: '1px solid #E2E8F0',
          background: 'white', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <ExternalLink size={14} /> View Website
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 280px' }}>
        {/* Recent leads */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Recent Website Leads</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                {['Visitor', 'Page', 'Action', 'Time'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEB_LEADS.map((l, i) => (
                <tr key={i} style={{ borderBottom: i < WEB_LEADS.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{l.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', fontFamily: 'monospace' }}>{l.page}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#3B82F6', background: '#EFF6FF', padding: '2px 8px', borderRadius: 20 }}>{l.action}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#94A3B8' }}>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top pages */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Top Pages</div>
          {TOP_PAGES.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < TOP_PAGES.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>{p.page}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{p.views.toLocaleString()} views</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: p.change.startsWith('+') ? '#10B981' : '#EF4444' }}>{p.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// MARKETPLACE
// ──────────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: 'Zillow Premier', cat: 'Listings', desc: 'Sync listings & capture Zillow leads automatically.', connected: true, icon: '🏠', color: '#1E40AF' },
  { name: 'dotloop', cat: 'Transactions', desc: 'Manage contracts and e-signatures in one place.', connected: true, icon: '📝', color: '#059669' },
  { name: 'Mailchimp', cat: 'Marketing', desc: 'Send campaigns to your contacts with one click.', connected: true, icon: '📧', color: '#F59E0B' },
  { name: 'Google Calendar', cat: 'Productivity', desc: 'Two-way sync your appointments and showings.', connected: true, icon: '📅', color: '#3B82F6' },
  { name: 'Realtor.com', cat: 'Listings', desc: 'Push your listings to Realtor.com automatically.', connected: false, icon: '🔑', color: '#DC2626' },
  { name: 'BombBomb', cat: 'Marketing', desc: 'Send personalized video emails to leads and clients.', connected: false, icon: '🎥', color: '#7C3AED' },
  { name: 'ShowingTime', cat: 'Scheduling', desc: 'Automate showing requests and confirmations.', connected: false, icon: '🕐', color: '#0891B2' },
  { name: 'Matterport', cat: 'Listings', desc: 'Add 3D virtual tours to your listings.', connected: false, icon: '🔮', color: '#6D28D9' },
  { name: 'QuickBooks', cat: 'Finance', desc: 'Track commissions, expenses, and tax filings.', connected: false, icon: '💼', color: '#047857' },
  { name: 'Slack', cat: 'Productivity', desc: 'Get AI alerts and team notifications in Slack.', connected: false, icon: '💬', color: '#4A154B' },
  { name: 'Facebook Ads', cat: 'Marketing', desc: 'Run listing ads directly from your dashboard.', connected: false, icon: '📣', color: '#1877F2' },
  { name: 'DocuSign', cat: 'Transactions', desc: 'Collect e-signatures faster with DocuSign.', connected: false, icon: '✍️', color: '#F59E0B' },
]

const MKT_CATS = ['All', 'Listings', 'Marketing', 'Transactions', 'Productivity', 'Finance', 'Scheduling']

function MarketplaceView() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? INTEGRATIONS : INTEGRATIONS.filter(i => i.cat === cat)

  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Marketplace</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Connect your favorite tools · 4 connected</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 10, border: '1px solid #E2E8F0',
          background: 'white', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          <Search size={14} /> Browse All
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {MKT_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: cat === c ? 'none' : '1px solid #E2E8F0',
            background: cat === c ? 'linear-gradient(135deg, #3B82F6, #2563EB)' : 'white',
            color: cat === c ? 'white' : '#64748B',
          }}>{c}</button>
        ))}
      </div>

      {/* Integration cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map((item, i) => (
          <div key={i} style={{ ...card, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-12px" style={{ gap: 12 }}>
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{item.cat}</div>
                </div>
              </div>
              {item.connected && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>Connected</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            <button style={{
              padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: item.connected ? '1px solid #E2E8F0' : 'none',
              background: item.connected ? 'white' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
              color: item.connected ? '#64748B' : 'white',
            }}>
              {item.connected ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// SETTINGS
// ──────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
        background: value ? '#3B82F6' : '#CBD5E1',
        position: 'relative', transition: 'background 0.2s ease', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
        transition: 'left 0.2s ease',
      }} />
    </button>
  )
}

function SettingsView() {
  const [notifs, setNotifs] = useState({
    newLead: true, showingReq: true, offerAlert: true,
    emailDigest: false, marketUpdate: true, teamActivity: false,
  })
  const [profile, setProfile] = useState({
    name: 'Agent6', email: 'agent6@gmail.com',
    phone: '(512) 555-0142', brokerage: 'Lofty Real Estate Group', license: 'TX-2049-A',
  })

  const notifItems = [
    { key: 'newLead', label: 'New Lead Alerts', desc: 'Get notified instantly when a new lead comes in' },
    { key: 'showingReq', label: 'Showing Requests', desc: 'Alerts for new and confirmed showing appointments' },
    { key: 'offerAlert', label: 'Offer Activity', desc: 'Notified when an offer is submitted or updated' },
    { key: 'emailDigest', label: 'Daily Email Digest', desc: 'Morning summary of your pipeline in your inbox' },
    { key: 'marketUpdate', label: 'Market Updates', desc: 'Weekly market report for your target areas' },
    { key: 'teamActivity', label: 'Team Activity', desc: 'Updates when teammates add notes or make changes' },
  ]

  const connected = [
    { label: 'Google Account', email: 'agent6@gmail.com', icon: '🔵', linked: true },
    { label: 'Zillow Profile', email: 'agent6.lofty.com', icon: '🏠', linked: true },
    { label: 'Facebook Page', email: 'Not connected', icon: '📘', linked: false },
  ]

  return (
    <div style={{ paddingTop: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1E293B', margin: 0 }}>Settings</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Manage your profile and preferences</p>
        </div>
        <button style={{
          padding: '9px 16px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          Save Changes
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Profile */}
        <div style={{ ...card, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', margin: '0 0 18px' }}>Profile Information</h3>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Full Name', key: 'name' },
              { label: 'Email Address', key: 'email' },
              { label: 'Phone Number', key: 'phone' },
              { label: 'Brokerage', key: 'brokerage' },
              { label: 'License Number', key: 'license' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>{f.label}</label>
                <input
                  value={profile[f.key]}
                  onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 13, color: '#1E293B',
                    border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Notifications */}
          <div style={{ ...card, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', margin: '0 0 16px' }}>Notifications</h3>
            <div className="flex flex-col gap-4">
              {notifItems.map(n => (
                <div key={n.key} className="flex items-center justify-between gap-4">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{n.label}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{n.desc}</div>
                  </div>
                  <Toggle value={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Connected accounts */}
          <div style={{ ...card, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', margin: '0 0 16px' }}>Connected Accounts</h3>
            <div className="flex flex-col gap-3">
              {connected.map((a, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: '10px 0', borderBottom: i < connected.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 22 }}>{a.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{a.email}</div>
                    </div>
                  </div>
                  <button style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: '1px solid #E2E8F0', background: 'white', color: a.linked ? '#EF4444' : '#3B82F6',
                  }}>
                    {a.linked ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// ROOT SWITCH
// ──────────────────────────────────────────────────────────────
export default function NavViews({ activeNav }) {
  switch (activeNav) {
    case 'Transactions': return <TransactionsView />
    case 'Calendar': return <CalendarView />
    case 'Listings': return <ListingsView />
    case 'Marketing': return <MarketingView />
    case 'Reporting': return <ReportingView />
    case 'Website': return <WebsiteView />
    case 'Marketplace': return <MarketplaceView />
    case 'Settings': return <SettingsView />
    default: return null
  }
}
