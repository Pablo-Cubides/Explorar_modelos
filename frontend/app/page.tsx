"use client"
import React, { useEffect, useMemo, useState } from 'react'
import data from '../data/cases'
import type { DataRoot, CaseItem } from '../types/data'

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

  // mapeo simple a buckets
  function mapToBucketT(t:number){ for(const k of Object.keys(buckets.T)){ const [a,b]=buckets.T[k]; if(t>=a&&t<=b) return k } return 'T4' }
  function mapToBucketK(kv:number){ for(const k of Object.keys(buckets.K)){ const [a,b]=buckets.K[k]; if(kv>=a&&kv<=b) return k } return 'K3' }
  function mapToBucketP(pv:number){ for(const k of Object.keys(buckets.P)){ const [a,b]=buckets.P[k]; if(pv>=a&&pv<=b) return k } return 'P3' }
  function mapToBucketR(rv:number){ for(const k of Object.keys(buckets.R)){ const [a,b]=buckets.R[k]; if(rv>=a&&rv<=b) return k } return 'R3' }

  function choosePattern(tb:string,kb:string,pb:string,rb:string){ let best={pat:'A',score:-1}; for(const p of Object.keys(patterns)){ const pat=patterns[p]; let score=0; if(pat.T===tb) score++; if(pat.K===kb) score++; if(pat.P===pb) score++; if(pat.R===rb) score++; if(score>best.score||(score===best.score&&p<best.pat)) best={pat:p,score} } return best.pat }

  const tb = mapToBucketT(temperature)
  const kb = mapToBucketK(topK)
  const pb = mapToBucketP(topP)
  const rb = mapToBucketR(repetitionPenalty)
  const selectedPattern = choosePattern(tb,kb,pb,rb)
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

  async function exportPNG(){ try{ const el=document.querySelector('main') as HTMLElement; if(!el) return; const html2canvas=(await import('html2canvas')).default; const canvas=await html2canvas(el); const dataUrl=canvas.toDataURL('image/png'); const a=document.createElement('a'); a.href=dataUrl; a.download='exploramodelo_result.png'; a.click() }catch(e){console.error(e)} }
  function downloadJSON(){ const payload={case: currentCase.id, pattern:selectedPattern, params:{temperature,topK,topP,repetitionPenalty}, text: variantText}; const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='exploramodelo_result.json'; a.click(); URL.revokeObjectURL(url) }

  // contenido académico para cada parámetro (resumen + ejemplos)
  const academic = useMemo(()=>({
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

  return (
    <main className="max-w-7xl mx-auto p-8 text-white">
      <header className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-sm" style={{backgroundColor:'var(--primary)'}} />
        <div>
          <h1 className="text-2xl font-bold">ExploraModelo — Guía académica de parámetros de decodificación</h1>
          <p className="text-sm text-gray-300">Aplicación educativa para comprender y experimentar cómo los parámetros de muestreo afectan salidas de modelos de lenguaje.</p>
        </div>
      </header>

      {/* Paso 1: Resumen general */}
      <section className="mb-8">
        <StepHeader num={1} title="¿Qué hace esta app?" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-4 bg-surface/80 border border-gray-800 rounded">
            <p className="text-gray-300">Esta aplicación es un recurso académico que demuestra, paso a paso, cómo los parámetros de decodificación (Temperatura, Top-k, Top-p y Penalización por repetición) influyen en la generación de texto por un LLM. Primero explicamos cada parámetro conceptualmente, luego mostramos ejemplos numéricos y, finalmente, permitimos experimentar con ejemplos prácticos (playground).</p>
          </div>
          <div className="space-y-3">
            <ParamCard title="Temperatura" summary="Controla aleatoriedad en el muestreo (baja -> determinista, alta -> creativa)" />
            <ParamCard title="Top-k" summary="Restringe la cantidad de candidatos por paso" />
            <ParamCard title="Top-p" summary="Selecciona el núcleo probabilístico acumulado" />
          </div>
        </div>
      </section>

      {/* Paso 2: Secciones detalladas por parámetro */}
      <section className="mb-8">
        <StepHeader num={2} title="Parámetros — explicación detallada y ejemplos" />
        <div className="grid md:grid-cols-2 gap-6">
          {/* Temperatura */}
          <div className="p-6 bg-surface/90 border border-gray-800 rounded">
            <h3 className="text-lg font-semibold mb-2">Temperatura</h3>
            <p className="text-sm text-gray-300 mb-3">{academic.temperatura.summary}</p>
            <ul className="space-y-2">
              {academic.temperatura.examples.map((ex:any, i:number)=> (
                <li key={i} className="p-3 bg-black/40 rounded">
                  <strong className="text-primary">T = {ex.v}</strong>
                  <p className="text-sm text-gray-300 mt-1">Ejemplo: {ex.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Top-k */}
          <div className="p-6 bg-surface/90 border border-gray-800 rounded">
            <h3 className="text-lg font-semibold mb-2">Top‑k</h3>
            <p className="text-sm text-gray-300 mb-3">{academic.topk.summary}</p>
            <ul className="space-y-2">
              {academic.topk.examples.map((ex:any,i:number)=> (
                <li key={i} className="p-3 bg-black/40 rounded">
                  <strong className="text-primary">k = {ex.v}</strong>
                  <p className="text-sm text-gray-300 mt-1">Ejemplo: {ex.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Top-p */}
          <div className="p-6 bg-surface/90 border border-gray-800 rounded">
            <h3 className="text-lg font-semibold mb-2">Top‑p</h3>
            <p className="text-sm text-gray-300 mb-3">{academic.topp.summary}</p>
            <ul className="space-y-2">
              {academic.topp.examples.map((ex:any,i:number)=> (
                <li key={i} className="p-3 bg-black/40 rounded">
                  <strong className="text-primary">p = {ex.v}</strong>
                  <p className="text-sm text-gray-300 mt-1">Ejemplo: {ex.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Penalización repetición */}
          <div className="p-6 bg-surface/90 border border-gray-800 rounded">
            <h3 className="text-lg font-semibold mb-2">Penalización por repetición</h3>
            <p className="text-sm text-gray-300 mb-3">{academic.repetition.summary}</p>
            <ul className="space-y-2">
              {academic.repetition.examples.map((ex:any,i:number)=> (
                <li key={i} className="p-3 bg-black/40 rounded">
                  <strong className="text-primary">R = {ex.v}</strong>
                  <p className="text-sm text-gray-300 mt-1">Ejemplo: {ex.text}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Paso 3: Playground interactivo */}
      <section className="mb-12">
        <StepHeader num={3} title="Playground — prueba y observa" />

        <div className="grid md:grid-cols-3 gap-6">
          <aside className="md:col-span-1 p-4 bg-surface/80 border border-gray-800 rounded">
            <label className="block mb-2">Caso</label>
            <select value={caseIndex} onChange={e=>setCaseIndex(parseInt(e.target.value))} className="w-full p-2 text-white rounded bg-black/30">
              {cases.map((c:any,i:number)=> <option key={c.id} value={i}>{c.title}</option>)}
            </select>

            <div className="mt-4 space-y-4">
              <label className="block">Temperatura <span className="text-gray-400">({temperature.toFixed(2)})</span></label>
              <input aria-label="Temperatura" type="range" min="0.05" max="1.3" step="0.01" value={temperature} onChange={e=>setTemperature(parseFloat(e.target.value))} className="w-full" />

              <label className="block">Top-k <span className="text-gray-400">({topK})</span></label>
              <input aria-label="Top-k" type="range" min="1" max="150" step="1" value={topK} onChange={e=>setTopK(parseInt(e.target.value))} className="w-full" />

              <label className="block">Top-p <span className="text-gray-400">({topP.toFixed(2)})</span></label>
              <input aria-label="Top-p" type="range" min="0.10" max="1.0" step="0.01" value={topP} onChange={e=>setTopP(parseFloat(e.target.value))} className="w-full" />

              <label className="block">Penalización repetición <span className="text-gray-400">({repetitionPenalty.toFixed(2)})</span></label>
              <input aria-label="Penalización por repetición" type="range" min="1.00" max="2.00" step="0.01" value={repetitionPenalty} onChange={e=>setRepetitionPenalty(parseFloat(e.target.value))} className="w-full" />
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
              <p><strong>Patrón seleccionado:</strong> {selectedPattern} &nbsp; <span className="text-gray-400">(calculado por buckets)</span></p>
              <p className="mt-2">Ajusta los parámetros y observa cómo cambia la respuesta. Compara los ejemplos académicos del paso anterior con el resultado aquí.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-400 mt-8">ExploraModelo — material educativo. Fondo negro para foco en contenido.</footer>
    </main>
  )
}

