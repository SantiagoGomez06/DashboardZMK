import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { vsmStages } from '../data/vsm'
import { ModuleFrame, SimBanner } from '../components/ModuleFrame'
import { simulateTobe, sumVsm } from '../lib/vsm'

const defaults = { waitMinutes: 120, inboundMinutes: 8, outboundMinutes: 8 }

export function SimuladorTobe() {
  const asIs = useMemo(() => sumVsm(vsmStages), [])
  const [waitMinutes, setWait] = useState(defaults.waitMinutes)
  const [inboundMinutes, setIn] = useState(defaults.inboundMinutes)
  const [outboundMinutes, setOut] = useState(defaults.outboundMinutes)

  const tobe = simulateTobe(vsmStages, { waitMinutes, inboundMinutes, outboundMinutes })
  const chart = [
    { name: 'CT', ASIS: asIs.ct, TOBE: tobe.ct },
    { name: 'NVA', ASIS: asIs.nva, TOBE: tobe.nva },
    { name: '%NVA', ASIS: Number(asIs.pctNva.toFixed(1)), TOBE: Number(tobe.pctNva.toFixed(1)) },
  ]

  return (
    <ModuleFrame
      question="¿Qué pasaría si bajaran la espera y el transporte del cliente?"
      headline="Mueve los minutos supuestos y compara contra el AS-IS. No son resultados medidos."
      remember="El TO-BE se explora con sliders; ZMK aún no midió el escenario nuevo."
      technical={
        <p>
          Se sustituyen solo los minutos de los pasos 4, 2 y 17. El resto de la tabla AS-IS no se
          toca. Fórmula: suma de CT/VA/NVA de la tabla modificada.
        </p>
      }
    >
      <SimBanner>
        Escenario simulado con supuestos editables — no son resultados medidos
      </SimBanner>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="font-semibold">
          Espera en bodega (paso 4): {waitMinutes} min
          <input className="mt-2 w-full accent-orange-600" type="range" min={0} max={960} value={waitMinutes} onChange={(e) => setWait(Number(e.target.value))} />
        </label>
        <label className="font-semibold">
          Inbound cliente (paso 2): {inboundMinutes} min
          <input className="mt-2 w-full accent-orange-600" type="range" min={0} max={40} value={inboundMinutes} onChange={(e) => setIn(Number(e.target.value))} />
        </label>
        <label className="font-semibold">
          Outbound cliente (paso 17): {outboundMinutes} min
          <input className="mt-2 w-full accent-orange-600" type="range" min={0} max={40} value={outboundMinutes} onChange={(e) => setOut(Number(e.target.value))} />
        </label>
      </div>
      <button
        type="button"
        className="mt-3 rounded-lg border px-4 py-2 font-semibold"
        onClick={() => {
          setWait(defaults.waitMinutes)
          setIn(defaults.inboundMinutes)
          setOut(defaults.outboundMinutes)
        }}
      >
        Restablecer
      </button>
      <div className="mt-4 h-72">
        <ResponsiveContainer>
          <BarChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ASIS" name="AS-IS (fuente)" fill="#c2410c" />
            <Bar dataKey="TOBE" name="TO-BE (simulado)" fill="#047857" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="font-semibold">
        TO-BE simulado: CT {tobe.ct} min · NVA {tobe.nva} min · %NVA {tobe.pctNva.toFixed(1)}%
      </p>
    </ModuleFrame>
  )
}
