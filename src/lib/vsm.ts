import type { VsmStage } from '../data/vsm'

export type VsmTotals = {
  ct: number
  va: number
  nva: number
  pctNva: number
  pctVa: number
}

export function sumVsm(stages: readonly VsmStage[]): VsmTotals {
  const ct = stages.reduce((s, x) => s + x.ct, 0)
  const va = stages.reduce((s, x) => s + x.va, 0)
  const nva = stages.reduce((s, x) => s + x.nva, 0)
  const pctNva = ct === 0 ? 0 : (nva / ct) * 100
  const pctVa = ct === 0 ? 0 : (va / ct) * 100
  return { ct, va, nva, pctNva, pctVa }
}

export type TobeInputs = {
  waitMinutes: number
  inboundMinutes: number
  outboundMinutes: number
}

export function simulateTobe(stages: readonly VsmStage[], inputs: TobeInputs): VsmTotals {
  const next = stages.map((stage) => {
    if (stage.id === '4') {
      return { ...stage, ct: inputs.waitMinutes, nva: inputs.waitMinutes, va: 0 }
    }
    if (stage.id === '2') {
      return { ...stage, ct: inputs.inboundMinutes, nva: inputs.inboundMinutes, va: 0 }
    }
    if (stage.id === '17') {
      return { ...stage, ct: inputs.outboundMinutes, nva: inputs.outboundMinutes, va: 0 }
    }
    return stage
  })
  return sumVsm(next)
}

export function largestMuda(stages: readonly VsmStage[]): VsmStage {
  return stages.reduce((best, s) => (s.nva > best.nva ? s : best))
}
