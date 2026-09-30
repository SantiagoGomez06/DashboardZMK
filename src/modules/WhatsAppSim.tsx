import { useEffect, useMemo, useState } from 'react'
import { agentPrompt } from '../data/agent'
import { whatsappScenarios, type WhatsAppScenarioId } from '../data/whatsapp'
import { GlossaryTip } from '../components/GlossaryTip'
import { ModuleFrame, SimBanner } from '../components/ModuleFrame'
import { fillWhatsAppTemplate } from '../lib/whatsapp'
import { useAppStore } from '../store/appStore'

export function WhatsAppSim() {
  const clientName = useAppStore((s) => s.clientName)
  const setClientName = useAppStore((s) => s.setClientName)
  const newTime = useAppStore((s) => s.newTime)
  const setNewTime = useAppStore((s) => s.setNewTime)
  const [id, setId] = useState<WhatsAppScenarioId>('E0')
  const [typed, setTyped] = useState('')
  const [seq, setSeq] = useState(false)
  const scenario = whatsappScenarios.find((s) => s.id === id)!

  const full = useMemo(
    () =>
      fillWhatsAppTemplate(scenario.template, {
        clientName,
        newTime,
        mapLink: '#mapa-ilustrativo',
        epodLink: '#epod-ilustrativo',
      }),
    [scenario, clientName, newTime],
  )

  useEffect(() => {
    setTyped('')
    let i = 0
    const timer = window.setInterval(() => {
      i += 2
      setTyped(full.slice(0, i))
      if (i >= full.length) window.clearInterval(timer)
    }, 16)
    return () => window.clearInterval(timer)
  }, [full])

  useEffect(() => {
    if (!seq) return
    const order: WhatsAppScenarioId[] = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5']
    let n = 0
    setId(order[0])
    const t = window.setInterval(() => {
      n += 1
      if (n >= order.length) {
        window.clearInterval(t)
        setSeq(false)
        return
      }
      setId(order[n])
    }, 7000)
    return () => window.clearInterval(t)
  }, [seq])

  return (
    <ModuleFrame
      question="¿Qué le dice el agente al cliente y con qué instrucción trabaja?"
      headline="Detecta el trigger, decide (recalcular ETA) y envía el webhook. El texto es el de la fuente."
      remember="La IA no improvisó el mensaje: copia el escenario E0–E5 y solo llena nombre y hora."
      technical={
        <>
          <p>
            <strong>Contexto:</strong> {agentPrompt.context}
          </p>
          <p>
            <strong>Regla:</strong> {agentPrompt.decision}
          </p>
          <p>
            <strong>Acción:</strong> {agentPrompt.action}
          </p>
        </>
      }
    >
      <SimBanner>Nombre, hora y enlaces locales (#mapa-ilustrativo) son de demostración.</SimBanner>
      <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="mx-auto w-[280px] rounded-[2rem] border-8 border-zinc-800 bg-zinc-100 p-3 shadow-xl dark:bg-zinc-800">
          <p className="text-center text-xs text-zinc-500">Chat de mensajería (maqueta genérica)</p>
          <div className="mt-2 h-[420px] overflow-auto rounded-xl bg-white p-3 text-sm dark:bg-zinc-900">
            <p className="mb-2 text-xs font-bold">ZMK · asistente logístico</p>
            <p className="rounded-2xl bg-emerald-100 p-3 leading-relaxed text-zinc-900">{typed}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {whatsappScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setId(s.id)}
                className={`rounded-full border px-3 py-1 ${id === s.id ? 'bg-blue-700 text-white' : ''}`}
              >
                {s.id}
              </button>
            ))}
          </div>
          <label className="block font-semibold">
            Nombre del cliente
            <input className="mt-1 w-full rounded border bg-transparent px-2 py-1" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </label>
          <label className="block font-semibold">
            Nueva hora (placeholder E3)
            <input className="mt-1 w-full rounded border bg-transparent px-2 py-1" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
          </label>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Detecta: {scenario.trigger}</li>
            <li>Decide: recalcular ETA si aplica (congestión, falla, espera).</li>
            <li>
              Envía <GlossaryTip term="Webhook" /> al canal del cliente.
            </li>
          </ol>
          <p>
            <strong>{scenario.title}.</strong> {scenario.context}
          </p>
          <button type="button" className="rounded-lg bg-blue-700 px-4 py-2 font-bold text-white" onClick={() => setSeq(true)}>
            Reproducir los escenarios en secuencia
          </button>
          <details className="rounded-xl border p-3">
            <summary className="cursor-pointer font-semibold">Así se le instruye al agente</summary>
            <p className="mt-2">{agentPrompt.context}</p>
            <p className="mt-1">{agentPrompt.decision}</p>
            <p className="mt-1">{agentPrompt.action}</p>
          </details>
        </div>
      </div>
    </ModuleFrame>
  )
}
