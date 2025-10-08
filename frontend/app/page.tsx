"use client"
import React, { useEffect, useState } from 'react'

type Buckets = Record<string, Record<string, [number, number]>>
type Patterns = Record<string, Record<string, string>>

import data from '../data/cases'

export default function Home() {
  const [caseIndex, setCaseIndex] = useState(0)
  const [temperature, setTemperature] = useState(0.7)
  const [topK, setTopK] = useState(50)
  const [topP, setTopP] = useState(0.95)
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.0)
  const [displayed, setDisplayed] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingSeed, setTypingSeed] = useState(0) // para forzar reanimación

  const buckets = data.buckets as any
  const patterns = data.patterns as any
  const cases = data.cases as any

  function mapToBucketT(t: number){
    for (const k of Object.keys(buckets.T)){
      const [a,b] = buckets.T[k]
      if (t>=a && t<=b) return k
    }
    return 'T4'
  }
  function mapToBucketK(kv: number){
    for (const k of Object.keys(buckets.K)){
      const [a,b] = buckets.K[k]
      if (kv>=a && kv<=b) return k
    }
    return 'K3'
  }
  function mapToBucketP(pv: number){
    for (const k of Object.keys(buckets.P)){
      const [a,b] = buckets.P[k]
      if (pv>=a && pv<=b) return k
    }
    return 'P3'
  }
  function mapToBucketR(rv: number){
    for (const k of Object.keys(buckets.R)){
      const [a,b] = buckets.R[k]
      if (rv>=a && rv<=b) return k
    }
    return 'R3'
  }

  function choosePattern(tb: string, kb: string, pb: string, rb: string){
    // score each pattern by matches, return highest; tie-breaker A->J
    let best = {pat: 'A', score: -1}
    for (const p of Object.keys(patterns)){
      const pat = patterns[p]
      let score = 0
      if (pat.T === tb) score++
      if (pat.K === kb) score++
      if (pat.P === pb) score++
      if (pat.R === rb) score++
      if (score>best.score || (score===best.score && p < best.pat)){
        best = {pat: p, score}
      }
    }
    return best.pat
  }

  const tb = mapToBucketT(temperature)
  const kb = mapToBucketK(topK)
  const pb = mapToBucketP(topP)
  const rb = mapToBucketR(repetitionPenalty)
  const selectedPattern = choosePattern(tb,kb,pb,rb)
  const currentCase = cases[caseIndex]
  const variantText = currentCase?.variants?.[selectedPattern]
  const safeText: string = typeof variantText === 'string' ? variantText : ''

  // Typewriter effect whenever the output or sliders/case change
  useEffect(() => {
    let cancelled = false
    setDisplayed("")
    setIsTyping(true)
    const text = safeText
    let i = 0
    const stepMs = 22 // velocidad de tipeo
    const timeouts: number[] = []
    const tick = () => {
      if (cancelled) return
      if (i < text.length) {
        // Cortamos por índice para evitar acumulaciones con estado previo
        setDisplayed(text.slice(0, i + 1))
        i++
        timeouts.push(window.setTimeout(tick, stepMs))
      } else {
        setIsTyping(false)
      }
    }
    timeouts.push(window.setTimeout(tick, stepMs))
    return () => {
      cancelled = true
      timeouts.forEach(window.clearTimeout)
    }
    // re-type on any control/case change
  }, [safeText, temperature, topK, topP, repetitionPenalty, caseIndex, typingSeed])

  async function exportPNG(){
    try {
      const el = document.querySelector('main') as HTMLElement
      if (!el) {
        alert('No se pudo encontrar el elemento para exportar')
        return
      }
      // dynamic import to avoid bundling if not used
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(el)
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'exploramodelo_result.png'
      link.click()
    } catch (error) {
      console.error('Error exportando PNG:', error)
      alert('Error al exportar PNG. La funcionalidad de descarga JSON sigue disponible.')
    }
  }

  function downloadJSON(){
    const payload = {case: currentCase.id, pattern: selectedPattern, params: {temperature, topK, topP, repetitionPenalty}, text: variantText}
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exploramodelo_result.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="max-w-6xl p-8 mx-auto text-white animate-fadeIn">
      <header className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-sm" style={{backgroundColor:'var(--primary)'}} />
        <h1 className="text-xl font-semibold">ExploraModelo</h1>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="block mb-2">Caso</label>
          <select value={caseIndex} onChange={e=>setCaseIndex(parseInt(e.target.value))} className="w-full p-2 text-white rounded bg-surface">
            {cases.map((c:any, i:number)=> <option key={c.id} value={i}>{c.title}</option>)}
          </select>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block">Temperatura <span className="text-gray-400">({temperature.toFixed(2)})</span></label>
              <input aria-label="Temperatura" type="range" min="0.05" max="1.3" step="0.01" value={temperature} onChange={e=>setTemperature(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block">Top-k <span className="text-gray-400">({topK})</span></label>
              <input aria-label="Top-k" type="range" min="1" max="150" step="1" value={topK} onChange={e=>setTopK(parseInt(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block">Top-p <span className="text-gray-400">({topP.toFixed(2)})</span></label>
              <input aria-label="Top-p" type="range" min="0.10" max="1.0" step="0.01" value={topP} onChange={e=>setTopP(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block">Penalización repetición <span className="text-gray-400">({repetitionPenalty.toFixed(2)})</span></label>
              <input aria-label="Penalización por repetición" type="range" min="1.00" max="2.00" step="0.01" value={repetitionPenalty} onChange={e=>setRepetitionPenalty(parseFloat(e.target.value))} className="w-full" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="p-6 border border-gray-800 rounded-lg shadow-sm bg-surface">
            {/* Prompt pequeño como contexto, sin encabezar "Antes" */}
            <p className="text-sm italic text-gray-400">{currentCase.title}...</p>

            {/* Respuesta grande con efecto de tipeo */}
            <div aria-live="polite" role="status" className="mt-3 text-2xl md:text-3xl leading-relaxed font-medium whitespace-pre-wrap min-h-[8rem]">
              {displayed}
              <span className={`inline-block w-1.5 h-6 ml-1 align-baseline ${isTyping ? 'bg-primary animate-pulse' : 'bg-transparent'}`} aria-hidden />
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              <button onClick={exportPNG} className="px-3 py-2 text-white rounded bg-primary/90 hover:bg-primary">Exportar PNG</button>
              <button onClick={downloadJSON} className="px-3 py-2 border border-gray-700 rounded bg-surface hover:border-gray-600">Descargar JSON</button>
              <button onClick={()=>{ setDisplayed(""); setTypingSeed((s)=>s+1); }} className="px-3 py-2 border border-gray-700 rounded bg-surface hover:border-gray-600">Reproducir</button>
            </div>

            {/* Explicación dinámica breve */}
            <ParamExplanation tb={tb} kb={kb} pb={pb} rb={rb} />
          </div>
        </div>
      </section>
    </main>
  )
}

// Bloque de explicación de parámetros
function ParamExplanation({tb, kb, pb, rb}:{tb:string; kb:string; pb:string; rb:string}){
  const tDesc = {
    T0: [
      'Muy baja: casi sin aleatoriedad, prioriza siempre lo más probable.',
      'Produce respuestas muy predecibles, estables y coherentes.',
      'Útil para definiciones y resúmenes precisos; poca creatividad.'
    ],
    T1: [
      'Baja: introduce algo de variedad manteniendo control.',
      'Mejora el tono natural sin arriesgar coherencia.',
      'Recomendable para explicaciones con un leve toque humano.'
    ],
    T2: [
      'Media: equilibrio entre precisión y creatividad.',
      'Permite alternativas interesantes sin perder el hilo.',
      'Adecuada para textos generales y recomendaciones.'
    ],
    T3: [
      'Alta: mayor diversidad y sorpresa en las elecciones.',
      'Puede divagar o cambiar de estilo, gana expresividad.',
      'Útil para lluvia de ideas o estilos más literarios.'
    ],
    T4: [
      'Muy alta: comportamiento muy creativo y poco predecible.',
      'Aumenta el riesgo de incoherencia o contradicciones.',
      'Solo para cuando buscas variedad extrema o inspiración.'
    ]
  } as Record<string,string[]>
  const kDesc = {
    K0: [
      'Top‑k muy bajo: considera muy pocas opciones por paso.',
      'Hace el texto más determinista y repetible.',
      'Reduce errores pero también la riqueza de vocabulario.'
    ],
    K1: [
      'Top‑k moderado: abre un poco el abanico de palabras.',
      'Aumenta la naturalidad sin perder demasiado control.',
      'Suele combinarse bien con T baja o media.'
    ],
    K2: [
      'Top‑k alto: muchas alternativas disponibles en cada paso.',
      'Mejora la diversidad y variación de frases.',
      'Útil si el texto suena repetitivo con valores más bajos.'
    ],
    K3: [
      'Top‑k muy alto: abanico enorme y gran diversidad.',
      'Potencia creatividad pero puede dispersar el mensaje.',
      'Recomendable con T más baja para compensar.'
    ]
  } as Record<string,string[]>
  const pDesc = {
    P0: [
      'Top‑p (núcleo) pequeño: solo el conjunto más probable.',
      'Las decisiones se toman dentro de un núcleo compacto.',
      'Resultados muy fiables pero menos variados.'
    ],
    P1: [
      'Top‑p moderado: mezcla de tokens confiables y algunos nuevos.',
      'Buen balance entre seguridad y frescura.',
      'Suele ser un punto dulce para textos informativos.'
    ],
    P2: [
      'Top‑p amplio: el núcleo incluye más posibilidades.',
      'Aumenta la diversidad y el color del lenguaje.',
      'Combina bien con T media para mantener coherencia.'
    ],
    P3: [
      'Top‑p máximo: apenas se filtra por probabilidad acumulada.',
      'Gran variedad de resultados, a veces menos consistentes.',
      'Útil para explorar alternativas o estilos creativos.'
    ]
  } as Record<string,string[]>
  const rDesc = {
    R0: [
      'Sin penalización por repetición: el modelo puede reiterar frases.',
      'Conviene cuando repetir conceptos es deseable (ej., énfasis).',
      'Riesgo de muletillas o bucles si T/K/P son altos.'
    ],
    R1: [
      'Penalización ligera: reduce muletillas sin cambiar el tono.',
      'Suele bastar para mejorar la fluidez del texto.',
      'Recomendable como valor por defecto junto a T media.'
    ],
    R2: [
      'Penalización notable: evita repetir y fuerza variación.',
      'Mejora la legibilidad cuando hay redundancias.',
      'En exceso puede sustituir palabras clave útiles.'
    ],
    R3: [
      'Penalización fuerte: busca siempre términos nuevos.',
      'Maximiza la novedad pero puede perder precisión.',
      'Úsala solo si detectas repetición persistente.'
    ]
  } as Record<string,string[]>

  return (
    <div className="pt-4 mt-6 text-sm text-gray-300 border-t border-gray-800">
      <ul className="space-y-3">
        <li>
          <strong className="text-white">Temperatura</strong>
          {tDesc[tb]?.map((s, i) => (
            <p key={i} className={i === 2 ? 'opacity-80' : ''}>{s}</p>
          ))}
        </li>
        <li>
          <strong className="text-white">Top‑k</strong>
          {kDesc[kb]?.map((s, i) => (
            <p key={i} className={i === 2 ? 'opacity-80' : ''}>{s}</p>
          ))}
        </li>
        <li>
          <strong className="text-white">Top‑p</strong>
          {pDesc[pb]?.map((s, i) => (
            <p key={i} className={i === 2 ? 'opacity-80' : ''}>{s}</p>
          ))}
        </li>
        <li>
          <strong className="text-white">Penalización por repetición</strong>
          {rDesc[rb]?.map((s, i) => (
            <p key={i} className={i === 2 ? 'opacity-80' : ''}>{s}</p>
          ))}
        </li>
      </ul>
    </div>
  )
}
