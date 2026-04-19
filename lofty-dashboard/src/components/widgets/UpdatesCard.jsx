import { MessageSquare, Zap, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { WidgetShell } from '../shared'

const iconMap = {
  email: MessageSquare,
  lead: Zap,
  transaction: CheckCircle2,
  ai_resolved: Sparkles,
}
const colorMap = {
  email: '#3B82F6',
  lead: '#F59E0B',
  transaction: '#10B981',
  ai_resolved: '#10B981',
}

/**
 * Props:
 *   widget    — widget data
 *   newItemId — if set, this item gets the slide-in animation
 */
export default function UpdatesCard({ widget, newItemId }) {
  return (
    <WidgetShell widget={widget}>
      <div className="flex flex-col gap-1">
        {widget.items.map((item) => {
          const Icon = iconMap[item.type] || MessageSquare
          const c = colorMap[item.type] || '#3B82F6'
          const isNew = newItemId === item.id

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors ${
                isNew ? 'new-item-slide-in' : ''
              }`}
              style={
                isNew
                  ? { background: '#F0FDF4', borderLeft: '3px solid #10B981' }
                  : {}
              }
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${c}14` }}
              >
                <Icon size={15} color={c} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">
                  {item.text}
                  {isNew && (
                    <span
                      className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ background: '#DCFCE7', color: '#16A34A' }}
                    >
                      NEW
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={10} /> {item.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </WidgetShell>
  )
}
