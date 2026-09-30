import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { Canal } from './modules/Canal'
import { Conclusiones } from './modules/Conclusiones'
import { Costos } from './modules/Costos'
import { Portada } from './modules/Portada'
import { ProblemaAsIs } from './modules/ProblemaAsIs'
import { SimuladorTobe } from './modules/SimuladorTobe'
import { Tecnologias } from './modules/Tecnologias'
import { TorreControl } from './modules/TorreControl'
import { WhatsAppSim } from './modules/WhatsAppSim'
import { MODULES, useAppStore } from './store/appStore'

export default function App() {
  const module = useAppStore((s) => s.module)
  const setModule = useAppStore((s) => s.setModule)
  const next = useAppStore((s) => s.next)
  const prev = useAppStore((s) => s.prev)
  const presentation = useAppStore((s) => s.presentation)
  const togglePresentation = useAppStore((s) => s.togglePresentation)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('presentation', presentation)
    root.style.colorScheme = theme
  }, [theme, presentation])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        prev()
      }
      if (e.key === 'Home') setModule(0)
      if (e.key === 'End') setModule(8)
      if (e.key === 'p' || e.key === 'P') togglePresentation()
      if (e.key === 'F11') {
        e.preventDefault()
        if (!document.fullscreenElement) void document.documentElement.requestFullscreen()
        else void document.exitFullscreen()
      }
      if (e.key === 'Escape' && presentation) togglePresentation()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, setModule, togglePresentation, presentation])

  const view =
    module === 0 ? (
      <Portada />
    ) : module === 1 ? (
      <ProblemaAsIs />
    ) : module === 2 ? (
      <Canal />
    ) : module === 3 ? (
      <SimuladorTobe />
    ) : module === 4 ? (
      <TorreControl />
    ) : module === 5 ? (
      <WhatsAppSim />
    ) : module === 6 ? (
      <Tecnologias />
    ) : module === 7 ? (
      <Costos />
    ) : (
      <Conclusiones />
    )

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
          Saltar al contenido
        </a>
        <header className="print:hidden sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
            <p className="mr-4 font-black">ZMK Logística 360</p>
            <nav aria-label="Módulos" className="flex flex-1 flex-wrap gap-1">
              {MODULES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModule(m.id)}
                  className={`rounded-lg px-2 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    module === m.id ? 'bg-blue-700 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  aria-current={module === m.id ? 'page' : undefined}
                >
                  {m.short}. {m.label}
                </button>
              ))}
            </nav>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded border px-2 py-1 text-sm" onClick={toggleTheme}>
                Tema {theme === 'light' ? 'oscuro' : 'claro'}
              </button>
              <button type="button" className="rounded border px-2 py-1 text-sm" onClick={togglePresentation} aria-pressed={presentation}>
                {presentation ? 'Modo explorar' : 'Modo presentación'}
              </button>
              <button type="button" className="rounded border px-2 py-1 text-sm" onClick={() => window.print()}>
                Imprimir / PDF
              </button>
            </div>
          </div>
          <div className="h-1 bg-zinc-200 dark:bg-zinc-800" aria-hidden>
            <div className="h-full bg-blue-700" style={{ width: `${((module + 1) / 9) * 100}%` }} />
          </div>
        </header>
        <main id="contenido" className={`mx-auto max-w-7xl px-4 py-6 ${presentation ? 'text-lg md:text-xl' : ''}`}>
          {view}
        </main>
        <footer className="print:hidden mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-6 text-sm">
          <button type="button" className="rounded-lg border px-3 py-2 font-semibold" onClick={prev} disabled={module === 0}>
            ← Anterior
          </button>
          <p>
            Paso {module + 1} de 9 · Teclado: ← → · P presentación · F11 pantalla completa
          </p>
          <button type="button" className="rounded-lg border px-3 py-2 font-semibold" onClick={next} disabled={module === 8}>
            Siguiente →
          </button>
        </footer>
      </div>
    </MotionConfig>
  )
}
