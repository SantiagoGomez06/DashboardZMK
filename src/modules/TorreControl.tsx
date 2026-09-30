import { useEffect, useMemo, useRef, useState } from 'react'
import { geofences, fictionalClients, plantPoint } from '../data/geofences'
import { whatsappScenarios, type WhatsAppScenarioId } from '../data/whatsapp'
import { GlossaryTip } from '../components/GlossaryTip'
import { ModuleFrame, SimBanner } from '../components/ModuleFrame'
import { delayMinutesForEvent, minutesToClock, recalcEta, type EtaEvent } from '../lib/eta'
import { fillWhatsAppTemplate } from '../lib/whatsapp'
import { useAppStore } from '../store/appStore'

type LogItem = { t: string; text: string; silent?: boolean; scenario?: WhatsAppScenarioId }

const pathD =
  'M 90 300 C 180 300, 260 220, 420 180 S 560 250, 680 280 S 800 200, 880 160'

function eventToScenario(e: EtaEvent): WhatsAppScenarioId | null {
  if (e === 'congestion') return 'E0'
  if (e === 'mechanical') return 'E3'
  if (e === 'absent20') return 'E5'
  return null
}

function semaphore(events: EtaEvent[]): { label: string; className: string } {
  if (events.includes('mechanical')) return { label: 'Crisis', className: 'bg-red-700 text-white' }
  if (events.includes('congestion') || events.includes('absent20') || events.includes('stopped15'))
    return { label: 'Alerta', className: 'bg-amber-500 text-black' }
  if (events.includes('deviation')) return { label: 'Desvío', className: 'bg-amber-200 text-black' }
  return { label: 'En ruta', className: 'bg-emerald-700 text-white' }
}

