import { describe, it, expect } from 'vitest';
import { data } from '../data/cases';

const { buckets, patterns } = data;

function mapToBucketT(t: number){
    for (const k of Object.keys(buckets.T)){
      const [a,b] = buckets.T[k as keyof typeof buckets.T]
      if (t>=a && t<=b) return k
    }
    return 'T4'
}

function mapToBucketK(kv: number){
    for (const k of Object.keys(buckets.K)){
      const [a,b] = buckets.K[k as keyof typeof buckets.K]
      if (kv>=a && kv<=b) return k
    }
    return 'K3'
}

function mapToBucketP(pv: number){
    for (const k of Object.keys(buckets.P)){
      const [a,b] = buckets.P[k as keyof typeof buckets.P]
      if (pv>=a && pv<=b) return k
    }
    return 'P3'
}

function mapToBucketR(rv: number){
    for (const k of Object.keys(buckets.R)){
      const [a,b] = buckets.R[k as keyof typeof buckets.R]
      if (rv>=a && rv<=b) return k
    }
    return 'R3'
}

function choosePattern(tb: string, kb: string, pb: string, rb: string){
    // score each pattern by matches, return highest; tie-breaker A->J
    let best = {pat: 'A', score: -1}
    for (const p of Object.keys(patterns)){
      const pat = patterns[p as keyof typeof patterns]
      let score = 0
      if (pat.T === tb) score++
      if (pat.K === kb) score++
      if (pat.P === pb) score++
      if (pat.R === rb) score++
      if (score>best.score || (score===best.score && p < best.pat)){
        best = {pat: p, score}
      }
    }
    return best.pat
}

describe('mapToBucketT', () => {
  it('should return T0 for t = 0.1', () => {
    expect(mapToBucketT(0.1)).toBe('T0');
  });
  it('should return T2 for t = 0.4', () => {
    expect(mapToBucketT(0.4)).toBe('T2');
  });
  it('should return T4 for t = 1.0', () => {
    expect(mapToBucketT(1.0)).toBe('T4');
  });
});

describe('mapToBucketK', () => {
  it('should return K0 for kv = 3', () => {
    expect(mapToBucketK(3)).toBe('K0');
  });
  it('should return K2 for kv = 40', () => {
    expect(mapToBucketK(40)).toBe('K2');
  });
  it('should return K3 for kv = 100', () => {
    expect(mapToBucketK(100)).toBe('K3');
  });
});

describe('mapToBucketP', () => {
  it('should return P0 for pv = 0.15', () => {
    expect(mapToBucketP(0.15)).toBe('P0');
  });
  it('should return P2 for pv = 0.6', () => {
    expect(mapToBucketP(0.6)).toBe('P2');
  });
  it('should return P3 for pv = 0.9', () => {
    expect(mapToBucketP(0.9)).toBe('P3');
  });
});

describe('mapToBucketR', () => {
  it('should return R0 for rv = 1.02', () => {
    expect(mapToBucketR(1.02)).toBe('R0');
  });
  it('should return R2 for rv = 1.4', () => {
    expect(mapToBucketR(1.4)).toBe('R2');
  });
  it('should return R3 for rv = 1.8', () => {
    expect(mapToBucketR(1.8)).toBe('R3');
  });
});

describe('choosePattern', () => {
  it('should return A for perfect match', () => {
    expect(choosePattern('T0', 'K0', 'P0', 'R1')).toBe('A');
  });
  it('should return B for perfect match', () => {
    expect(choosePattern('T1', 'K1', 'P1', 'R2')).toBe('B');
  });
  it('should return J with 2 matches', () => {
    expect(choosePattern('T0', 'K3', 'P1', 'R3')).toBe('J');
  });
    it('should return F with 2 matches', () => {
    expect(choosePattern('T0', 'K1', 'P2', 'R3')).toBe('F');
  });
});