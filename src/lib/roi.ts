export type RoiInputs = {
  hardwareCapex: number
  monthlyOpex: number
  monthlyBilling: number
  dsoBefore: number
  dsoAfter: number
  avoidedCreditNotes: number
  avoidedFalseFreight: number
}

export type RoiResult = {
  liquidityFromDso: number
  monthlySavings: number
  monthlyNet: number
  paybackMonths: number | null
  cumulative: { month: number; value: number }[]
}

/** Supuesto documentado: el recorte de DSO libera liquidez ≈ (ΔDSO / 30) × facturación mensual. */
export function calculateRoi(inputs: RoiInputs, horizonMonths = 18): RoiResult {
  const dsoDelta = Math.max(0, inputs.dsoBefore - inputs.dsoAfter)
  const liquidityFromDso = (dsoDelta / 30) * inputs.monthlyBilling
  const monthlySavings =
    liquidityFromDso + inputs.avoidedCreditNotes + inputs.avoidedFalseFreight
  const monthlyNet = monthlySavings - inputs.monthlyOpex
  const paybackMonths =
    monthlyNet <= 0 ? null : inputs.hardwareCapex / monthlyNet

  let acc = -inputs.hardwareCapex
  const cumulative = Array.from({ length: horizonMonths }, (_, i) => {
    acc += monthlyNet
    return { month: i + 1, value: acc }
  })

  return { liquidityFromDso, monthlySavings, monthlyNet, paybackMonths, cumulative }
}
