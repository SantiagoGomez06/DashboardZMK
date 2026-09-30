import { useMemo, useState } from 'react'
import { company, sourceNotes } from '../data/company'
import { glossary } from '../data/glossary'
import { ModuleFrame } from '../components/ModuleFrame'

export function Conclusiones() {
  const [q, setQ] = useState('')
  const items = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return glossary
    return glossary.filter((g) => g.term.toLowerCase().includes(s) || g.definition.toLowerCase().includes(s))
  }, [q])

  return (
    <ModuleFrame
      question="¿Qué se lleva el público y dónde está cada término?"
      headline="El problema es la espera por transporte suelto; la respuesta es Milk-Run más torre, geocercas e IA."
      remember="Sin cifras inventadas del TO-BE: la fuente describe el diseño, no un piloto ya medido."
      technical={
        <ol className="list-decimal pl-5">
          {sourceNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
      }
    >
      <ul className="space-y-2 text-lg font-semibold">
        <li>1. Hoy el NVA (~88.6%) lo lidera la espera de 960 min porque ZMK no manda el inbound.</li>
        <li>2. El Milk-Run junta entrega pintada y recolecta crudo en un circuito selectivo B2B.</li>
        <li>3. GPS + ePOD + IA cierran el ciclo de aviso, prueba y cobro; el ROI se calcula con datos de ZMK.</li>
      </ul>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="mb-2 text-left font-bold">Antes vs después (cualitativo)</caption>
          <thead>
            <tr className="border-b">
              <th className="p-2">Tema</th>
              <th className="p-2">Antes</th>
              <th className="p-2">Después (diseño)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Transporte</td>
              <td className="p-2">Cada cliente viaja solo</td>
              <td className="p-2">Ruta Milk-Run de ZMK</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Información</td>
              <td className="p-2">WhatsApp de asesoría y aviso al final</td>
              <td className="p-2">Triggers, ETA y ePOD en ruta</td>
            </tr>
            <tr>
              <td className="p-2">Cobro / calidad</td>
              <td className="p-2">Legalización lenta, más disputas posibles</td>
              <td className="p-2">Firma y foto en el muelle</td>
            </tr>
          </tbody>
        </table>
      </div>
      <label className="mt-6 block font-semibold">
        Buscar en el glosario
        <input className="mt-1 w-full rounded border bg-transparent px-3 py-2" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <dl className="mt-3 columns-1 gap-4 md:columns-2">
        {items.map((g) => (
          <div key={g.term} className="mb-3 break-inside-avoid">
            <dt className="font-bold">{g.term}</dt>
            <dd>{g.definition}</dd>
          </div>
        ))}
      </dl>
      <footer className="mt-8 border-t pt-4 text-sm">
        <p className="font-bold">Notas de la fuente</p>
        <ul className="list-disc pl-5">
          {sourceNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="mt-4">
          Autora: {company.author}. {company.program}. {company.institution}. Empresa: {company.name},{' '}
          {company.plant}.
        </p>
      </footer>
    </ModuleFrame>
  )
}
