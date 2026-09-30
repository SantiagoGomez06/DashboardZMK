export const channelAsIs = {
  title: 'Hoy: cada cliente trae y recoge',
  length: 'Canal directo o de nivel cero (ZMK → Cliente B2B, sin mayoristas ni detallistas).',
  intensity:
    'Distribución selectiva (no masiva); se orienta a clientes B2B del Valle de Aburrá con volumen y frecuencia que justifiquen el servicio.',
} as const

export const channelToBe = {
  title: 'Propuesta: Milk-Run integrado',
  fleet: 'Flota propia (o tercerizada bajo control de ZMK).',
  outbound: 'Entrega de piezas pintadas.',
  inbound: 'Recogida de piezas crudas y empaques, en la misma ruta cíclica (logística inversa).',
} as const

export const channelBenefits = [
  {
    id: 'consolidacion',
    title: 'Consolidación de carga',
    text: 'Agrupar demanda de varios clientes en un viaje y diluir el flete fijo.',
  },
  {
    id: 'jit',
    title: 'Sincronización JIT',
    text: 'El material crudo llega justo a tiempo y se elimina la Muda de espera.',
  },
  {
    id: 'tiempos',
    title: 'Menos transacciones aisladas',
    text: 'El cliente ya no destina recursos propios a mover piezas.',
  },
] as const
