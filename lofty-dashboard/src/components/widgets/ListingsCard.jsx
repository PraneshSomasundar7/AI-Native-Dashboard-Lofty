import { Home, Eye } from 'lucide-react'
import { TagBadge, WidgetShell } from '../shared'

export default function ListingsCard({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div className="flex flex-col gap-2">
        {widget.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${widget.accent}14` }}
            >
              <Home size={18} color={widget.accent} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{item.address}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <TagBadge color={item.status === 'Active' ? '#10B981' : '#F59E0B'}>{item.status}</TagBadge>
                {item.views > 0 && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye size={11} /> {item.views}
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm font-bold text-gray-700">{item.price}</span>
          </div>
        ))}
      </div>
    </WidgetShell>
  )
}
