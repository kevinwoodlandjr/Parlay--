import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, ArrowLeft, Loader2, Zap } from 'lucide-react'

export default function AuthPage({ onBack }) {
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Name is required')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      const { error } = await signUp({ email, password, name, phone })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      }
    } else {
      const { error } = await signIn({ email, password })
      if (error) {
        setError(error.message)
      }
      // If successful, the auth listener in useAuth will update state
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d1a]">
      {/* Header */}
      <div className="px-4 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors cursor-pointer text-sm"
        >
          <ArrowLeft size={16} />
          Back to games
        </button>
      </div>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap size={24} className="text-white" fill="white" />
            </div>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              PARLAY<span className="text-accent">.</span>
            </h1>
            <p className="text-white/30 text-sm mt-1">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green/10 border border-green/20 text-green text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-accent/50 transition-colors"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-accent/50 transition-colors"
                required
              />
            </div>

            {/* Phone (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-white/20">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? '6+ characters' : 'Your password'}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 pr-11 text-white text-sm placeholder:text-white/20 outline-none focus:border-accent/50 transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-white/30 text-sm mt-6">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); setSuccess(null) }}
                  className="text-accent font-semibold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(null) }}
                  className="text-accent font-semibold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
