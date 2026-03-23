import { useState } from 'react'
import { Zap } from 'lucide-react'

export default function Logo({ size = 32, className = '' }) {
  const [useFallback, setUseFallback] = useState(false)

  if (useFallback) {
    return (
      <div
        className={`bg-gradient-to-br from-accent to-orange-500 rounded-lg flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <Zap size={size * 0.56} className="text-white" fill="white" />
      </div>
    )
  }

  return (
    <img
      src="/logo.png"
      alt="LayUp!"
      className={`rounded-lg ${className}`}
      style={{ width: size, height: size }}
      onError={() => setUseFallback(true)}
    />
  )
}
