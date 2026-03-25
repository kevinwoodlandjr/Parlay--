import { useState } from 'react'

export default function Logo({ size = 32, className = '' }) {
  const [useFallback, setUseFallback] = useState(false)

  if (useFallback) {
    return <TrophyIcon size={size} className={className} />
  }

  return (
    <img
      src="/logo.png"
      alt="SlipMate"
      className={`rounded-lg ${className}`}
      style={{ width: size, height: size }}
      onError={() => setUseFallback(true)}
    />
  )
}

export function TrophyIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Trophy cup body */}
      <path
        d="M18 12h28v24c0 7.73-6.27 14-14 14s-14-6.27-14-14V12z"
        fill="url(#goldGrad)"
        stroke="#8B6914"
        strokeWidth="1.5"
      />
      {/* Left handle */}
      <path
        d="M18 18c-4 0-8 2-8 8s4 8 8 8"
        stroke="#C8962E"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right handle */}
      <path
        d="M46 18c4 0 8 2 8 8s-4 8-8 8"
        stroke="#C8962E"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stem */}
      <rect x="28" y="50" width="8" height="6" rx="1" fill="#8B6914" />
      {/* Base */}
      <rect x="22" y="55" width="20" height="4" rx="2" fill="#C8962E" />
      {/* Checklist lines */}
      <rect x="24" y="20" width="16" height="3" rx="1.5" fill="#F5E6C4" opacity="0.7" />
      <rect x="24" y="26" width="16" height="3" rx="1.5" fill="#F5E6C4" opacity="0.6" />
      <rect x="24" y="32" width="16" height="3" rx="1.5" fill="#F5E6C4" opacity="0.5" />
      {/* Check marks */}
      <path d="M22 21.5l1.5 1.5 2.5-3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 27.5l1.5 1.5 2.5-3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 33.5l1.5 1.5 2.5-3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="goldGrad" x1="32" y1="12" x2="32" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E8C468" />
          <stop offset="1" stopColor="#C8962E" />
        </linearGradient>
      </defs>
    </svg>
  )
}
