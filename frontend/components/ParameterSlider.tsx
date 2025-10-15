import React from 'react'

type Props = {
  label: string
  value: number | string
  min: number
  max: number
  step: number
  onChange: (v:number)=>void
  id?: string
}

export default function ParameterSlider({label,value,min,max,step,onChange,id}:Props){
  return (
    <div>
      <label className="block mb-1">{label} <span className="text-gray-400">({String(value)})</span></label>
      <input id={id} aria-label={label} type="range" min={String(min)} max={String(max)} step={String(step)} value={String(value)} onChange={e=>onChange(parseFloat(e.target.value))} className="w-full" />
    </div>
  )
}
