import { ProgressBar, WidgetShell } from '../shared'

export default function TransactionsCard({ widget }) {
  return (
    <WidgetShell widget={widget}>
      <div className="flex flex-col gap-3">
        {widget.items.map((item, i) => (
          <div key={i} className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.address}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.stage}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: widget.accent }}>
                {item.price}
              </span>
            </div>
            <ProgressBar value={item.progress} color={widget.accent} />
          </div>
        ))}
      </div>
    </WidgetShell>
  )
}
