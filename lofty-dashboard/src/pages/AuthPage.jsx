import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Home,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  UserCircle,
  CheckCircle2,
} from 'lucide-react'

export default function AuthPage() {
  const { login, register, loading, error, clearError } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'agent',
  })

  const switchMode = (m) => {
    setMode(m)
    clearError()
    setForm({ email: '', password: '', full_name: '', role: 'agent' })
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'login') {
      await login({ email: form.email, password: form.password })
    } else {
      const result = await register(form)
      if (result.success) {
        setShowSuccessPopup(true)
        setForm({ email: '', password: '', full_name: '', role: 'agent' })
      }
    }
  }

  return (
    <div className="relative">
    {/* Success popup */}
    {showSuccessPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
        <div
          className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
          style={{
            background: 'white',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
            border: '1px solid #E5E7EB',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' }}
          >
            <CheckCircle2 size={32} color="#059669" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Account Created!</h2>
            <p className="text-sm text-gray-500">Your account is ready. Please sign in to continue.</p>
          </div>
          <button
            onClick={() => { setShowSuccessPopup(false); switchMode('login') }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 2px 10px rgba(59,130,246,0.35)' }}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )}
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 40%, #F0FDFA 70%, #F8FAFC 100%)',
      }}
    >
      {/* Decorative background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #06B6D4, transparent 70%)' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
            }}
          >
            <Home size={24} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-800">Lofty</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{
                  background: 'linear-gradient(135deg, #EEF2FF, #DBEAFE)',
                  color: '#3B82F6',
                  border: '1px solid #BFDBFE',
                }}
              >
                AI
              </span>
            </div>
            <p className="text-xs text-gray-400 -mt-0.5">AI-Native Real Estate CRM</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'white',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Tab toggle */}
          <div className="flex border-b border-gray-100">
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => switchMode(tab)}
                className="flex-1 py-3.5 text-sm font-semibold transition-all border-none cursor-pointer"
                style={{
                  background: mode === tab ? 'white' : '#F9FAFB',
                  color: mode === tab ? '#3B82F6' : '#94A3B8',
                  borderBottom: mode === tab ? '2px solid #3B82F6' : '2px solid transparent',
                }}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Error message */}
            {error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                }}
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Full Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    color="#94A3B8"
                  />
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="James Reynolds"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: '1px solid #E2E8F0',
                      background: '#F8FAFC',
                      color: '#1E293B',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                    onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  color="#94A3B8"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#1E293B',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                  onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  color="#94A3B8"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={4}
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#1E293B',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                  onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0.5"
                >
                  {showPassword ? (
                    <EyeOff size={16} color="#94A3B8" />
                  ) : (
                    <Eye size={16} color="#94A3B8" />
                  )}
                </button>
              </div>
            </div>

            {/* Role selector (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'agent', label: 'Real Estate Agent', icon: Building2, desc: 'Manage leads & listings' },
                    { value: 'user', label: 'Home Buyer / Lead', icon: UserCircle, desc: 'Browse properties' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, role: option.value }))}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all text-center"
                      style={{
                        border:
                          form.role === option.value
                            ? '2px solid #3B82F6'
                            : '1px solid #E2E8F0',
                        background:
                          form.role === option.value
                            ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
                            : '#F8FAFC',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            form.role === option.value
                              ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                              : '#E2E8F0',
                        }}
                      >
                        <option.icon
                          size={20}
                          color={form.role === option.value ? 'white' : '#94A3B8'}
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: form.role === option.value ? '#1E40AF' : '#64748B',
                          }}
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed mt-1"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                boxShadow: '0 2px 10px rgba(59,130,246,0.35)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>

            {/* Demo credentials hint */}
            {mode === 'login' && (
              <div
                className="rounded-xl px-4 py-3 mt-1"
                style={{ background: '#F0FDFA', border: '1px solid #CCFBF1' }}
              >
                <p className="text-xs font-semibold mb-1.5" style={{ color: '#0D9488' }}>
                  Demo Credentials
                </p>
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>
                      <strong>Agent:</strong> james@lofty.com
                    </span>
                    <span className="text-gray-400">agent123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      <strong>User:</strong> kristin@gmail.com
                    </span>
                    <span className="text-gray-400">user123</span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by InsForge · Lofty AI Hackathon 2026
        </p>
      </div>
    </div>
    </div>
  )
}
