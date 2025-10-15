import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import axe from 'axe-core'
import Home from '../app/page'
import { act } from 'react-dom/test-utils'

// JSDOM in node does not implement canvas getContext; stub minimal implementation
beforeAll(()=>{
  if(typeof HTMLCanvasElement !== 'undefined' && !(HTMLCanvasElement.prototype as any).getContext){
  (HTMLCanvasElement.prototype as any).getContext = function(){ return null }
  }
})

// Run axe programmatically on the rendered HTML
function runAxe(container:HTMLElement){
  return new Promise<axe.AxeResults>((resolve, reject)=>{
    axe.run(container, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }, (err, results)=>{
      if(err) return reject(err)
      resolve(results)
    })
  })
}

describe('accessibility', ()=>{
  it('has no critical accessibility violations (axe)', async ()=>{
  let container:HTMLElement
  await act(async ()=>{ const r = render(<Home />); container = r.container })
  const results = await runAxe(container!)
    // filter only critical and serious
    const bad = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    if(bad.length>0){
      // print violations for debugging
      // eslint-disable-next-line no-console
      console.error('Axe violations:', JSON.stringify(bad, null, 2))
    }
    expect(bad.length).toBe(0)
  })
})
