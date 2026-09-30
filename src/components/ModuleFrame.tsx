import type { ReactNode } from 'react'

export function ModuleFrame({
  question,
  headline,
  remember,
  children,
  technical,
}: {
  question: string
  headline: string
  remember: string
  children: ReactNode
  technical: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
        Pregunta que responde: {question}
      </p>
      <h2 className="max-w-5xl text-2xl font-bold leading-snug md:text-3xl">
        {headline}
      </h2>
      <div>{children}</div>
      <details className="rounded-xl border border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-600 dark:bg-zinc-900">
        <summary className="cursor-pointer font-semibold">Detalle técnico</summary>
        <div className="mt-3 space-y-2 text-sm leading-relaxed">{technical}</div>
      </details>
      <p className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-base font-semibold dark:bg-emerald-950/40">
        Lo que debes recordar: {remember}
      </p>
    </section>
  )
}

export function SimBanner({ children }: { children: ReactNode }) {
  return (
    <p
      role="note"
      className="rounded-lg border-2 border-dashed border-amber-500 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950 dark:bg-amber-950/40 dark:text-amber-100"
    >
      ILUSTRATIVO / SIMULADO — {children}
    </p>
  )
}
