"use client"
import React, { useEffect, useMemo, useState } from 'react'
import data from '../data/cases'
import type { DataRoot, CaseItem } from '../types/data'
import { mapToBucketT, mapToBucketK, mapToBucketP, mapToBucketR, choosePattern } from '../utils/decoding'
import SliderEnhanced from '../components/SliderEnhanced'
import CaseSelector from '../components/CaseSelector'
import ExampleList from '../components/ExampleList'
import Badge from '../components/Badge'
import PatternRadarChart from '../components/PatternRadarChart'
import PatternTimeline from '../components/PatternTimeline'
import AcademicReferences from '../components/AcademicReferences'

// Referencias académicas por parámetro para SEO y credibilidad
const academicReferences = {
  temperature: [
    { title: 'Temperature in LLM Sampling', url: 'https://nlp.stanford.edu/blog/maximum-likelihood-decoding-with-rnns-the-good-the-bad-and-the-ugly/', source: 'Stanford NLP' },
    { title: 'Temperature Parameter Guide', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/adjust-parameter-values?hl=es-419', source: 'Google Vertex AI' },
    { title: 'Understanding Temperature', url: 'https://learnprompting.org/es/docs/basics/configuration_hyperparameters', source: 'LearnPrompting' }
  ],
  topK: [
    { title: 'Top-K Sampling for Generation', url: 'https://openreview.net/forum?id=rygGQyrFvH', source: 'OpenReview' },
    { title: 'Neural Text Generation Paper', url: 'https://ar5iv.labs.arxiv.org/html/1904.09751', source: 'arXiv' },
    { title: 'Top-K Glossary', url: 'https://dataforest.ai/glossary/top-k-sampling', source: 'DataForest' }
  ],
  topP: [
    { title: 'Nucleus Sampling Paper', url: 'https://ar5iv.labs.arxiv.org/html/1904.09751', source: 'arXiv' }
  ]
}

// Componentes auxiliares para la nueva estructura educativa
function StepHeader({num, title}:{num:number; title:string}){
  return (
    <div className="flex items-center gap-4 mb-6 animate-slide-up">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-cyber text-black font-bold text-xl shadow-glow-cyan">
        {num}
      </div>
      <h2 className="text-xl font-bold text-gradient">{title}</h2>
    </div>
  )
}

function ParamCard({title, summary}:{title:string; summary:string}){
  return (
    <div className="glass rounded-xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-default border-2 border-transparent hover:border-primary/30">
      <h3 className="text-md font-bold text-gradient mb-3">{title}</h3>
      <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
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

  // Pattern metadata (levels: low/med/high) derived from your table
  const patternMeta = useMemo(()=>({
    A: { creativity:'low', coherence:'high', diversity:'low', repetitionControl:'medium' },
    B: { creativity:'low', coherence:'high', diversity:'low', repetitionControl:'high' },
    C: { creativity:'medium', coherence:'high', diversity:'medium', repetitionControl:'medium' },
    D: { creativity:'high', coherence:'medium', diversity:'high', repetitionControl:'low' },
    E: { creativity:'very-high', coherence:'low', diversity:'very-high', repetitionControl:'low' },
    F: { creativity:'high', coherence:'medium', diversity:'high', repetitionControl:'high' },
    G: { creativity:'high', coherence:'medium', diversity:'very-high', repetitionControl:'very-high' },
    H: { creativity:'medium', coherence:'high', diversity:'medium', repetitionControl:'medium' },
    I: { creativity:'very-high', coherence:'low', diversity:'high', repetitionControl:'low' },
    J: { creativity:'low', coherence:'very-high', diversity:'low', repetitionControl:'very-high' }
  } as const),[])

  return (
    <main className="max-w-7xl mx-auto p-8 text-white">
      <header className="mb-8 flex items-center gap-6 animate-slide-down">
        <div className="w-16 h-16 rounded-2xl shadow-glow-cyan flex items-center justify-center bg-gradient-cyber animate-float">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 5L25 15L35 17L27 25L30 35L20 29L10 35L13 25L5 17L15 15L20 5Z" fill="currentColor" className="text-black" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
            <span className="text-gradient">ExploraModelo</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
            Guía académica interactiva de parámetros de decodificación — Experimenta cómo Temperatura, Top-k, Top-p y Penalización afectan las salidas de modelos de lenguaje
          </p>
        </div>
      </header>

      {/* Stepper */}
      <div className="mb-8 stepper">
        {[1,2,3,4].map(n=> (
          <button 
            key={n} 
            onClick={()=>setActiveStep(n)} 
            className={`step-dot transition-all duration-300 ${activeStep===n ? 'bg-gradient-cyber text-black scale-110' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`} 
            aria-label={`Ir al paso ${n}`}
          >
            {n}
          </button>
        ))}
        <div className="ml-4 text-sm text-gray-400 hidden md:block">
          <span className={activeStep === 1 ? 'text-primary font-semibold' : ''}>1 Qué es</span>
          <span className="mx-2">•</span>
          <span className={activeStep === 2 ? 'text-primary font-semibold' : ''}>2 Parámetros</span>
          <span className="mx-2">•</span>
          <span className={activeStep === 3 ? 'text-primary font-semibold' : ''}>3 Playground</span>
          <span className="mx-2">•</span>
          <span className={activeStep === 4 ? 'text-primary font-semibold' : ''}>4 Bibliografía</span>
        </div>
      </div>

      {/* Step 1: Resumen general (parameters stacked under description) */}
      {activeStep===1 && (
        <section className="mb-8 animate-step"> 
          <StepHeader num={1} title="¿Qué hace esta app?" />
          <div className="glass-strong rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-cyber opacity-5 blur-3xl rounded-full" />
            <p className="text-gray-300 leading-relaxed relative z-10">
              Esta aplicación es un recurso académico que demuestra, paso a paso, cómo los parámetros de decodificación 
              (<span className="text-primary font-semibold">Temperatura</span>, 
              <span className="text-secondary font-semibold"> Top-k</span>, 
              <span className="text-accent font-semibold"> Top-p</span> y 
              <span className="text-primary font-semibold"> Penalización por repetición</span>) influyen en la generación de texto por un LLM. 
              Primero explicamos cada parámetro conceptualmente, luego mostramos ejemplos numéricos y, finalmente, 
              permitimos experimentar con ejemplos prácticos (playground).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ParamCard title="🌡️ Temperatura" summary="Controla la aleatoriedad en el muestreo: valores bajos (p.ej. 0.1) concentran probabilidad en el modo más probable; valores intermedios (~0.7) equilibran coherencia y variedad; valores altos (>1.0) amplifican la diversidad y el riesgo de incoherencia." />
            <ParamCard title="🔢 Top-k" summary="Limita el número absoluto de candidatos considerados en cada paso. Un k pequeño fuerza al modelo a elegir entre muy pocas opciones (salidas predecibles), un k grande permite mucha diversidad but puede introducir ruido." />
            <ParamCard title="🎯 Top-p" summary="Selecciona el 'núcleo' probabilístico acumulado hasta alcanzar la masa p. A diferencia de top-k, top-p adapta el tamaño del conjunto según la distribución: útil para balance adaptativo entre seguridad y creatividad." />
            <ParamCard title="🔄 Penalización por repetición" summary="Reduce la probabilidad de volver a escoger tokens ya generados, evitando bucles y muletillas; un valor moderado mejora diversidad sin sacrificar coherencia." />
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={()=>setActiveStep(2)} className="btn btn-primary">Siguiente →</button>
          </div>
        </section>
      )}

      {/* Step 2: Parámetros — página dedicada (oculta resto) */}
      {activeStep===2 && (
        <section className="mb-8 animate-step">
          <StepHeader num={2} title="Parámetros — explicación detallada y ejemplos" />
          <div className="space-y-6">
            {subStep===0 && (
              <div className="glass-strong rounded-2xl p-8 animate-scale-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-cyber flex items-center justify-center text-black text-2xl font-bold">
                    🌡️
                  </div>
                  <h3 className="text-2xl font-bold text-gradient">Temperatura</h3>
                </div>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">{academic.temperatura.summary} En esta sección profundizamos en cómo la temperatura afecta la distribución de probabilidad y ejemplos prácticos de cuándo ajustar T para tareas específicas (e.g., redacción formal vs brainstorming).</p>
                
                {/* Referencias académicas */}
                <div className="mb-6">
                  <AcademicReferences links={academicReferences.temperature} compact />
                </div>
                
                <ExampleList examples={academic.temperatura.examples} highlighted={highlighted ? highlighted.replace('temp-','') : null} />
                <div className="mt-6 flex justify-between">
                  <div></div>
                  <button onClick={()=>setSubStep(1)} className="btn btn-primary">Siguiente: Top-k →</button>
                </div>
              </div>
            )}

            {subStep===1 && (
              <div className="glass-strong rounded-2xl p-8 animate-scale-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-cyber flex items-center justify-center text-black text-2xl font-bold">
                    🔢
                  </div>
                  <h3 className="text-2xl font-bold text-gradient">Top‑k</h3>
                </div>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">{academic.topk.summary} Aquí profundizamos en el trade-off entre control y diversidad al fijar un k fijo, y ejemplos de ajustes para tareas de completado o generación controlada.</p>
                
                {/* Referencias académicas */}
                <div className="mb-6">
                  <AcademicReferences links={academicReferences.topK} compact />
                </div>
                
                <ExampleList examples={academic.topk.examples} highlighted={highlighted ? highlighted.replace('k-','') : null} />
                <div className="mt-6 flex justify-between">
                  <button onClick={()=>setSubStep(0)} className="btn btn-ghost">← Anterior: Temperatura</button>
                  <button onClick={()=>setSubStep(2)} className="btn btn-primary">Siguiente: Top-p →</button>
                </div>
              </div>
            )}

            {subStep===2 && (
              <div className="glass-strong rounded-2xl p-8 animate-scale-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-cyber flex items-center justify-center text-black text-2xl font-bold">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold text-gradient">Top‑p</h3>
                </div>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">{academic.topp.summary} Profundizamos en cómo el núcleo adaptativo evita forzar un tamaño fijo y ejemplos prácticos para diferentes tareas (resumen, diálogo, creatividad).</p>
                
                {/* Referencias académicas */}
                <div className="mb-6">
                  <AcademicReferences links={academicReferences.topP} compact />
                </div>
                
                <ExampleList examples={academic.topp.examples} highlighted={highlighted ? highlighted.replace('p-','') : null} />
                <div className="mt-6 flex justify-between">
                  <button onClick={()=>setSubStep(1)} className="btn btn-ghost">← Anterior: Top-k</button>
                  <button onClick={()=>setSubStep(3)} className="btn btn-primary">Siguiente: Repetición →</button>
                </div>
              </div>
            )}

            {subStep===3 && (
              <div className="glass-strong rounded-2xl p-8 animate-scale-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-cyber flex items-center justify-center text-black text-2xl font-bold">
                    🔄
                  </div>
                  <h3 className="text-2xl font-bold text-gradient">Penalización por repetición</h3>
                </div>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">{academic.repetition.summary} Estrategias para ajustar la penalización y ejemplos sobre cómo evitar repeticiones sin perder coherencia semántica.</p>
                <ExampleList examples={academic.repetition.examples} highlighted={highlighted ? highlighted.replace('r-','') : null} />
                <div className="mt-6 flex justify-between">
                  <button onClick={()=>setSubStep(2)} className="btn btn-ghost">← Anterior: Top-p</button>
                  <div className="flex gap-3">
                    <button onClick={()=>setSubStep(0)} className="btn btn-ghost">Revisar desde el inicio</button>
                    <button onClick={()=>{ setActiveStep(3); setSubStep(0) }} className="btn btn-primary">Ir al Playground →</button>
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

          {/* Pattern Timeline */}
          <div className="mb-6">
            <PatternTimeline 
              currentPattern={selectedPattern} 
              patterns={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']} 
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Panel lateral de controles */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Selector de casos */}
              <div className="glass rounded-xl p-5">
                <CaseSelector cases={cases} value={caseIndex} onChange={setCaseIndex} id="case-select" />
              </div>

              {/* Radar Chart */}
              <PatternRadarChart 
                temperature={temperature}
                topK={topK}
                topP={topP}
                repetitionPenalty={repetitionPenalty}
              />

              {/* Sliders */}
              <div className="glass rounded-xl p-5 space-y-6">
                <h3 className="text-sm font-bold text-gradient mb-4">Parámetros de Decodificación</h3>
                
                <SliderEnhanced 
                  label="Temperatura" 
                  value={temperature} 
                  min={0.05} 
                  max={1.3} 
                  step={0.01} 
                  onChange={v=>{ setTemperature(v); const idx=nearestIndexForExamples(academic.temperatura.examples,v); pulseHighlight(`temp-${idx}`) }} 
                  id="slider-temp"
                  description="Controla la aleatoriedad en el muestreo"
                  optimalRange={[0.6, 0.8]}
                />

                <SliderEnhanced 
                  label="Top-k" 
                  value={topK} 
                  min={1} 
                  max={150} 
                  step={1} 
                  onChange={v=>{ setTopK(Math.round(v)); const idx=nearestIndexForExamples(academic.topk.examples,v); pulseHighlight(`k-${idx}`) }} 
                  id="slider-k"
                  description="Limita candidatos a los k más probables"
                  optimalRange={[40, 60]}
                />

                <SliderEnhanced 
                  label="Top-p" 
                  value={topP} 
                  min={0.10} 
                  max={1.0} 
                  step={0.01} 
                  onChange={v=>{ setTopP(v); const idx=nearestIndexForExamples(academic.topp.examples,v); pulseHighlight(`p-${idx}`) }} 
                  id="slider-p"
                  description="Selecciona núcleo probabilístico acumulativo"
                  optimalRange={[0.85, 0.95]}
                />

                <SliderEnhanced 
                  label="Penalización" 
                  value={repetitionPenalty} 
                  min={1.00} 
                  max={2.00} 
                  step={0.01} 
                  onChange={v=>{ setRepetitionPenalty(v); const idx=nearestIndexForExamples(academic.repetition.examples,v); pulseHighlight(`r-${idx}`) }} 
                  id="slider-r"
                  description="Reduce probabilidad de tokens repetidos"
                  optimalRange={[1.1, 1.3]}
                />
              </div>
            </aside>

            {/* Panel principal de visualización */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card de texto generado */}
              <div className="glass-strong rounded-2xl p-8 relative overflow-hidden gradient-border">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-cyber opacity-10 blur-3xl rounded-full" />
                
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-wider text-primary/80 mb-2 font-bold">Caso de ejemplo</p>
                  <p className="text-sm italic text-gray-400 mb-4">{currentCase.title}...</p>
                  
                  <div aria-live="polite" role="status" className="mt-6 text-2xl md:text-3xl leading-relaxed font-medium whitespace-pre-wrap min-h-[10rem]">
                    {displayed}
                    <span className={`inline-block w-1.5 h-7 ml-1 align-baseline rounded-full ${isTyping ? 'bg-gradient-cyber animate-pulse' : 'bg-transparent'}`} aria-hidden />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-wrap gap-3">
                <button onClick={exportPNG} className="btn btn-primary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 11L4 7h2.5V2h3v5H12L8 11z" fill="currentColor"/>
                    <path d="M14 14H2v-2h12v2z" fill="currentColor"/>
                  </svg>
                  Exportar PNG
                </button>
                <button onClick={downloadJSON} className="btn btn-ghost flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3h10M3 8h10M3 13h10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Descargar JSON
                </button>
                <button onClick={()=>{ setDisplayed(""); setTypingSeed(s=>s+1) }} className="btn btn-ghost flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14 8c0-3.3-2.7-6-6-6S2 4.7 2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M2 8l2-2M2 8l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Reproducir
                </button>
              </div>

              {/* Interpretación del comportamiento */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-gradient mb-3">Interpretación del Patrón {selectedPattern}</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{patternDescriptions[selectedPattern]}</p>
                
                <div className="flex gap-2 flex-wrap">
                  {(() => {
                    const meta = (patternMeta as any)[selectedPattern]
                    return (
                      <>
                        <Badge label="Creatividad" level={meta.creativity as any} />
                        <Badge label="Coherencia" level={meta.coherence as any} />
                        <Badge label="Diversidad" level={meta.diversity as any} />
                        <Badge label="Control rep." level={meta.repetitionControl as any} />
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Navegación */}
              <div className="flex justify-between">
                <button onClick={()=>setActiveStep(2)} className="btn btn-ghost">← Anterior</button>
                <button onClick={()=>setActiveStep(4)} className="btn btn-primary">Siguiente →</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Bibliografía / Referencias - página dedicada */}
      {activeStep===4 && (
        <section className="animate-step">
          <StepHeader num={4} title="Bibliografía y referencias" />
          <div className="glass-strong rounded-2xl p-8">
            <ul className="space-y-4">
              {[
                { title: 'Holtzman et al., The Curious Case of Neural Text Degeneration (nucleus sampling) — 2019', url: 'https://arxiv.org/abs/1904.09751' },
                { title: 'Fan et al., Strategies for Diverse and Controllable Text Generation — 2018', url: 'https://arxiv.org/abs/1705.02364' },
                { title: 'Keskar et al., CTRL: A Conditional Transformer Language Model for Controllable Generation — 2019', url: 'https://arxiv.org/abs/2005.14165' },
                { title: 'OpenAI blog: Better Language Models and Their Implications', url: 'https://blog.openai.com/better-language-models/' },
                { title: 'Pahuja et al., On the Role of Sampling Strategies in Text Generation — 2021', url: 'https://arxiv.org/abs/2102.09690' }
              ].map((ref, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center text-black font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <a 
                    className="text-primary hover:text-secondary transition-colors duration-300 group-hover:translate-x-1 transform flex-1" 
                    href={ref.url} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    {ref.title}
                    <svg className="inline-block ml-2 w-4 h-4 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={()=>setActiveStep(3)} className="btn btn-ghost">← Anterior</button>
            <button onClick={()=>setActiveStep(1)} className="btn btn-primary">🏠 Volver al inicio</button>
          </div>
        </section>
      )}

      <footer className="text-center text-sm text-gray-500 mt-16 pb-8 border-t border-white/5 pt-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12 8L18 9L14 13L15 19L10 15L5 19L6 13L2 9L8 8L10 2Z" fill="currentColor" className="text-black" />
            </svg>
          </div>
          <span className="font-bold text-gradient">ExploraModelo</span>
        </div>
        <p>Material educativo sobre parámetros de decodificación en LLMs</p>
        <p className="mt-2 text-xs text-gray-600">Diseñado con foco en accesibilidad y experiencia de aprendizaje</p>
      </footer>
    </main>
  )
}

