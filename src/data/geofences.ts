export const geofences = [
  {
    id: 'origen',
    name: 'Origen (Planta Sabaneta)',
    trigger:
      'Al abandonar el perímetro inicia el ETA dinámico hacia el primer cliente de la ruta.',
    simple: 'Cuando el camión sale de la planta, empieza el reloj de llegada.',
  },
  {
    id: 'transito',
    name: 'Tránsito (Corredor Vía Regional)',
    trigger:
      'Si el vehículo está detenido más de 15 min fuera de un punto de entrega programado, o se desvía más de 500 m de la ruta óptima, genera una alerta silenciosa a la Torre de Control.',
    simple: 'En la vía: si se para demasiado o se sale del corredor, avisa a ZMK (no al cliente).',
  },
  {
    id: 'destino',
    name: 'Destino (plantas cliente B2B)',
    trigger:
      'Entrada (radio de 1 km) notifica para alistar la zona de recepción. Salida valida en la Driver App que la prueba de entrega digital (ePOD) y las firmas fueron capturadas.',
    simple: 'A 1 km: “alisten el muelle”. Al salir: el conductor debe haber firmado y fotografiado.',
  },
  {
    id: 'recoleccion',
    name: 'Recolección de material crudo',
    trigger: 'Geocerca de 2 km del cliente en modo "Ruta de Recolección".',
    simple: 'A 2 km, en modo recolección, se avisa que van por las piezas crudas.',
  },
] as const

export const fictionalClients = [
  { id: 'A', name: 'Cliente A', x: 420, y: 180 },
  { id: 'B', name: 'Cliente B', x: 680, y: 280 },
  { id: 'C', name: 'Cliente C', x: 880, y: 160 },
] as const

export const plantPoint = { x: 90, y: 300 } as const
