import React from 'react'

type Ex = { v: number; text: string }

export default function ExampleList({ examples, highlighted }: { examples: Ex[]; highlighted: string | null }) {
  return (
    <ul className="space-y-3">
      {examples.map((ex, i) => {
        const key = `${i}`
        const isHighlighted = highlighted === key
        
        return (
          <li
            key={i}
            className={`
              example-card rounded-xl transition-all duration-500
              ${isHighlighted ? 'example-highlight' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              {/* Badge de valor */}
              <div className={`
                flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg
                transition-all duration-500
                ${isHighlighted 
                  ? 'bg-gradient-cyber text-black shadow-glow-cyan scale-110' 
                  : 'bg-white/5 text-primary'
                }
              `}>
                {ex.v}
              </div>
              
              {/* Texto */}
              <div className="flex-1 pt-1">
                <p className={`
                  text-sm leading-relaxed transition-colors duration-300
                  ${isHighlighted ? 'text-white font-medium' : 'text-gray-300'}
                `}>
                  {ex.text}
                </p>
              </div>
            </div>
            
            {/* Indicador visual cuando está destacado */}
            {isHighlighted && (
              <div className="mt-3 h-1 rounded-full bg-gradient-cyber animate-shimmer" />
            )}
          </li>
        )
      })}
    </ul>
  )
}
