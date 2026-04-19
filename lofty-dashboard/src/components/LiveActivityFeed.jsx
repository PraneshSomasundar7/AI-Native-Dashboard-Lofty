import { Eye, TrendingUp, Activity } from 'lucide-react'

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date) / 1000)
  if (secs < 60)  return 'Just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  return `${Math.floor(secs / 3600)}h ago`
}

export default function LiveActivityFeed({ activities }) {
  return (
    <div className="mb-5 rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' }}>
            <Activity size={15} color="#059669" />
            {/* Pulsing live dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#22C55E' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ background: '#16A34A' }} />
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Live Activity Feed</p>
            <p className="text-xs text-gray-400">Real-time lead interactions</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
          {activities.length} event{activities.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Feed */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: '#F8FAFC' }}>
            <Eye size={20} color="#CBD5E1" />
          </div>
          <p className="text-sm text-gray-400">Monitoring active — waiting for lead interactions</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
          {activities.map(act => (
            <div
              key={act.id}
              className="flex items-center gap-3 px-5 py-3 transition-colors"
              style={{
                background: act.isHighInterest ? 'linear-gradient(135deg, #FFFBEB, #FEF9EC)' : 'white',
              }}
            >
              {/* Icon */}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: act.isHighInterest
                    ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)'
                    : '#F8FAFC',
                  border: act.isHighInterest ? '1px solid #FCD34D' : '1px solid #F1F5F9',
                }}>
                {act.isHighInterest
                  ? <TrendingUp size={15} color="#D97706" />
                  : <Eye size={15} color="#94A3B8" />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {act.isHighInterest && (
                    <span className="mr-1 px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ background: '#FEF3C7', color: '#B45309' }}>
                      HIGH INTEREST
                    </span>
                  )}
                  {act.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {act.propertyTitle}
                  {act.viewCount > 0 && (
                    <span className="ml-1.5 font-medium"
                      style={{ color: act.viewCount >= 3 ? '#DC2626' : '#94A3B8' }}>
                      · {act.viewCount} view{act.viewCount !== 1 ? 's' : ''}
                    </span>
                  )}
                  {act.leadScore > 0 && (
                    <span className="ml-1.5 font-medium" style={{ color: '#6366F1' }}>
                      · Score {act.leadScore}
                    </span>
                  )}
                </p>
              </div>

              {/* Time */}
              <span className="text-xs text-gray-400 shrink-0">{timeAgo(act.time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
