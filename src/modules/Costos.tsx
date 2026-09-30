import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { costConcepts, illustrativeRoiDefaults, returnLevers } from '../data/costs'
import { GlossaryTip } from '../components/GlossaryTip'
import { ModuleFrame, SimBanner } from '../components/ModuleFrame'
import { calculateRoi } from '../lib/roi'

export function Costos() {
  const d = illustrativeRoiDefaults
  const [hardwareCapex, setCapex] = useState<number>(d.hardwareCapex)
  const [monthlyOpex, setOpex] = useState<number>(d.monthlyOpex)
  const [monthlyBilling, setBill] = useState<number>(d.monthlyBilling)
  const [dsoBefore, setDb] = useState<number>(d.dsoBefore)
  const [dsoAfter, setDa] = useState<number>(d.dsoAfter)
  const [avoidedCreditNotes, setCn] = useState<number>(d.avoidedCreditNotes)
  const [avoidedFalseFreight, setFf] = useState<number>(d.avoidedFalseFreight)

  const roi = useMemo(
    () =>
      calculateRoi({
        hardwareCapex,
        monthlyOpex,
        monthlyBilling,
        dsoBefore,
        dsoAfter,
        avoidedCreditNotes,
        avoidedFalseFreight,
      }),
    [hardwareCapex, monthlyOpex, monthlyBilling, dsoBefore, dsoAfter, avoidedCreditNotes, avoidedFalseFreight],
  )

  const cop = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <ModuleFrame
      question="¿Qué se paga una vez, qué se paga cada mes y cómo se pensaría el retorno?"
      headline="CAPEX es el hardware GPS. OPEX son licencias, datos e IA. El ROI de esta pantalla es un ejemplo editable."
      remember="ZMK debe poner sus números reales; aquí solo hay un modelo para explicar palancas."
      technical={
        <>
          <p>
            <GlossaryTip term="CAPEX" />: {costConcepts.capex}
          </p>
          <p>
            <GlossaryTip term="OPEX" />: {costConcepts.opex}
          </p>
          <p>
            Supuesto del modelo: liquidez por DSO ≈ ((DSO antes − DSO después) / 30) × facturación
            mensual, más notas crédito y fletes en falso evitados, menos OPEX. Payback = CAPEX /
            neto mensual.
          </p>
        </>
      }
    >
      <SimBanner>Ejemplo con supuestos propios; ZMK debe ingresar sus valores reales.</SimBanner>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border-2 border-zinc-800 p-4">
          <p className="font-bold">CAPEX (una vez)</p>
          <p>{costConcepts.capex}</p>
        </article>
        <article className="rounded-2xl border-2 border-blue-700 p-4">
          <p className="font-bold">OPEX (cada mes)</p>
          <p>{costConcepts.opex}</p>
        </article>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Num label="Inversión hardware (COP)" value={hardwareCapex} onChange={setCapex} />
        <Num label="OPEX mensual (COP)" value={monthlyOpex} onChange={setOpex} />
        <Num label="Facturación mensual (COP)" value={monthlyBilling} onChange={setBill} />
        <Num label="DSO antes (días)" value={dsoBefore} onChange={setDb} />
        <Num label="DSO después (días)" value={dsoAfter} onChange={setDa} />
        <Num label="Notas crédito evitadas / mes" value={avoidedCreditNotes} onChange={setCn} />
        <Num label="Fletes en falso evitados / mes" value={avoidedFalseFreight} onChange={setFf} />
      </div>
      <button
        type="button"
        className="mt-3 rounded-lg border px-4 py-2 font-semibold"
        onClick={() => {
          setCapex(d.hardwareCapex)
          setOpex(d.monthlyOpex)
          setBill(d.monthlyBilling)
          setDb(d.dsoBefore)
          setDa(d.dsoAfter)
          setCn(d.avoidedCreditNotes)
          setFf(d.avoidedFalseFreight)
        }}
      >
        Restablecer
      </button>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Stat k="Ahorro / liquidez mensual" v={cop(roi.monthlySavings)} />
        <Stat k="Neto mensual" v={cop(roi.monthlyNet)} />
        <Stat k="Payback" v={roi.paybackMonths == null ? 'No recupera con estos supuestos' : `${roi.paybackMonths.toFixed(1)} meses`} />
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer>
          <AreaChart data={roi.cumulative}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="value" name="Acumulado (simulado)" fill="#1d4ed8" stroke="#1e3a8a" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {returnLevers.map((l) => (
          <article key={l.id} className="rounded-xl border border-emerald-700 p-4">
            <p className="font-bold">{l.title}</p>
            <p className="mt-1 text-sm">{l.text}</p>
          </article>
        ))}
      </div>
    </ModuleFrame>
  )
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type="number"
        className="mt-1 w-full rounded border bg-transparent px-2 py-1 text-base"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-sm">{k}</p>
      <p className="text-xl font-black">{v}</p>
    </div>
  )
}
