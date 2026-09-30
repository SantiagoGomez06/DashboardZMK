export type WhatsAppScenarioId = 'E0' | 'E1' | 'E2' | 'E3' | 'E4' | 'E5'

export type WhatsAppScenario = {
  id: WhatsAppScenarioId
  title: string
  context: string
  trigger: string
  template: string
}

export const whatsappScenarios: readonly WhatsAppScenario[] = [
  {
    id: 'E0',
    title: 'Retraso por congestión',
    context: 'Ejemplo de ETA 10:45 AM.',
    trigger: 'Congestión vehicular urbana severa detectada; el agente recalcula el ETA.',
    template:
      'Hola [Nombre del Cliente], soy el asistente logístico de ZMK DISEÑO. Tu entrega de piezas con recubrimiento electrostático presenta una actualización de ruta. Debido a congestión vehicular, el nuevo tiempo estimado de llegada (ETA) es a las 10:45 AM. Puedes seguir el recorrido de tu carga en vivo aquí: [Link del Mapa Interactivo].',
  },
  {
    id: 'E1',
    title: 'Recolección de material crudo',
    context:
      'El vehículo se acerca a la planta del cliente para recoger piezas que se procesarán en Sabaneta.',
    trigger:
      'El GPS registra ingreso a la geocerca de 2 km del cliente en modo "Ruta de Recolección".',
    template:
      'Hola [Nombre del Cliente]. Nuestro camión ZMK está a 15 minutos de tus instalaciones para recolectar tu lote de piezas. Para garantizar un recubrimiento electrostático perfecto, te recordamos verificar que las piezas estén listas: ⚠️ No deben tener restos de pintura líquida. ⚠️ Deben ser componentes 100% metálicos (retirar plásticos o gomas). ⚠️ Si aplicaron masilla, debe ser estrictamente de alta temperatura. Nuestro conductor validará estos puntos al cargar. Sigue el camión aquí: [Link del Mapa]',
  },
  {
    id: 'E2',
    title: 'Entrega de material pintado (alistamiento de muelle)',
    context:
      'El vehículo lleva producto terminado y necesita que el cliente tenga personal listo para descargar, minimizando la Muda de espera.',
    trigger:
      'Ingreso a geocerca de destino final (1 km) con estado de carga "Producto Terminado".',
    template:
      '¡Buenas noticias, [Nombre del Cliente]! Tu lote de piezas con recubrimiento electrostático está a punto de llegar. El camión se encuentra a menos de 10 minutos. Por favor, asegúrate de tener el área de recepción y el personal de descargue listos para agilizar el proceso. Sigue la ruta en vivo: [Link del Mapa]',
  },
  {
    id: 'E3',
    title: 'Falla mecánica en ruta (gestión de crisis)',
    context:
      'El camión turbo sufre una avería en el Valle de Aburrá y afecta el cumplimiento de la ruta Milk-Run.',
    trigger:
      'La telemetría reporta motor apagado fuera de una geocerca autorizada por más de 15 min Y el conductor marca el botón "Falla Mecánica" en su app. La IA recalcula el ETA asumiendo el tiempo de transbordo o reparación.',
    template:
      'Hola [Nombre del Cliente]. Te informa el asistente logístico de ZMK DISEÑO. Nuestro vehículo ha reportado una falla mecánica imprevista en ruta. Tu carga está completamente segura, pero el tiempo de entrega (ETA) ha sido recalculado. Estimamos llegar a las [Nueva Hora]. Te enviaremos una nueva alerta cuando el vehículo retome el movimiento. Agradecemos tu comprensión.',
  },
  {
    id: 'E4',
    title: 'Confirmación de entrega y calidad (cierre de ciclo)',
    context:
      'El cliente recibió las piezas pintadas y el conductor finaliza el proceso administrativo.',
    trigger:
      'El conductor captura firma y fotografías en la Driver App (ePOD) y el vehículo abandona la geocerca del cliente.',
    template:
      '¡Entrega completada, [Nombre del Cliente]! Nuestro conductor acaba de registrar la entrega exitosa de tu material. Puedes consultar y descargar tu Prueba de Entrega Digital (ePOD), incluyendo la firma de recepción y fotografías del estado de las piezas, en el siguiente enlace: [Link del ePOD]. ¡Gracias por confiar en la calidad de ZMK DISEÑO!',
  },
  {
    id: 'E5',
    title: 'Cliente ausente / demora en recepción (mitigación de fletes en falso)',
    context:
      'El camión llegó a la planta del cliente pero no hay personal para recibir o despachar, lo que genera un cuello de botella.',
    trigger:
      'Permanencia de más de 20 min dentro de la geocerca del cliente sin actividad registrada en la app del conductor.',
    template:
      'Hola [Nombre del Cliente]. Nuestro vehículo lleva 20 minutos esperando en tus instalaciones. Para no afectar los tiempos de entrega del resto de nuestra ruta industrial, el camión solo podrá esperar 10 minutos adicionales antes de continuar su trayecto. Por favor, confirma la disponibilidad de tu personal de muelle respondiendo a este mensaje.',
  },
] as const
