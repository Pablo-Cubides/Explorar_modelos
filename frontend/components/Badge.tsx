import React from 'react'

type Level = 'low' | 'medium' | 'high' | 'very-high'

const levelMap: Record<Level,string> = {
  'low': 'Bajo',
  'medium': 'Medio',
  'high': 'Alto',
  'very-high': 'Muy alto'
}

function LevelIcon({level}:{level:Level}){
  const color = level === 'low' ? '#94a3b8' : level === 'medium' ? '#fbbf24' : level === 'high' ? '#34d399' : '#fb7185'
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="inline-block mr-1">
      <circle cx="6" cy="6" r="5" fill={color} />
    </svg>
  )
}

export default function Badge({label, level}:{label:string; level:Level}){
  const human = levelMap[level]
  const cls = `badge badge-${level.replace(' ','-')}`
  return (
    <span title={`${label}: ${human}`} role="status" aria-label={`${label} nivel ${human}`} className={cls}>
      <LevelIcon level={level} />
      <strong className="mr-1 text-xs opacity-90">{label}:</strong>
      <span className="text-xs">{human}</span>
    </span>
  )
}
