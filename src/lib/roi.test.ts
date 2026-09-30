import { describe, expect, it } from 'vitest'
import { calculateRoi } from './roi'

describe('ROI / payback', () => {
  it('calcula ahorro, neto y payback', () => {
    const r = calculateRoi({
      hardwareCapex: 12_000_000,
      monthlyOpex: 1_000_000,
      monthlyBilling: 30_000_000,
      dsoBefore: 40,
      dsoAfter: 10,
      avoidedCreditNotes: 1_000_000,
      avoidedFalseFreight: 500_000,
    })
    expect(r.liquidityFromDso).toBe(30_000_000)
    expect(r.monthlySavings).toBe(31_500_000)
    expect(r.monthlyNet).toBe(30_500_000)
    expect(r.paybackMonths).toBeCloseTo(12_000_000 / 30_500_000)
    expect(r.cumulative).toHaveLength(18)
    expect(r.cumulative[0].value).toBe(-12_000_000 + 30_500_000)
  })

  it('payback nulo si el neto mensual no es positivo', () => {
    const r = calculateRoi({
      hardwareCapex: 10,
      monthlyOpex: 100,
      monthlyBilling: 0,
      dsoBefore: 10,
      dsoAfter: 10,
      avoidedCreditNotes: 0,
      avoidedFalseFreight: 0,
    })
    expect(r.paybackMonths).toBeNull()
  })
})
