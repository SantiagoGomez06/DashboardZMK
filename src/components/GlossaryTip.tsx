import { useId, useState } from 'react'
import { findGlossary } from '../store/appStore'

export function GlossaryTip({ term }: { term: string }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const entry = findGlossary(term)
  if (!entry) return <span>{term}</span>
  return (
    <span className="relative inline-flex items-baseline gap-0.5">
      <span className="font-semibold">{entry.term}</span>
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Qué significa ${entry.term}`}
        onClick={() => setOpen((v) => !v)}
      >
        ?
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute z-30 mt-6 w-64 rounded-lg border border-zinc-300 bg-white p-3 text-left text-sm font-normal text-zinc-800 shadow-lg dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {entry.definition}
        </span>
      ) : null}
    </span>
  )
}
