'use client'
import React, { useMemo } from 'react'

type Props = {
  temperature: number
  topK: number
  topP: number
  repetitionPenalty: number
}

export default function PatternRadarChart({ temperature, topK, topP, repetitionPenalty }: Props) {
  // Normalizar valores a escala 0-100 para el radar
  const normalizedValues = useMemo(() => {
    return {
      T: (temperature / 1.3) * 100,
      K: (topK / 150) * 100,
      P: (topP / 1.0) * 100,
      R: ((repetitionPenalty - 1.0) / 1.0) * 100
    }
  }, [temperature, topK, topP, repetitionPenalty])

  // Calcular puntos del polígono (4 vértices en cruz: arriba, derecha, abajo, izquierda)
  const size = 140
  const center = size / 2
  const maxRadius = size / 2 - 10

  const angles = useMemo(() => [0, 90, 180, 270], []) // Temperatura, Top-K, Top-P, Repetición
  const labels = ['T', 'K', 'P', 'R']
  const values = useMemo(() => [normalizedValues.T, normalizedValues.K, normalizedValues.P, normalizedValues.R], [normalizedValues])

  const points = useMemo(() => {
    return angles.map((angle, i) => {
      const rad = ((angle - 90) * Math.PI) / 180
      const radius = (values[i] / 100) * maxRadius
      return {
        x: center + radius * Math.cos(rad),
        y: center + radius * Math.sin(rad)
      }
    })
  }, [values, angles, center, maxRadius])

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')

  // Puntos de referencia (círculos concéntricos)
  const referenceCircles = [25, 50, 75, 100]

  return (
    <div className="glass rounded-xl p-4 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gradient mb-2">Visualización de Parámetros</h3>
      
      <svg width={size} height={size} className="relative">
        {/* Círculos de referencia */}
        {referenceCircles.map((percent) => (
          <circle
            key={percent}
            cx={center}
            cy={center}
            r={(percent / 100) * maxRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Líneas de eje */}
        {angles.map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180
          const x2 = center + maxRadius * Math.cos(rad)
          const y2 = center + maxRadius * Math.sin(rad)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          )
        })}

        {/* Polígono de datos */}
        <polygon
          points={polygonPoints}
          fill="url(#radarGradient)"
          stroke="#00F5FF"
          strokeWidth="2"
          opacity="0.7"
          className="transition-all duration-500"
        />

        {/* Puntos en los vértices */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#FF0055"
              className="animate-pulse-slow"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="none"
              stroke="#00F5FF"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </g>
        ))}

        {/* Labels */}
        {angles.map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180
          const labelRadius = maxRadius + 15
          const x = center + labelRadius * Math.cos(rad)
          const y = center + labelRadius * Math.sin(rad)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#00F5FF"
              fontSize="12"
              fontWeight="bold"
              className="font-mono"
            >
              {labels[i]}
            </text>
          )
        })}

        {/* Gradiente para el polígono */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FF0055" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Leyenda compacta */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs w-full">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-gray-400">T: {temperature.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-gray-400">K: {topK}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-gray-400">P: {topP.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="text-gray-400">R: {repetitionPenalty.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