export function TorreControl() {
  const clientName = useAppStore((s) => s.clientName)
  const newTime = useAppStore((s) => s.newTime)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [progress, setProgress] = useState(0)
  const [events, setEvents] = useState<EtaEvent[]>([])
  const [log, setLog] = useState<LogItem[]>([])
  const [openScenario, setOpenScenario] = useState<WhatsAppScenarioId | null>(null)
  const [mode, setMode] = useState<'entrega' | 'recoleccion'>('entrega')
  const fired = useRef({ exit: false, dest: false, collect: false, epod: false })

  const baseEta = 9 * 60 + 20
  const etaMin = recalcEta(baseEta, events)
  const etaLabel = events.includes('congestion') ? '10:45 AM' : minutesToClock(etaMin)
  const sem = semaphore(events)

  const message = useMemo(() => {
    if (!openScenario) return ''
    const sc = whatsappScenarios.find((s) => s.id === openScenario)
    if (!sc) return ''
    return fillWhatsAppTemplate(sc.template, {
      clientName,
      newTime,
      mapLink: '#mapa-ilustrativo',
      epodLink: '#epod-ilustrativo',
    })
  }, [openScenario, clientName, newTime])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setProgress((p) => {
        const n = p + dt * 0.04 * speed
        return n >= 1 ? 0 : n
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed])

  useEffect(() => {
    if (progress < 0.04) fired.current = { exit: false, dest: false, collect: false, epod: false }
    if (progress > 0.06 && !fired.current.exit) {
      fired.current.exit = true
      setLog((l) => [
        { t: minutesToClock(8 * 60), text: 'Sale de planta Sabaneta. ETA dinámico iniciado (geocerca origen).' },
        ...l,
      ])
    }
    if (progress > 0.38 && !fired.current.dest && mode === 'entrega') {
      fired.current.dest = true
      setOpenScenario('E2')
      setLog((l) => [{ t: etaLabel, text: 'Entra geocerca 1 km · Producto terminado.', scenario: 'E2' }, ...l])
    }
    if (progress > 0.55 && !fired.current.epod && mode === 'entrega') {
      fired.current.epod = true
      setOpenScenario('E4')
      setLog((l) => [{ t: etaLabel, text: 'ePOD firmado. Sale geocerca destino.', scenario: 'E4' }, ...l])
      setMode('recoleccion')
    }
    if (progress > 0.7 && !fired.current.collect && mode === 'recoleccion') {
      fired.current.collect = true
      setOpenScenario('E1')
      setLog((l) => [{ t: etaLabel, text: 'Entra geocerca 2 km · Ruta de recolección.', scenario: 'E1' }, ...l])
    }
  }, [progress, mode, etaLabel])

  function inject(event: EtaEvent, label: string) {
    setEvents((ev) => [...ev, event])
    const sc = eventToScenario(event)
    const silent = event === 'deviation' || event === 'stopped15'
    const delay = delayMinutesForEvent(event)
    setLog((l) => [
      {
        t: minutesToClock(etaMin + delay),
        text: `${label}. ETA +${delay} min (simulado).`,
        silent,
        scenario: sc ?? undefined,
      },
      ...l,
    ])
    if (sc) setOpenScenario(sc)
  }

  const truck = pointOnPath(progress)

  return (
    <ModuleFrame
      question="¿Cómo se controla la ruta en vivo y qué dispara cada geocerca?"
      headline="El mapa es un esquema (sin internet). Cada evento deja rastro en la torre y, si aplica, abre el chat."
      remember="Geocerca origen arranca el ETA; el corredor alerta en silencio; 1 km alista muelle; 2 km avisa recolección."
      technical={
        <ul className="list-disc pl-5">
          {geofences.map((g) => (
            <li key={g.id}>
              <strong>{g.name}:</strong> {g.trigger}
            </li>
          ))}
        </ul>
      }
    >
      <SimBanner>
        Clientes A/B/C, ETAs, demoras y el movimiento del camión son ilustrativos.
      </SimBanner>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="rounded-lg bg-blue-700 px-3 py-2 font-bold text-white" onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pausa' : 'Play'}
        </button>
        <label>
          Velocidad
          <select className="ml-2 rounded border bg-transparent px-2 py-1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={4}>4×</option>
          </select>
        </label>
        <span className={`rounded-full px-3 py-1 font-bold ${sem.className}`} aria-label={`Estado ${sem.label}`}>
          Semáforo: {sem.label}
        </span>
        <span className="font-bold">ETA dinámico: {etaLabel}</span>
        <button type="button" className="rounded-lg border px-3 py-2 font-semibold" onClick={() => { setEvents([]); setLog([]); setProgress(0); setPlaying(false); setOpenScenario(null); setMode('entrega') }}>
          Restablecer
        </button>
      </div>
      <input className="mt-2 w-full accent-blue-700" type="range" min={0} max={1000} value={Math.round(progress * 1000)} onChange={(e) => setProgress(Number(e.target.value) / 1000)} aria-label="Línea de tiempo de la ruta" />

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <svg viewBox="0 0 1000 420" className="w-full rounded-2xl border bg-slate-100 dark:bg-slate-900" role="img" aria-label="Mapa esquemático Sabaneta, vía regional y tres clientes">
          <text x="20" y="28" className="fill-current" fontSize="14">
            Esquema Valle de Aburrá — no es un mapa real
          </text>
          <path d={pathD} fill="none" stroke="#64748b" strokeWidth="14" strokeLinecap="round" />
          <path d={pathD} fill="none" stroke="#1d4ed8" strokeWidth="4" strokeDasharray="12 10" />
          <circle cx={plantPoint.x} cy={plantPoint.y} r="28" className="fill-zinc-900" />
          <text x={plantPoint.x} y={plantPoint.y + 4} textAnchor="middle" fill="white" fontSize="10">
            Planta
          </text>
          {fictionalClients.map((c) => (
            <g key={c.id}>
              <circle cx={c.x} cy={c.y} r="52" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx={c.x} cy={c.y} r="28" fill="none" stroke="#047857" strokeWidth="2" />
              <circle cx={c.x} cy={c.y} r="10" className="fill-emerald-700" />
              <text x={c.x} y={c.y - 60} textAnchor="middle" fontSize="12" className="fill-current">
                {c.name}
              </text>
            </g>
          ))}
          <circle cx={truck.x} cy={truck.y} r="12" className="fill-blue-700 stroke-white" strokeWidth="3" />
          <text x={truck.x} y={truck.y - 16} textAnchor="middle" fontSize="11" className="fill-current">
            Camión
          </text>
        </svg>
        <div className="space-y-2">
          <p className="font-bold">Inyectar eventos</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded border px-2 py-1" onClick={() => inject('congestion', 'Congestión urbana')}>Congestión</button>
            <button type="button" className="rounded border px-2 py-1" onClick={() => inject('deviation', 'Desviación > 500 m')}>Desviación &gt; 500 m</button>
            <button type="button" className="rounded border px-2 py-1" onClick={() => inject('stopped15', 'Detenido > 15 min fuera de entrega')}>Detenido &gt; 15 min</button>
            <button type="button" className="rounded border px-2 py-1" onClick={() => inject('mechanical', 'Falla mecánica + motor apagado')}>Falla mecánica</button>
            <button type="button" className="rounded border px-2 py-1" onClick={() => inject('absent20', 'Cliente ausente &gt; 20 min')}>Cliente ausente &gt; 20 min</button>
          </div>
          <p className="text-sm">
            Modo carga: <strong>{mode === 'entrega' ? 'Producto terminado' : 'Ruta de recolección'}</strong>
          </p>
          <ul className="max-h-48 overflow-auto rounded-lg border p-2 text-sm" aria-live="polite">
            {log.map((item, i) => (
              <li key={`${item.t}-${i}`} className="border-b border-zinc-200 py-1 dark:border-zinc-700">
                <span className="font-mono">{item.t}</span> {item.silent ? '[silencioso torre] ' : ''}
                {item.text}
                {item.scenario ? (
                  <button type="button" className="ml-2 underline" onClick={() => setOpenScenario(item.scenario!)}>
                    Ver {item.scenario}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm">
        {geofences.map((g) => (
          <article key={g.id} className="rounded-lg border p-3">
            <p className="font-bold">{g.name}</p>
            <p>{g.simple}</p>
          </article>
        ))}
      </div>
      {openScenario ? (
        <aside className="mt-3 rounded-xl border border-blue-700 bg-white p-4 dark:bg-zinc-900">
          <p className="font-bold">
            Mensaje {openScenario} · <GlossaryTip term="Trigger" />
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message}</p>
        </aside>
      ) : null}
    </ModuleFrame>
  )
}

function pointOnPath(t: number): { x: number; y: number } {
  const samples = [
    { x: 90, y: 300 },
    { x: 220, y: 250 },
    { x: 420, y: 180 },
    { x: 550, y: 230 },
    { x: 680, y: 280 },
    { x: 780, y: 210 },
    { x: 880, y: 160 },
  ]
  const p = Math.min(0.999, Math.max(0, t)) * (samples.length - 1)
  const i = Math.floor(p)
  const f = p - i
  const a = samples[i]
  const b = samples[i + 1]
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }
}
