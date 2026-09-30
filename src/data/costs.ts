export const costConcepts = {
  capex:
    'Hardware de telemetría y módulos GPS para los vehículos; activos fijos sujetos a depreciación.',
  opex:
    'Licencias de la app móvil (SaaS) para conductores, planes de datos GPRS/IoT de alta disponibilidad y consumo de tokens de IA del agente supervisor.',
} as const

export const returnLevers = [
  {
    id: 'dso',
    title: 'Aceleración del ciclo de facturación (DSO)',
    text: 'Con ePOD se emite y radica la factura electrónica en el instante de la entrega, lo que reduce los días de rotación de cartera y mejora la liquidez.',
  },
  {
    id: 'mermas',
    title: 'Mitigación de mermas y notas crédito',
    text: 'El registro fotográfico desde la recolección hasta la entrega elimina disputas y protege el margen bruto.',
  },
  {
    id: 'fletes',
    title: 'Supresión de fletes en falso y penalizaciones',
    text: 'La comunicación predictiva reduce esperas (Mudas), evita multas por incumplir SLA y fomenta la recompra.',
  },
] as const

/** Valores de ejemplo para la calculadora. No provienen de la fuente. */
export const illustrativeRoiDefaults = {
  hardwareCapex: 18_000_000,
  monthlyOpex: 1_200_000,
  monthlyBilling: 80_000_000,
  dsoBefore: 45,
  dsoAfter: 30,
  avoidedCreditNotes: 2_500_000,
  avoidedFalseFreight: 800_000,
} as const
