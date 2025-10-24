import React from 'react'
import type { CaseItem } from '../types/data'

type Props = {
  cases: CaseItem[]
  value: number
  onChange: (i: number) => void
  id?: string
}

export default function CaseSelector({ cases, value, onChange, id = 'case-select' }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-gradient">
        Caso de Ejemplo
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full p-3 pr-10 text-white rounded-xl glass cursor-pointer appearance-none font-medium
                     hover:border-primary/50 focus:border-primary transition-all duration-300
                     bg-gradient-to-br from-white/5 to-white/0"
        >
          {cases.map((c, i) => (
            <option key={c.id} value={i} className="bg-black text-white">
              {c.title}
            </option>
          ))}
        </select>
        
        {/* Custom arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
          </svg>
        </div>
      </div>
    </div>
  )
}
