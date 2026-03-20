import { useState } from 'react'

export default function TeamLogo({ src, abbr, size = 32, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-white/10 text-white/60 font-bold shrink-0 ${className}`}
        style={{ width: size, height: size, minWidth: size, fontSize: size * 0.35 }}
      >
        {abbr}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={abbr}
      className={`object-contain shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size }}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}
