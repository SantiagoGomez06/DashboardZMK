import { useState } from 'react'
import { hybridConclusion, technologies } from '../data/technologies'
import { GlossaryTip } from '../components/GlossaryTip'
import { ModuleFrame } from '../components/ModuleFrame'

const impactLabel = {
  ALTO: 'Alto',
  'MUY ALTO': 'Muy alto',
  EXTRAORDINARIO: 'Extraordinario',
}

export function Tecnologias() {
  const [on, setOn] = useState({ gps: true, app: true, ia: true })
  const [flipped, setFlipped] = useState<string | null>(null)

  return (
    <ModuleFrame
      question="¿Qué tecnología mueve la satisfacción y qué se pierde si se apaga una pieza?"
      headline="Esquema híbrido: GPS ve, la app legaliza, la IA avisa. El impacto en CSAT/NPS es cualitativo (fuente)."
      remember="Sin las tres capas el cliente vuelve a preguntar “¿dónde va mi lote?”."
      technical={<p>{hybridConclusion}</p>}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {technologies.map((tech) => (
          <button
            key={tech.id}
            type="button"
            onClick={() => setFlipped((f) => (f === tech.id ? null : tech.id))}
            className="min-h-48 rounded-2xl border-2 border-blue-700 p-4 text-left"
            aria-pressed={flipped === tech.id}
          >
            {flipped === tech.id ? (
              <p>{tech.why}</p>
            ) : (
              <>
                <p className="font-bold">{tech.name}</p>
                <p className="mt-2 text-sm">{tech.text}</p>
                <p className="mt-3 font-black">
                  Impacto {impactLabel[tech.impact]}
                  <span className="ml-2 inline-block h-2 bg-blue-700" style={{ width: tech.impact === 'ALTO' ? 40 : tech.impact === 'MUY ALTO' ? 70 : 100 }} />
                </p>
                <p className="mt-2 text-xs">Clic para voltear</p>
              </>
            )}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 640 90" className="mt-4 w-full" role="img" aria-label="Flujo GPS, app ePOD, IA, cliente">
        {['GPS', 'App ePOD', 'IA', 'Cliente informado'].map((label, i) => (
          <g key={label} transform={`translate(${40 + i * 150} 20)`}>
            <rect width="130" height="50" rx="8" className="fill-blue-700" />
            <text x="65" y="32" textAnchor="middle" fill="white" fontSize="12">
              {label}
            </text>
            {i < 3 ? <path d="M 130 25 L 148 25" stroke="currentColor" strokeWidth="3" /> : null}
          </g>
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap gap-4">
        {technologies.map((tech) => (
          <label key={tech.id} className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={on[tech.id as keyof typeof on]}
              onChange={(e) => setOn((s) => ({ ...s, [tech.id]: e.target.checked }))}
            />
            {tech.name.split('(')[0]}
          </label>
        ))}
      </div>
      <ul className="mt-2 list-disc pl-5">
        {technologies.map((tech) =>
          on[tech.id as keyof typeof on] ? null : (
            <li key={tech.id}>
              {tech.lostIfOff}
            </li>
          ),
        )}
      </ul>
      <p className="mt-2 text-sm">
        <GlossaryTip term="CSAT" /> · <GlossaryTip term="NPS" /> · <GlossaryTip term="ePOD" />
      </p>
    </ModuleFrame>
  )
}
