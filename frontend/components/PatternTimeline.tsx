'use client'
import React from 'react'

type Props = {
  currentPattern: string
  patterns: string[]
}

const patternEmojis: Record<string, string> = {
  A: '🎯',
  B: '📊',
  C: '⚖️',
  D: '🎨',
  E: '🚀',
  F: '🔄',
  G: '🎪',
  H: '🧩',
  I: '⚡',
  J: '🔬'
}

const patternDescriptionsShort: Record<string, string> = {
  A: 'Determinista',
  B: 'Conservador',
  C: 'Balanceado',
  D: 'Creativo',
  E: 'Máx. creatividad',
  F: 'Variado',
  G: 'Alta diversidad',
  H: 'Moderado',
  I: 'Impredecible',
  J: 'Preciso'
}

export default function PatternTimeline({ currentPattern, patterns }: Props) {
  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gradient mb-4 text-center">
        Patrón Actual: <span className="text-xl">{currentPattern}</span>
      </h3>
      
      <div className="relative">
        {/* Línea de timeline */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 -translate-y-1/2" />
        
        {/* Patrones */}
        <div className="relative flex justify-between items-center">
          {patterns.map((pattern) => {
            const isActive = pattern === currentPattern
            const emoji = patternEmojis[pattern] || '●'
            const desc = patternDescriptionsShort[pattern] || pattern
            
            return (
              <div key={pattern} className="flex flex-col items-center group">
                {/* Nodo */}
                <div
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm
                    transition-all duration-300 cursor-default
                    ${isActive 
                      ? 'bg-gradient-cyber text-black scale-125 shadow-glow-cyan animate-pulse-slow' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:scale-110'
                    }
                  `}
                  title={`${pattern}: ${desc}`}
                >
                  <span className="text-lg">{emoji}</span>
                  
                  {/* Indicador activo */}
                  {isActive && (
                    <div className="absolute -inset-1 rounded-full border-2 border-primary animate-ping opacity-50" />
                  )}
                </div>
                
                {/* Label */}
                <div className={`
                  mt-2 text-xs font-semibold transition-all duration-300
                  ${isActive ? 'text-primary scale-110' : 'text-gray-500 group-hover:text-gray-300'}
                `}>
                  {pattern}
                </div>
                
                {/* Descripción en hover */}
                <div className="absolute top-full mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="glass px-3 py-1 rounded-lg text-xs whitespace-nowrap">
                    {desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Descripción del patrón actual */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-cyber/10 border border-primary/30">
          <span className="text-2xl">{patternEmojis[currentPattern]}</span>
          <span className="text-sm font-medium text-gray-300">
            {patternDescriptionsShort[currentPattern]}
          </span>
        </div>
      </div>
    </div>
  )
}
