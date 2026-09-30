export type MudaKind =
  | 'Espera'
  | 'Sobretransporte externo'
  | 'Defectos'
  | 'Burocracia / Sobreprocesamiento'
  | 'Movimiento manual interno'
  | 'Espera / Reproceso'
  | 'N/A (proceso clave)'

export type VsmStage = {
  id: string
  etapa: string
  ct: number
  va: number
  nva: number
  muda: MudaKind
}

/** Fuente: VSM AS-IS en minutos. Turno 480 min/día (7:00 a. m. a 3:45 p. m.). */
export const vsmStages: readonly VsmStage[] = [
  {
    id: '1',
    etapa: 'Asesoría por WhatsApp',
    ct: 15,
    va: 5,
    nva: 10,
    muda: 'Espera',
  },
  {
    id: '2',
    etapa: 'Cliente trae piezas (Inbound)',
    ct: 10,
    va: 0,
    nva: 10,
    muda: 'Sobretransporte externo',
  },
  {
    id: '3',
    etapa: 'Inspección visual inicial',
    ct: 15,
    va: 0,
    nva: 15,
    muda: 'Defectos',
  },
  {
    id: '4',
    etapa: 'Espera en bodega (2 días)',
    ct: 960,
    va: 0,
    nva: 960,
    muda: 'Espera',
    },
  {
    id: '5-6',
    etapa: 'Ingreso y programación',
    ct: 25,
    va: 0,
    nva: 25,
    muda: 'Burocracia / Sobreprocesamiento',
  },
  {
    id: '7',
    etapa: 'Lavado (FOSLAM) y lijado',
    ct: 45,
    va: 45,
    nva: 0,
    muda: 'N/A (proceso clave)',
  },
  {
    id: '8-11',
    etapa: 'Aplicación de pintura y horneado',
    ct: 110,
    va: 80,
    nva: 30,
    muda: 'Movimiento manual interno',
  },
  {
    id: '12-15',
    etapa: 'Enfriamiento, inspección y empaque',
    ct: 160,
    va: 25,
    nva: 135,
    muda: 'Espera / Reproceso',
  },
  {
    id: '16',
    etapa: 'Aviso al cliente',
    ct: 5,
    va: 0,
    nva: 5,
    muda: 'Espera',
  },
  {
    id: '17',
    etapa: 'Cliente recoge pieza (Outbound)',
    ct: 15,
    va: 0,
    nva: 15,
    muda: 'Sobretransporte externo',
  },
] as const

export const vsmAssumptions = {
  shiftMinutes: 480,
  waitTwoBusinessDaysMinutes: 960,
} as const

export const bottlenecks = [
  {
    id: 'a',
    title: 'Descoordinación de aprovisionamiento (paso 4)',
    text: 'ZMK no controla la llegada de la mercancía, lo que impide nivelar la producción (Heijunka).',
  },
  {
    id: 'b',
    title: 'Sobretransporte descentralizado (pasos 2 y 17)',
    text: 'Cada cliente hace viajes individuales, con congestión en muelles e interrupciones operativas.',
  },
] as const
