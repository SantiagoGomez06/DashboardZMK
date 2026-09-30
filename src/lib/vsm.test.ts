import { describe, expect, it } from 'vitest'
import { vsmStages } from '../data/vsm'
import { largestMuda, simulateTobe, sumVsm } from './vsm'

describe('totales VSM AS-IS', () => {
  it('calcula CT=1360, VA=155, NVA=1205 y porcentajes', () => {
    const t = sumVsm(vsmStages)
    expect(t.ct).toBe(1360)
    expect(t.va).toBe(155)
    expect(t.nva).toBe(1205)
    expect(t.pctNva).toBeCloseTo(88.60294117647, 5)
    expect(t.pctVa).toBeCloseTo(11.39705882353, 5)
    expect(t.va + t.nva).toBe(t.ct)
  })

  it('identifica la espera de bodega como la muda más grande', () => {
    expect(largestMuda(vsmStages).id).toBe('4')
    expect(largestMuda(vsmStages).nva).toBe(960)
  })

  it('el simulador TO-BE recalcula desde los sliders', () => {
    const t = simulateTobe(vsmStages, {
      waitMinutes: 60,
      inboundMinutes: 5,
      outboundMinutes: 5,
    })
    expect(t.nva).toBe(1205 - 960 - 10 - 15 + 60 + 5 + 5)
    expect(t.ct).toBe(1360 - 960 - 10 - 15 + 60 + 5 + 5)
  })
})
