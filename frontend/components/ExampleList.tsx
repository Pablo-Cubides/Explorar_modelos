import React from 'react'

type Ex = { v:number; text:string }

export default function ExampleList({examples, highlighted}:{examples:Ex[]; highlighted:string | null}){
  return (
    <ul className="space-y-2">
      {examples.map((ex,i)=>{
        const key = `${i}`
        return (
          <li key={i} className={`example-card ${highlighted===key? 'example-highlight':''}`}>
            <strong className="text-primary">{ex.v}</strong>
            <p className="text-sm text-gray-300 mt-1">{ex.text}</p>
          </li>
        )
      })}
    </ul>
  )
}
