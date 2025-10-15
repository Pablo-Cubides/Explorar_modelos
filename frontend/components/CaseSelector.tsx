import React from 'react'
import type { CaseItem } from '../types/data'

export default function CaseSelector({cases, value, onChange}:{cases: CaseItem[]; value:number; onChange:(i:number)=>void}){
  return (
    <div>
      <label className="block mb-2">Caso</label>
      <select value={value} onChange={e=>onChange(parseInt(e.target.value))} className="w-full p-2 text-white rounded bg-black/30">
        {cases.map((c,i)=> <option key={c.id} value={i}>{c.title}</option>)}
      </select>
    </div>
  )
}
