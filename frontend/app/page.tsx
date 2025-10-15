"use client"
import React, { useEffect, useMemo, useState } from 'react'
import data from '../data/cases'
import type { DataRoot, CaseItem } from '../types/data'
import { mapToBucketT, mapToBucketK, mapToBucketP, mapToBucketR, choosePattern } from '../utils/decoding'
import ParameterSlider from '../components/ParameterSlider'
import CaseSelector from '../components/CaseSelector'
import ExampleList from '../components/ExampleList'

// Componentes auxiliares para la nueva estructura educativa
function StepHeader({num, title}:{num:number; title:string}){
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/90 text-black font-bold">{num}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  )
}

function ParamCard({title, summary}:{title:string; summary:string}){
  return (
    <div className="p-4 border border-gray-800 rounded-lg bg-surface/80">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-300">{summary}</p>
    </div>
  )
}

export default function Home(){
  // parámetros centrales del playground
  const [caseIndex, setCaseIndex] = useState(0)
  const [temperature, setTemperature] = useState(0.7)
  const [topK, setTopK] = useState(50)
  const [topP, setTopP] = useState(0.95)
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.0)
  const [displayed, setDisplayed] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingSeed, setTypingSeed] = useState(0)

  const buckets = (data as unknown as DataRoot).buckets
  const patterns = (data as unknown as DataRoot).patterns
  const cases = (data as unknown as DataRoot).cases as CaseItem[]

  // mapping to buckets and choosePattern use utils in ../utils/decoding

  const tb = mapToBucketT(buckets, temperature)
  const kb = mapToBucketK(buckets, topK)
  const pb = mapToBucketP(buckets, topP)
  const rb = mapToBucketR(buckets, repetitionPenalty)
  const selectedPattern = choosePattern(patterns, tb, kb, pb, rb)
  const currentCase = cases[caseIndex]
  const variantText = currentCase?.variants?.[selectedPattern]
  const safeText: string = typeof variantText === 'string' ? variantText : ''

  // Typewriter (uso el mismo patrón seguro)
  useEffect(()=>{
    let cancelled=false
    setDisplayed("")
    setIsTyping(true)
    const text=safeText
    let i=0
    const stepMs=20
    const timeouts:number[]=[]
    const tick=()=>{ if(cancelled) return; if(i<text.length){ setDisplayed(text.slice(0,i+1)); i++; timeouts.push(window.setTimeout(tick,stepMs)) } else setIsTyping(false) }
    timeouts.push(window.setTimeout(tick,stepMs))
    return ()=>{ cancelled=true; timeouts.forEach(window.clearTimeout) }
  },[safeText,temperature,topK,topP,repetitionPenalty,caseIndex,typingSeed])

  async function exportPNG(){
    try{
      const el = document.querySelector('main') as HTMLElement
      if(!el) throw new Error('Main element not found')
      const mod = await import('html2canvas')
      const html2canvas = (mod as any).default ?? mod
      const canvas = await html2canvas(el)
      const dataUrl = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'exploramodelo_result.png'
      a.click()
    }catch(e){
      console.error('exportPNG failed:', e)
      // fallback: download JSON instead
      try{ downloadJSON(); alert('PNG export falló; se descargó JSON con los datos del ejemplo.') }catch(err){ console.error('fallback download failed', err) }
    }
  }
  function downloadJSON(){ const payload={case: currentCase.id, pattern:selectedPattern, params:{temperature,topK,topP,repetitionPenalty}, text: variantText}; const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='exploramodelo_result.json'; a.click(); URL.revokeObjectURL(url) }

  // contenido académico para cada parámetro (resumen + ejemplos)
  type Example = { v:number; text:string }
  type Academic = {
    temperatura: { summary:string; examples: Example[] }
    topk: { summary:string; examples: Example[] }
    topp: { summary:string; examples: Example[] }
    repetition: { summary:string; examples: Example[] }
  }

  const academic:Academic = useMemo(()=>({
    temperatura: {
      summary: 'Controla la aleatoriedad del muestreo: valores bajos hacen las predicciones más deterministas; valores altos introducen variedad y creatividad.',
      examples: [
        {v:0.1, text:'Salida conservadora: frases muy previsibles y repetibles.'},
        {v:0.7, text:'Equilibrio: respuestas variadas pero coherentes.'},
        {v:1.2, text:'Muy creativa: alto riesgo de incoherencias, útil para brainstorming.'}
      ]
    },
    topk: {
      summary: 'Limita el número de candidatos considerados por paso a los k tokens más probables; reduce la entropía en cada paso.',
      examples: [
        {v:5, text:'Top-k bajo: texto más repetitivo, seguro.'},
        {v:50, text:'Top-k intermedio: buena variedad sin perder foco.'},
        {v:150, text:'Top-k alto: muchas opciones, mayor diversidad.'}
      ]
    },
    topp: {
      summary: 'Top-p (nucleus sampling) selecciona del conjunto más probable cuya probabilidad acumulada alcanza p; controla núcleo de distribución.',
      examples: [
        {v:0.2, text:'Núcleo pequeño: decisiones conservadoras.'},
        {v:0.8, text:'Núcleo amplio: más alternativas plausibles.'},
        {v:0.99, text:'Casi sin filtro: mucha variación.'}
      ]
    },
    repetition: {
      summary: 'Penaliza repetir tokens o frases, útil para evitar muletillas y bucles en la generación.',
      examples: [
        {v:1.0, text:'Sin penalización: puede repetir conceptos.'},
        {v:1.3, text:'Penalización moderada: reduce repeticiones comunes.'},
        {v:1.8, text:'Fuerte penalización: fuerza diversidad de palabras aunque puede perder precisión.'}
      ]
    }
  }),[])
  const [activeStep, setActiveStep] = useState(1)
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [subStep, setSubStep] = useState(0) // 0..3 for the four parameters inside step 2

  // highlight helper: mark example key and remove after timeout
  function pulseHighlight(key:string){
    setHighlighted(key)
    window.setTimeout(()=> setHighlighted(null), 700)
  }

  // Helpers to choose the most representative example index for a given parameter value
  function nearestIndexForExamples(examples:any[], value:number){
    if(!examples || examples.length===0) return 0
    let bestIdx=0
    let bestDist=Number.POSITIVE_INFINITY
    for(let i=0;i<examples.length;i++){
      const v=examples[i].v
      const d=Math.abs(v-value)
      if(d<bestDist){ bestDist=d; bestIdx=i }
    }
    return bestIdx
  }

  // Explicit, human-friendly Spanish descriptions for each pattern (A..J)
  const patternDescriptions: Record<string,string> = useMemo(()=>({
    A: 'Súper determinista y sobrio: salidas muy previsibles y precisas (baja creatividad), útil cuando buscas exactitud.',
    B: 'Conservador y claro: respuestas seguras y legibles, con un buen balance de coherencia.',
    C: 'Balanceado: mezcla coherencia y variedad, apropiado para respuestas informativas.',
    D: 'Creativo controlado: más variedad y expresividad, mantiene cierto orden; puede usar imágenes evocadoras.',
    E: 'Máxima creatividad: salida muy diversa y sorprendente; ideal para brainstorming, menos precisa.',
    F: 'Variado y con control de repeticiones: ofrece diversidad evitando muletillas.',
    G: 'Alta diversidad con núcleo estrecho: muchas opciones pero centradas en ideas clave.',
    H: 'Moderado y natural: tono equilibrado y fluido, buen ajuste general.',
    I: 'Alta temperatura con pocas opciones: sorprendente y conciso; respuestas cortas e impredecibles.',
    J: 'Preciso y sin repeticiones: salidas concretas y enfocadas, evita redundancias.'
  }),[])

  return (
    <main className="max-w-7xl mx-auto p-8 text-white">
      <header className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-sm shadow-sm" style={{backgroundColor:'var(--primary)'}} />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">ExploraModelo — Guía académica de parámetros de decodificación</h1>
          <p className="text-sm text-gray-300 max-w-2xl">Aplicación educativa para comprender y experimentar cómo los parámetros de muestreo afectan salidas de modelos de lenguaje.</p>
        </div>
      </header>

      {/* Stepper */}
      <div className="mb-6 stepper flex items-center gap-3">
        {[1,2,3,4].map(n=> (
          <button key={n} onClick={()=>setActiveStep(n)} className={`step-dot ${activeStep===n ? 'bg-primary text-black' : 'bg-black/20 text-gray-300'}`} aria-label={`Ir al paso ${n}`}>{n}</button>
        ))}
        <div className="ml-3 text-sm text-gray-400">1 Qué es • 2 Parámetros • 3 Playground • 4 Bibliografía</div>
      </div>

      {/* Step 1: Resumen general (parameters stacked under description) */}
      {activeStep===1 && (
        <section className="mb-8 animate-step"> 
          <StepHeader num={1} title="¿Qué hace esta app?" />
          <div className="p-4 bg-surface/80 border border-gray-800 rounded mb-4">
            <p className="text-gray-300">Esta aplicación es un recurso académico que demuestra, paso a paso, cómo los parámetros de decodificación (Temperatura, Top-k, Top-p y Penalización por repetición) influyen en la generación de texto por un LLM. Primero explicamos cada parámetro conceptualmente, luego mostramos ejemplos numéricos y, finalmente, permitimos experimentar con ejemplos prácticos (playground).</p>
          </div>

          <div className="space-y-3">
            <ParamCard title="Temperatura" summary="Controla la aleatoriedad en el muestreo: valores bajos (p.ej. 0.1) concentran probabilidad en el modo más probable; valores intermedios (~0.7) equilibran coherencia y variedad; valores altos (>1.0) amplifican la diversidad y el riesgo de incoherencia." />
            <ParamCard title="Top-k" summary="Limita el número absoluto de candidatos considerados en cada paso. Un k pequeño fuerza al modelo a elegir entre muy pocas opciones (salidas predecibles), un k grande permite mucha diversidad but puede introducir ruido." />
            <ParamCard title="Top-p" summary="Selecciona el 'núcleo' probabilístico acumulado hasta alcanzar la masa p. A diferencia de top-k, top-p adapta el tamaño del conjunto según la distribución: útil para balance adaptativo entre seguridad y creatividad." />
            <ParamCard title="Penalización por repetición" summary="Reduce la probabilidad de volver a escoger tokens ya generados, evitando bucles y muletillas; un valor moderado mejora diversidad sin sacrificar coherencia." />
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={()=>setActiveStep(2)} className="btn btn-primary">Siguiente</button>
          </div>
        </section>
      )}

      {/* Step 2: Parámetros — página dedicada (oculta resto) */}
      {activeStep===2 && (
        <section className="mb-8 animate-step">
          <StepHeader num={2} title="Parámetros — explicación detallada y ejemplos" />
          <div className="space-y-6">
            {subStep===0 && (
              <div className="p-6 bg-surface/90 border border-gray-800 rounded">
                <h3 className="text-lg font-semibold mb-2">Temperatura</h3>
                <p className="text-sm text-gray-300 mb-3">{academic.temperatura.summary} En esta sección profundizamos en cómo la temperatura afecta la distribución de probabilidad y ejemplos prácticos de cuándo ajustar T para tareas específicas (e.g., redacción formal vs brainstorming).</p>
                <ExampleList examples={academic.temperatura.examples} highlighted={highlighted ? highlighted.replace('temp-','') : null} />
                <div className="mt-4 flex justify-between">
                  <button onClick={()=>setSubStep(1)} className="btn btn-primary">Siguiente: Top-k</button>
                </div>
              </div>
            )}

            {subStep===1 && (
              <div className="p-6 bg-surface/90 border border-gray-800 rounded">
                <h3 className="text-lg font-semibold mb-2">Top‑k</h3>
                <p className="text-sm text-gray-300 mb-3">{academic.topk.summary} Aquí profundizamos en el trade-off entre control y diversidad al fijar un k fijo, y ejemplos de ajustes para tareas de completado o generación controlada.</p>
                <ExampleList examples={academic.topk.examples} highlighted={highlighted ? highlighted.replace('k-','') : null} />
                <div className="mt-4 flex justify-between">
                  <button onClick={()=>setSubStep(0)} className="btn btn-ghost">Anterior: Temperatura</button>
                  <button onClick={()=>setSubStep(2)} className="btn btn-primary">Siguiente: Top-p</button>
                </div>
              </div>
            )}

            {subStep===2 && (
              <div className="p-6 bg-surface/90 border border-gray-800 rounded">
                <h3 className="text-lg font-semibold mb-2">Top‑p</h3>
                <p className="text-sm text-gray-300 mb-3">{academic.topp.summary} Profundizamos en cómo el núcleo adaptativo evita forzar un tamaño fijo y ejemplos prácticos para diferentes tareas (resumen, diálogo, creatividad).</p>
                <ExampleList examples={academic.topp.examples} highlighted={highlighted ? highlighted.replace('p-','') : null} />
                <div className="mt-4 flex justify-between">
                  <button onClick={()=>setSubStep(1)} className="btn btn-ghost">Anterior: Top-k</button>
                  <button onClick={()=>setSubStep(3)} className="btn btn-primary">Siguiente: Repetición</button>
                </div>
              </div>
            )}

            {subStep===3 && (
              <div className="p-6 bg-surface/90 border border-gray-800 rounded">
                <h3 className="text-lg font-semibold mb-2">Penalización por repetición</h3>
                <p className="text-sm text-gray-300 mb-3">{academic.repetition.summary} Estrategias para ajustar la penalización y ejemplos sobre cómo evitar repeticiones sin perder coherencia semántica.</p>
                <ExampleList examples={academic.repetition.examples} highlighted={highlighted ? highlighted.replace('r-','') : null} />
                <div className="mt-4 flex justify-between">
                  <button onClick={()=>setSubStep(2)} className="btn btn-ghost">Anterior: Top-p</button>
                  <div className="flex gap-2">
                    <button onClick={()=>setSubStep(0)} className="btn btn-ghost">Revisar desde el inicio</button>
                    <button onClick={()=>{ setActiveStep(3); setSubStep(0) }} className="btn btn-primary">Ir al Playground</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 3: Playground interactivo (página dedicada) */}
      {activeStep===3 && (
        <section className="mb-12 animate-step">
          <StepHeader num={3} title="Playground — prueba y observa" />

          <div className="grid md:grid-cols-3 gap-6">
          <aside className="md:col-span-1 p-4 bg-surface/80 border border-gray-800 rounded">
            <CaseSelector cases={cases} value={caseIndex} onChange={setCaseIndex} />

            <div className="mt-4 space-y-4">
              <ParameterSlider label="Temperatura" value={temperature} min={0.05} max={1.3} step={0.01} onChange={v=>{ setTemperature(v); const idx=nearestIndexForExamples(academic.temperatura.examples,v); pulseHighlight(`temp-${idx}`) }} id="slider-temp" />

              <ParameterSlider label="Top-k" value={topK} min={1} max={150} step={1} onChange={v=>{ setTopK(Math.round(v)); const idx=nearestIndexForExamples(academic.topk.examples,v); pulseHighlight(`k-${idx}`) }} id="slider-k" />

              <ParameterSlider label="Top-p" value={topP} min={0.10} max={1.0} step={0.01} onChange={v=>{ setTopP(v); const idx=nearestIndexForExamples(academic.topp.examples,v); pulseHighlight(`p-${idx}`) }} id="slider-p" />

              <ParameterSlider label="Penalización por repetición" value={repetitionPenalty} min={1.00} max={2.00} step={0.01} onChange={v=>{ setRepetitionPenalty(v); const idx=nearestIndexForExamples(academic.repetition.examples,v); pulseHighlight(`r-${idx}`) }} id="slider-r" />
            </div>
          </aside>

          <div className="md:col-span-2 p-6 bg-surface/90 border border-gray-800 rounded">
            <p className="text-sm italic text-gray-400">{currentCase.title}...</p>
            <div aria-live="polite" role="status" className="mt-4 text-2xl md:text-3xl leading-relaxed font-medium whitespace-pre-wrap min-h-[8rem]">
              {displayed}
              <span className={`inline-block w-1.5 h-6 ml-1 align-baseline ${isTyping ? 'bg-primary animate-pulse' : 'bg-transparent'}`} aria-hidden />
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={exportPNG} className="px-3 py-2 text-white rounded bg-primary/90 hover:bg-primary">Exportar PNG</button>
              <button onClick={downloadJSON} className="px-3 py-2 border border-gray-700 rounded bg-black/30">Descargar JSON</button>
              <button onClick={()=>{ setDisplayed(""); setTypingSeed(s=>s+1) }} className="px-3 py-2 border border-gray-700 rounded bg-black/30">Reproducir</button>
            </div>

              <div className="mt-6 text-sm text-gray-300">
                  <p className="mb-2 text-gray-300">Ajusta los parámetros y observa cómo cambia la respuesta en esa dirección (más creativo, más preciso, más equilibrado, o con mayor control contra repeticiones). Compara con los ejemplos académicos del paso anterior para entender la relación.</p>
                  <div className="p-4 bg-black/40 rounded border border-gray-800">
                    <p><strong>Interpretación del comportamiento:</strong> <span className="text-gray-200">{patternDescriptions[selectedPattern]}</span></p>
                  </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button onClick={()=>setActiveStep(2)} className="btn btn-ghost">Anterior</button>
                <button onClick={()=>setActiveStep(4)} className="btn btn-primary">Siguiente</button>
              </div>
          </div>
        </div>
          </section>
        )}

      <footer className="text-center text-sm text-gray-400 mt-8">ExploraModelo — material educativo. Fondo negro para foco en contenido.</footer>

      {/* Step 4: Bibliografía / Referencias - página dedicada */}
      {activeStep===4 && (
        <section className="mt-6 text-left text-sm text-gray-300 animate-step">
          <StepHeader num={4} title="Bibliografía y referencias" />
          <ul className="list-disc ml-5 space-y-2">
            <li><a className="text-primary" href="https://arxiv.org/abs/1904.09751" target="_blank" rel="noreferrer">Holtzman et al., The Curious Case of Neural Text Degeneration (nucleus sampling) — 2019</a></li>
            <li><a className="text-primary" href="https://arxiv.org/abs/1705.02364" target="_blank" rel="noreferrer">Fan et al., Strategies for Diverse and Controllable Text Generation — 2018</a></li>
            <li><a className="text-primary" href="https://arxiv.org/abs/2005.14165" target="_blank" rel="noreferrer">Keskar et al., CTRL: A Conditional Transformer Language Model for Controllable Generation — 2019</a></li>
            <li><a className="text-primary" href="https://blog.openai.com/better-language-models/" target="_blank" rel="noreferrer">OpenAI blog: Better Language Models and Their Implications</a></li>
            <li><a className="text-primary" href="https://arxiv.org/abs/2102.09690" target="_blank" rel="noreferrer">Pahuja et al., On the Role of Sampling Strategies in Text Generation — 2021</a></li>
          </ul>
          <div className="mt-6 flex justify-between">
            <button onClick={()=>setActiveStep(3)} className="btn btn-ghost">Anterior</button>
            <button onClick={()=>setActiveStep(1)} className="btn btn-primary">Volver al inicio</button>
          </div>
        </section>
      )}
    </main>
  )
}

