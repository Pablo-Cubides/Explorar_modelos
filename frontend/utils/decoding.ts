import type { DataRoot } from '../types/data'

export function mapToBucketT(buckets: DataRoot['buckets'], t:number){
  for(const k of Object.keys(buckets.T)){
    const [a,b] = buckets.T[k]
    if(t>=a && t<=b) return k
  }
  return 'T4'
}

export function mapToBucketK(buckets: DataRoot['buckets'], kv:number){
  for(const k of Object.keys(buckets.K)){
    const [a,b] = buckets.K[k]
    if(kv>=a && kv<=b) return k
  }
  return 'K3'
}

export function mapToBucketP(buckets: DataRoot['buckets'], pv:number){
  for(const k of Object.keys(buckets.P)){
    const [a,b] = buckets.P[k]
    if(pv>=a && pv<=b) return k
  }
  return 'P3'
}

export function mapToBucketR(buckets: DataRoot['buckets'], rv:number){
  for(const k of Object.keys(buckets.R)){
    const [a,b] = buckets.R[k]
    if(rv>=a && rv<=b) return k
  }
  return 'R3'
}

export function choosePattern(patterns: DataRoot['patterns'], tb:string,kb:string,pb:string,rb:string){
  let best = { pat:'A', score:-1 }
  for(const p of Object.keys(patterns)){
    const pat = patterns[p]
    let score = 0
    if(pat.T===tb) score++
    if(pat.K===kb) score++
    if(pat.P===pb) score++
    if(pat.R===rb) score++
    if(score>best.score || (score===best.score && p<best.pat)) best={ pat:p, score }
  }
  return best.pat
}

export function nearestIndexForExamples<T extends {v:number}>(examples:T[], value:number){
  if(!examples || examples.length===0) return 0
  let bestIdx=0
  let bestDist=Number.POSITIVE_INFINITY
  for(let i=0;i<examples.length;i++){
    const v = examples[i].v
    const d = Math.abs(v-value)
    if(d<bestDist){ bestDist=d; bestIdx=i }
  }
  return bestIdx
}
