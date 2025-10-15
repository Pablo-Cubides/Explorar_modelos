import React from 'react'
import type { CaseItem } from '../types/data'

type Props = {
  cases: CaseItem[]
  value: number
  onChange: (i:number)=>void
  id?: string
}

export default function CaseSelector({cases, value, onChange, id='case-select'}:Props){
  return (
    <div>
      <label htmlFor={id} className="block mb-2">Caso</label>
      <select id={id} value={value} onChange={e=>onChange(parseInt(e.target.value))} className="w-full p-2 text-white rounded bg-black/30">
        {cases.map((c,i)=> <option key={c.id} value={i}>{c.title}</option>)}
      </select>
    </div>
  )
}
