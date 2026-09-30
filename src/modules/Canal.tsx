import { useState } from 'react'
import { channelBenefits, channelAsIs, channelToBe } from '../data/channel'
import { GlossaryTip } from '../components/GlossaryTip'
import { ModuleFrame } from '../components/ModuleFrame'

export function Canal() {
  const [mix, setMix] = useState(0)
  return (
    <ModuleFrame
      question="¿Cómo se mueve el material hoy y cómo se movería con Milk-Run?"
      headline="Hoy hay muchas flechas sueltas. Después, un solo circuito entrega pintado y recoge crudo."
      remember="Canal directo (nivel cero) y distribución selectiva: Milk-Run no es para todo el mundo, sí para clientes con volumen."
      technical={
        <>
          <p>{channelAsIs.length}</p>
          <p>{channelAsIs.intensity}</p>
          <p>
            TO-BE: {channelToBe.fleet} {channelToBe.outbound} {channelToBe.inbound}
          </p>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold dark:bg-blue-900">
          Canal directo (nivel cero)
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold dark:bg-blue-900">
          Distribución selectiva
        </span>
        <GlossaryTip term="Milk-Run" />
        <GlossaryTip term="Outbound" />
        <GlossaryTip term="Inbound" />
      </div>
      <label className="mt-4 block font-semibold">
        Antes ↔ Después
        <input
          className="mt-2 w-full accent-blue-700"
          type="range"
          min={0}
          max={100}
          value={mix}
          onChange={(e) => setMix(Number(e.target.value))}
        />
      </label>
      <svg viewBox="0 0 720 280" className="mt-2 w-full rounded-2xl border bg-zinc-50 dark:bg-zinc-900" role="img" aria-label="Diagrama del canal AS-IS versus Milk-Run">
        <rect x="300" y="110" width="120" height="60" rx="8" className="fill-zinc-800" />
        <text x="360" y="145" textAnchor="middle" fill="white" fontSize="14">
          ZMK
        </text>
        {[80, 160, 560, 640].map((x, i) => (
          <g key={x} opacity={1 - mix / 100}>
            <circle cx={x} cy={i < 2 ? 50 : 230} r="18" className="fill-orange-600" />
            <line
              x1={x}
              y1={i < 2 ? 68 : 212}
              x2="360"
              y2={i < 2 ? 110 : 170}
              stroke="#c2410c"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
          </g>
        ))}
        <path
          d="M 120 140 C 200 40, 520 40, 600 140 C 520 240, 200 240, 120 140"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="6"
          opacity={mix / 100}
        />
        <text x="360" y="36" textAnchor="middle" fontSize="13" className="fill-current" opacity={mix / 100}>
          Milk-Run · Outbound + Inbound
        </text>
        <rect x="40" y="120" width="70" height="36" rx="6" className="fill-blue-700" opacity={mix / 100} />
        <text x="75" y="143" textAnchor="middle" fill="white" fontSize="11" opacity={mix / 100}>
          Camión
        </text>
      </svg>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {channelBenefits.map((b) => (
          <article key={b.id} className="rounded-xl border border-emerald-700 p-4">
            <p className="font-bold">{b.title}</p>
            <p className="mt-1">{b.text}</p>
          </article>
        ))}
      </div>
    </ModuleFrame>
  )
}
