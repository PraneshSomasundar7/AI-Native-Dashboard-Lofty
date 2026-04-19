import { Avatar, WidgetShell } from '../shared'

export default function KeepInTouchCard({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div className="flex flex-col gap-2">
        {widget.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <Avatar initials={item.avatar} color={widget.accent} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-400">{item.days} days since last contact</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-semibold" style={{ color: widget.accent }}>
                Score {item.score}
              </span>
              <button
                className="text-xs px-3 py-1 rounded-lg font-medium cursor-pointer"
                style={{
                  background: `${widget.accent}12`,
                  color: widget.accent,
                  border: `1px solid ${widget.accent}30`,
                }}
              >
                Reach out
              </button>
            </div>
          </div>
        ))}
      </div>
    </WidgetShell>
  )
}
