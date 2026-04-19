import { TrendingUp } from 'lucide-react'
import { WidgetShell } from '../shared'

export default function HotSheetsCard({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div className="flex flex-col gap-2">
        {widget.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${widget.accent}14` }}
            >
              <TrendingUp size={18} color={widget.accent} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.count} properties</p>
            </div>
            <span
              className="text-xs font-bold px-2 py-1 rounded-lg"
              style={{
                color: item.trend.startsWith('+') ? '#10B981' : '#EF4444',
                background: item.trend.startsWith('+') ? '#10B98114' : '#EF444414',
              }}
            >
              {item.trend}
            </span>
          </div>
        ))}
      </div>
    </WidgetShell>
  )
}
