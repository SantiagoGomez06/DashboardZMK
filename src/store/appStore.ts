import { create } from 'zustand'
import { glossary } from '../data/glossary'

export const MODULES = [
  { id: 0, label: 'Portada', short: '0' },
  { id: 1, label: 'El problema hoy', short: '1' },
  { id: 2, label: 'Canal', short: '2' },
  { id: 3, label: 'Simulador TO-BE', short: '3' },
  { id: 4, label: 'Torre de control', short: '4' },
  { id: 5, label: 'WhatsApp / IA', short: '5' },
  { id: 6, label: 'Tecnologías', short: '6' },
  { id: 7, label: 'Costos y retorno', short: '7' },
  { id: 8, label: 'Conclusiones', short: '8' },
] as const

export type ThemeName = 'light' | 'dark'

function readTheme(): ThemeName {
  try {
    const v = localStorage.getItem('zmk-theme')
    if (v === 'dark' || v === 'light') return v
  } catch {
    /* fallback memoria */
  }
  return 'light'
}

function persistTheme(theme: ThemeName) {
  try {
    localStorage.setItem('zmk-theme', theme)
  } catch {
    /* ignore */
  }
}

type AppState = {
  module: number
  setModule: (n: number) => void
  next: () => void
  prev: () => void
  presentation: boolean
  togglePresentation: () => void
  theme: ThemeName
  toggleTheme: () => void
  clientName: string
  setClientName: (v: string) => void
  newTime: string
  setNewTime: (v: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  module: 0,
  setModule: (n) => set({ module: Math.max(0, Math.min(8, n)) }),
  next: () => set({ module: Math.min(8, get().module + 1) }),
  prev: () => set({ module: Math.max(0, get().module - 1) }),
  presentation: false,
  togglePresentation: () => set({ presentation: !get().presentation }),
  theme: readTheme(),
  toggleTheme: () => {
    const theme = get().theme === 'light' ? 'dark' : 'light'
    persistTheme(theme)
    set({ theme })
  },
  clientName: 'Cliente A',
  setClientName: (v) => set({ clientName: v }),
  newTime: '11:30 AM',
  setNewTime: (v) => set({ newTime: v }),
}))

export function findGlossary(term: string) {
  const lower = term.toLowerCase()
  return glossary.find((g) => g.term.toLowerCase() === lower)
}
