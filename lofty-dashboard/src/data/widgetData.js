import { ListTodo, Phone, ArrowRightLeft, Building2, Flame, Bell } from 'lucide-react'

/**
 * Initial widget data.
 * Kristin Watson is seeded as the FIRST task in "Today's Tasks" — she'll
 * be removed by the ripple effect when the AOS action completes.
 * Every item has a stable `id` so React can key on it for exit animations.
 */
export function getInitialWidgetColumns() {
  return [
    // ─── Column 1 ───
    [
      {
        title: "Today's Tasks",
        icon: ListTodo,
        accent: '#3B82F6',
        items: [
          {
            id: 'kristin-watson-task',
            text: 'Reach out to Kristin Watson — viewed 42 Oak St 3×',
            time: 'AI Flagged · Just now',
            done: false,
            tag: 'AI Priority',
            isAiTask: true,
          },
          { id: 'task-1', text: 'Follow up with Sarah Chen', time: '9:00 AM', done: false, tag: 'Call' },
          { id: 'task-2', text: 'Send CMA to Thompson family', time: '10:30 AM', done: true, tag: 'Email' },
          { id: 'task-3', text: 'Prepare listing photos for 42 Oak', time: '1:00 PM', done: false, tag: 'Listing' },
          { id: 'task-4', text: 'Schedule showing — 18 Maple Dr', time: '3:00 PM', done: false, tag: 'Showing' },
        ],
      },
      {
        title: 'Need Keep In Touch',
        icon: Phone,
        accent: '#8B5CF6',
        items: [
          { id: 'kit-1', name: 'David Park', days: 14, score: 62, avatar: 'DP' },
          { id: 'kit-2', name: 'Maria Santos', days: 21, score: 55, avatar: 'MS' },
          { id: 'kit-3', name: 'Tom & Lisa R.', days: 30, score: 48, avatar: 'TL' },
        ],
      },
    ],

    // ─── Column 2 ───
    [
      {
        title: 'Transactions',
        icon: ArrowRightLeft,
        accent: '#10B981',
        items: [
          { id: 'tx-1', address: '742 Evergreen Terrace', stage: 'Under Contract', price: '$485,000', progress: 75 },
          { id: 'tx-2', address: '18 Maple Drive', stage: 'Pending', price: '$320,000', progress: 50 },
          { id: 'tx-3', address: '91 Sunset Blvd', stage: 'Closing', price: '$1,200,000', progress: 90 },
        ],
      },
      {
        title: 'My Listings',
        icon: Building2,
        accent: '#F59E0B',
        items: [
          { id: 'lst-1', address: '42 Oak Street', status: 'Active', price: '$550,000', views: 124 },
          { id: 'lst-2', address: '15 River Road', status: 'Coming Soon', price: '$720,000', views: 0 },
          { id: 'lst-3', address: '8 Pine Court', status: 'Active', price: '$389,000', views: 87 },
        ],
      },
    ],

    // ─── Column 3 ───
    [
      {
        title: 'Hot Sheets',
        icon: Flame,
        accent: '#EF4444',
        items: [
          { id: 'hs-1', label: 'New listings in Scottsdale', count: 12, trend: '+3' },
          { id: 'hs-2', label: 'Price reductions — Tempe', count: 5, trend: '+1' },
          { id: 'hs-3', label: 'Sold last 7 days — Mesa', count: 18, trend: '-2' },
        ],
      },
      {
        title: 'New Updates',
        icon: Bell,
        accent: '#06B6D4',
        items: [
          { id: 'upd-1', text: 'Kristin Watson opened your email', time: '2m ago', type: 'email' },
          { id: 'upd-2', text: 'New lead from Zillow — Jake Miller', time: '15m ago', type: 'lead' },
          { id: 'upd-3', text: 'Offer accepted on 742 Evergreen', time: '1h ago', type: 'transaction' },
        ],
      },
    ],
  ]
}
