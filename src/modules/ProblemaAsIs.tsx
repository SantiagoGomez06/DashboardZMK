import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { bottlenecks, vsmStages, type MudaKind } from '../data/vsm'
import { GlossaryTip } from '../components/GlossaryTip'
import { ModuleFrame } from '../components/ModuleFrame'
import { largestMuda, sumVsm } from '../lib/vsm'

const mudaFilters: Array<MudaKind | 'Todas'> = [
  'Todas',
  'Espera',
  'Sobretransporte externo',
  'Defectos',
  'Burocracia / Sobreprocesamiento',
  'Movimiento manual interno',
  'Espera / Reproceso',
  'N/A (proceso clave)',
]

export function ProblemaAsIs() {
  const totals = useMemo(() => sumVsm(vsmStages), [])
  const muda = largestMuda(vsmStages)
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<(typeof mudaFilters)[number]>('Todas')
  const [compress, setCompress] = useState(false)

  const visible = vsmStages.filter((s) => filter === 'Todas' || s.muda === filter)
  const open = vsmStages.find((s) => s.id === openId)

  const pie = [
    { name: '% VA', value: totals.va, fill: '#047857' },
    { name: '% NVA', value: totals.nva, fill: '#c2410c' },
  ]

  return (
    <ModuleFrame
      question="¿Dónde se pierde el tiempo hoy y por qué?"
      headline={`De ${totals.ct} min de ciclo, ${totals.nva} min no agregan valor (${totals.pctNva.toFixed(1)}%). La espera de bodega (960 min) domina.`}
      remember="El cliente trae y recoge: ZMK no nivela la llegada y el muelle se tapa."
      technical={
        <>
          <p>
            Totales calculados en código desde la tabla: CT {totals.ct}, VA {totals.va}, NVA{' '}
            {totals.nva}. %NVA {(totals.pctNva).toFixed(1)}%, %VA {(totals.pctVa).toFixed(1)}%.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Nota de la fuente: el documento original reporta NVA = 1210 min (89%); la suma de la
            tabla da 1205 min (88.6%). El dashboard usa el cálculo desde la tabla.
          </p>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-300 p-4 dark:border-zinc-600">
          <p className="text-sm">Ciclo total (CT)</p>
          <p className="text-4xl font-black">{totals.ct} min</p>
        </div>
        <div className="rounded-2xl border border-zinc-300 p-4 dark:border-zinc-600">
          <p className="text-sm">
            <GlossaryTip term="VA" /> vs <GlossaryTip term="NVA" />
          </p>
          <div className="h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60}>
                  {pie.map((p) => (
                    <Cell key={p.name} fill={p.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm">
            VA {totals.pctVa.toFixed(1)}% · NVA {totals.pctNva.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-2xl border-2 border-orange-600 p-4">
          <p className="text-sm">Muda más grande</p>
          <p className="text-2xl font-black">{muda.etapa}</p>
          <p className="text-3xl font-black text-orange-700 dark:text-orange-400">{muda.nva} min</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-lg border px-3 py-2 font-semibold"
          onClick={() => setCompress((v) => !v)}
          aria-pressed={compress}
        >
          {compress ? 'Escala real' : 'Comprimir la espera'}
        </button>
        {mudaFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-sm ${filter === f ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-300 p-3 dark:border-zinc-600">
        <p className="mb-2 text-sm">
          Línea de tiempo <GlossaryTip term="VSM" />. Verde = valor. Naranja = desperdicio. Ancho
          proporcional a minutos{compress ? ' (espera comprimida para leer el resto)' : ''}.
        </p>
        <div className="flex min-w-[900px] gap-1">
          {visible.map((s) => {
            const weight = compress && s.id === '4' ? 80 : s.ct
            const vaShare = s.ct === 0 ? 0 : s.va / s.ct
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setOpenId(s.id)}
                style={{ flexGrow: weight, flexBasis: 0 }}
                className="min-h-28 min-w-[2.5rem] overflow-hidden rounded-lg border-2 border-zinc-800 text-left text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`${s.etapa}, ${s.ct} minutos`}
              >
                <span
                  className="block bg-emerald-700 text-white"
                  style={{ height: `${Math.max(8, vaShare * 100)}%` }}
                />
                <span className="block bg-[repeating-linear-gradient(45deg,#c2410c,#c2410c_6px,#9a3412_6px,#9a3412_12px)] p-1 font-bold text-white">
                  {s.id} · {s.ct}m
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {open ? (
        <aside className="mt-3 rounded-xl border border-blue-700 bg-blue-50 p-4 dark:bg-blue-950/40" aria-live="polite">
          <p className="font-bold">
            Paso {open.id}: {open.etapa}
          </p>
          <p>
            CT {open.ct} · VA {open.va} · NVA {open.nva} · Muda: {open.muda}
          </p>
          <p className="mt-1 text-sm">
            En simple: {open.va > 0 && open.nva === 0
              ? 'aquí sí se transforma la pieza.'
              : open.id === '4'
                ? 'la pieza se queda dos días porque no hay ruta coordinada.'
                : 'tiempo que el cliente no pagaría si pudiera evitarlo.'}
          </p>
        </aside>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <h3 className="md:col-span-2 text-lg font-bold">¿Por qué pasa?</h3>
        {bottlenecks.map((b) => (
          <article key={b.id} className="rounded-xl border border-orange-600 p-4">
            <p className="font-bold">{b.title}</p>
            <p className="mt-1">{b.text}</p>
          </article>
        ))}
      </div>
    </ModuleFrame>
  )
}
