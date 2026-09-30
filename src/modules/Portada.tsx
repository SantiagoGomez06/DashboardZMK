import { motion } from 'framer-motion'
import { company } from '../data/company'
import { useAppStore } from '../store/appStore'

export function Portada() {
  const setModule = useAppStore((s) => s.setModule)
  const cards = [
    {
      k: 'Problema',
      t: 'Cada cliente trae y recoge. La planta espera 2 días (960 min) sin controlar la llegada.',
      tone: 'bg-orange-50 border-orange-600 dark:bg-orange-950/40',
    },
    {
      k: 'Solución',
      t: 'Milk-Run de ZMK: un camión entrega pintado y recoge crudo. GPS, app e IA avisan por chat.',
      tone: 'bg-blue-50 border-blue-700 dark:bg-blue-950/40',
    },
    {
      k: 'Resultado buscado',
      t: 'Menos espera, muelle listo y cobro más rápido. El TO-BE aún no está medido: se explora aquí.',
      tone: 'bg-emerald-50 border-emerald-700 dark:bg-emerald-950/40',
    },
  ]
  return (
    <section className="flex flex-col gap-6">
      <p className="text-sm font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
        Pregunta que responde: ¿De qué trata esta exposición en 30 segundos?
      </p>
      <header className="space-y-2">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {company.author} · {company.program} · {company.institution}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">ZMK Logística 360</h1>
        <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-200">
          {company.name} · {company.plant}
        </p>
        <p className="max-w-3xl text-lg">{company.service}</p>
      </header>
      <h2 className="text-2xl font-bold">La historia en 30 segundos</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.article
            key={c.k}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`rounded-2xl border-l-8 p-5 shadow-sm ${c.tone}`}
          >
            <p className="text-sm font-bold uppercase">{c.k}</p>
            <p className="mt-2 text-lg leading-snug">{c.t}</p>
          </motion.article>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setModule(1)}
        className="self-start rounded-xl bg-blue-700 px-6 py-3 text-lg font-bold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
      >
        Comenzar recorrido
      </button>
      <p className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 font-semibold dark:bg-emerald-950/40">
        Lo que debes recordar: el Milk-Run es el qué; la torre, las geocercas y el chat son el cómo.
      </p>
    </section>
  )
}
