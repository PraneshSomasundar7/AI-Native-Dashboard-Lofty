import { ChevronRight } from 'lucide-react'

export function TagBadge({ children, color }) {
  return (
    <span
      style={{
        background: `${color}14`,
        color: color,
        border: `1px solid ${color}30`,
      }}
      className="text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
    >
      {children}
    </span>
  )
}

export function Avatar({ initials, color }) {
  return (
    <div
      style={{ background: `${color}18`, color: color }}
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
    >
      {initials}
    </div>
  )
}

export function ProgressBar({ value, color }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: `${color}18` }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background: color,
          transition: 'width 1s ease',
        }}
      />
    </div>
  )
}

export function WidgetShell({ widget, children }) {
  const Icon = widget.icon
  return (
    <div
      className="rounded-xl overflow-hidden bg-white border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${widget.accent}14` }}>
            <Icon size={16} color={widget.accent} />
          </div>
          <h3 className="text-sm font-semibold text-gray-800 tracking-tight">{widget.title}</h3>
        </div>
        <button className="text-gray-300 hover:text-gray-500 p-1 rounded-lg hover:bg-gray-50 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  )
}
