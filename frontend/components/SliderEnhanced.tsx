'use client'
import React, { useState } from 'react'

type Props = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  id?: string
  description?: string
  optimalRange?: [number, number]
}

export default function SliderEnhanced({
  label,
  value,
  min,
  max,
  step,
  onChange,
  id,
  description,
  optimalRange
}: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Calcular porcentaje para el gradiente
  const percentage = ((value - min) / (max - min)) * 100
  
  // Calcular posición óptima si existe
  let optimalPercentage = { start: 0, end: 0 }
  if (optimalRange) {
    optimalPercentage = {
      start: ((optimalRange[0] - min) / (max - min)) * 100,
      end: ((optimalRange[1] - min) / (max - min)) * 100
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label 
          htmlFor={id} 
          className="text-sm font-semibold text-white flex items-center gap-2"
        >
          <span className="text-gradient">{label}</span>
          {description && (
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="w-4 h-4 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center hover:bg-primary/30 transition-colors"
              aria-label={`Información sobre ${label}`}
            >
              ?
            </button>
          )}
        </label>
        
        <div className="px-3 py-1 rounded-full bg-gradient-cyber text-black font-bold text-sm">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && description && (
        <div className="glass p-3 rounded-lg text-xs text-gray-300 animate-scale-in">
          {description}
        </div>
      )}

      {/* Slider container */}
      <div className="relative pt-2 pb-6">
        {/* Rango óptimo (si existe) */}
        {optimalRange && (
          <div
            className="absolute h-2 top-2 bg-accent/20 rounded-full pointer-events-none"
            style={{
              left: `${optimalPercentage.start}%`,
              width: `${optimalPercentage.end - optimalPercentage.start}%`
            }}
          />
        )}

        {/* Track */}
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
          {/* Progreso con gradiente */}
          <div
            className="absolute h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, #00F5FF ${percentage > 50 ? '0%' : '50%'}, #FF0055 ${percentage > 50 ? '50%' : '100%'})`
            }}
          />
          
          {/* Glow effect cuando se arrastra */}
          {isDragging && (
            <div
              className="absolute h-full w-8 rounded-full blur-xl opacity-60 pointer-events-none"
              style={{
                left: `${percentage}%`,
                transform: 'translateX(-50%)',
                background: 'radial-gradient(circle, #00F5FF, #FF0055)'
              }}
            />
          )}
        </div>

        {/* Input range (invisible pero funcional) */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute top-0 w-full h-10 opacity-0 cursor-pointer z-10"
          aria-label={label}
        />

        {/* Thumb personalizado */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
          style={{ left: `${percentage}%`, transform: `translate(-50%, -50%) scale(${isDragging ? 1.2 : 1})` }}
        >
          <div className={`w-5 h-5 rounded-full border-3 border-white shadow-glow-cyan ${isDragging ? 'animate-glow' : ''}`}
            style={{
              background: `linear-gradient(135deg, #00F5FF, #FF0055)`,
              boxShadow: isDragging 
                ? '0 0 20px rgba(0, 245, 255, 0.6), 0 0 40px rgba(255, 0, 85, 0.4)' 
                : '0 0 10px rgba(0, 245, 255, 0.4)'
            }}
          />
        </div>

        {/* Mini marcadores en el track */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-xs text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  )
}
