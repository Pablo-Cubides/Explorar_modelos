import React from 'react'

type Level = 'low' | 'medium' | 'high' | 'very-high'

const levelMap: Record<Level, string> = {
  'low': 'Bajo',
  'medium': 'Medio',
  'high': 'Alto',
  'very-high': 'Muy alto'
}

const levelColors: Record<Level, { gradient: string; glow: string; icon: string }> = {
  'low': {
    gradient: 'linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(100, 116, 139, 0.1))',
    glow: 'rgba(148, 163, 184, 0.3)',
    icon: '○'
  },
  'medium': {
    gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
    glow: 'rgba(251, 191, 36, 0.4)',
    icon: '◐'
  },
  'high': {
    gradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.1))',
    glow: 'rgba(52, 211, 153, 0.4)',
    icon: '◑'
  },
  'very-high': {
    gradient: 'linear-gradient(135deg, rgba(251, 113, 133, 0.2), rgba(244, 63, 94, 0.1))',
    glow: 'rgba(251, 113, 133, 0.4)',
    icon: '●'
  }
}

function LevelIcon({ level }: { level: Level }) {
  const colors: Record<Level, string> = {
    'low': '#94a3b8',
    'medium': '#fbbf24',
    'high': '#34d399',
    'very-high': '#fb7185'
  }
  
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block" aria-hidden>
      <circle cx="7" cy="7" r="5" fill={colors[level]} opacity="0.8" />
      <circle cx="7" cy="7" r="6" stroke={colors[level]} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

export default function Badge({ label, level }: { label: string; level: Level }) {
  const human = levelMap[level]
  const colors = levelColors[level]
  
  return (
    <span
      title={`${label}: ${human}`}
      role="status"
      aria-label={`${label} nivel ${human}`}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 hover:scale-105 cursor-default border animate-scale-in"
      style={{
        background: colors.gradient,
        borderColor: colors.glow,
        boxShadow: `0 0 15px ${colors.glow}`,
      }}
    >
      <LevelIcon level={level} />
      <span className="opacity-90">{label}:</span>
      <span className="font-bold">{human}</span>
    </span>
  )
}
