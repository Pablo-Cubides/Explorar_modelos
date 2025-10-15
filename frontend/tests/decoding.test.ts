import { describe, it, expect } from 'vitest'
import data from '../data/cases'
import type { DataRoot } from '../types/data'
import { mapToBucketT, mapToBucketK, mapToBucketP, mapToBucketR, choosePattern, nearestIndexForExamples } from '../utils/decoding'

const root = data as unknown as DataRoot

describe('decoding utils', ()=>{
  it('maps temperature to buckets', ()=>{
    expect(mapToBucketT(root.buckets, 0.1)).toBe('T0')
    expect(mapToBucketT(root.buckets, 0.5)).toBe('T2')
    expect(mapToBucketT(root.buckets, 1.0)).toBe('T4')
  })

  it('maps topK to buckets', ()=>{
    expect(mapToBucketK(root.buckets, 3)).toBe('K0')
    expect(mapToBucketK(root.buckets, 30)).toBe('K2')
    expect(mapToBucketK(root.buckets, 100)).toBe('K3')
  })

  it('maps topP to buckets', ()=>{
    expect(mapToBucketP(root.buckets, 0.15)).toBe('P0')
    expect(mapToBucketP(root.buckets, 0.5)).toBe('P2')
    expect(mapToBucketP(root.buckets, 0.9)).toBe('P3')
  })

  it('maps repetition to buckets', ()=>{
    expect(mapToBucketR(root.buckets, 1.02)).toBe('R0')
    expect(mapToBucketR(root.buckets, 1.25)).toBe('R2')
    expect(mapToBucketR(root.buckets, 1.7)).toBe('R3')
  })

  it('chooses pattern deterministically', ()=>{
    const p = choosePattern(root.patterns, 'T3','K3','P3','R0')
    expect(['D','E']).toContain(p) // both D and E match high T/K/P and low R; accept either
  })

  it('nearest index picks closest example', ()=>{
    const examples = [{v:0.1},{v:0.7},{v:1.2}]
    expect(nearestIndexForExamples(examples,0.05)).toBe(0)
    expect(nearestIndexForExamples(examples,0.9)).toBe(1)
    expect(nearestIndexForExamples(examples,1.15)).toBe(2)
  })
})
