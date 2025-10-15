export type BucketRange = readonly [number, number]
export type Buckets = Record<string, Record<string, BucketRange>>

export type PatternMap = Record<string, { T: string; K: string; P: string; R: string }>

export type CaseVariants = Record<string, string>

export type CaseItem = {
  id: string
  title: string
  variants: CaseVariants
}

export type DataRoot = {
  buckets: Buckets
  patterns: PatternMap
  cases: CaseItem[]
}

// Note: this file only exports types. No runtime default export.
