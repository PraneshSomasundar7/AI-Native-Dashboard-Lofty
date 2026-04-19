import { useState } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { TagBadge, WidgetShell } from '../shared'

/**
 * TasksCard — renders the "Today's Tasks" list.
 *
 * Props:
 *   widget          — the widget data object (title, icon, accent, items)
 *   removingItemId  — if set, the item with this id plays the slide-out
 *                     animation (driven by the parent's ripple effect)
 */
export default function TasksCard({ widget, removingItemId }) {
  const [checks, setChecks] = useState(() =>
    widget.items.reduce((acc, item) => {
      acc[item.id] = item.done
      return acc
    }, {})
  )

  return (
    <WidgetShell widget={widget}>
      <div className="flex flex-col gap-1">
        {widget.items.map((item) => {
          const isBeingRemoved = removingItemId === item.id
          const isDone = checks[item.id]

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer group transition-colors ${
                isBeingRemoved ? 'item-slide-out' : ''
              }`}
              style={{
                background: item.isAiTask && !isDone
                  ? 'linear-gradient(135deg, #EFF6FF, #F5F3FF)'
                  : isDone
                    ? '#F0FDF4'
                    : 'transparent',
                borderLeft: item.isAiTask && !isDone ? '3px solid #3B82F6' : '3px solid transparent',
              }}
              onClick={() => {
                if (isBeingRemoved) return
                setChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
              }}
            >
              {/* Checkbox */}
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
                style={{
                  borderColor: isDone ? '#10B981' : item.isAiTask ? '#3B82F6' : '#D1D5DB',
                  background: isDone ? '#10B981' : 'transparent',
                }}
              >
                {isDone && <CheckCircle2 size={12} color="white" />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-tight"
                  style={{
                    color: isDone ? '#9CA3AF' : '#1F2937',
                    textDecoration: isDone ? 'line-through' : 'none',
                  }}
                >
                  {item.text}
                </p>
                <p className="text-xs mt-0.5 text-gray-400">{item.time}</p>
              </div>

              {/* Tag */}
              {item.isAiTask ? (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1"
                  style={{
                    background: 'linear-gradient(135deg, #EEF2FF, #DBEAFE)',
                    color: '#3B82F6',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  <Sparkles size={10} /> {item.tag}
                </span>
              ) : (
                <TagBadge color={widget.accent}>{item.tag}</TagBadge>
              )}
            </div>
          )
        })}
      </div>
    </WidgetShell>
  )
}
