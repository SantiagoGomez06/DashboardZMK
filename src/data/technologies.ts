export type ImpactLevel = 'ALTO' | 'MUY ALTO' | 'EXTRAORDINARIO'

export const technologies = [
  {
    id: 'gps',
    name: 'Telemetría IoT / GPS vehicular',
    impact: 'ALTO' as ImpactLevel,
    text: 'Tracking físico del camión con transmisión GPRS continua a la Torre de Control.',
    why: 'Reduce la incertidumbre operativa y asegura los activos; el cliente B2B valora la exactitud de los datos.',
    lostIfOff: 'Sin GPS no hay ubicación ni ETA de base; la torre queda a ciegas.',
  },
  {
    id: 'app',
    name: 'App móvil para el conductor (ePOD)',
    impact: 'MUY ALTO' as ImpactLevel,
    text: 'Captura de firma digital, validación de coordenadas y registro fotográfico del estado de las piezas entregadas.',
    why: 'Digitaliza la legalización del flete, da transparencia sobre la calidad de la entrega y agiliza la facturación.',
    lostIfOff: 'Sin ePOD no hay prueba digital ni fotos; la factura se demora y crecen las disputas.',
  },
  {
    id: 'ia',
    name: 'Agentes de IA predictiva en la nube',
    impact: 'EXTRAORDINARIO' as ImpactLevel,
    text: 'Análisis de tráfico histórico, ventanas horarias de clientes B2B y proyección dinámica del ETA.',
    why: 'Notificaciones proactivas; aumenta el NPS al evitar que el cliente tenga que consultar el estado de su pedido.',
    lostIfOff: 'Sin IA el cliente no recibe avisos proactivos; el NPS pierde el salto de “me avisan solos”.',
  },
] as const

export const hybridConclusion =
  'Esquema HÍBRIDO integral. El GPS vehicular da la telemetría base, la app del conductor valida la transacción física (ePOD) y la IA predictiva procesa ambos flujos para entregar información proactiva al cliente.'
