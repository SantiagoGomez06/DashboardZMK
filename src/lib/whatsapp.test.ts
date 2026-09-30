import { describe, expect, it } from 'vitest'
import { whatsappScenarios } from '../data/whatsapp'
import { fillWhatsAppTemplate } from './whatsapp'

describe('mensajes WhatsApp (fuente exacta)', () => {
  it('conserva los 6 textos carácter por carácter', () => {
    const e0 = whatsappScenarios.find((s) => s.id === 'E0')?.template
    const e1 = whatsappScenarios.find((s) => s.id === 'E1')?.template
    const e2 = whatsappScenarios.find((s) => s.id === 'E2')?.template
    const e3 = whatsappScenarios.find((s) => s.id === 'E3')?.template
    const e4 = whatsappScenarios.find((s) => s.id === 'E4')?.template
    const e5 = whatsappScenarios.find((s) => s.id === 'E5')?.template
    expect(e0).toBe(
      'Hola [Nombre del Cliente], soy el asistente logístico de ZMK DISEÑO. Tu entrega de piezas con recubrimiento electrostático presenta una actualización de ruta. Debido a congestión vehicular, el nuevo tiempo estimado de llegada (ETA) es a las 10:45 AM. Puedes seguir el recorrido de tu carga en vivo aquí: [Link del Mapa Interactivo].',
    )
    expect(e1).toBe(
      'Hola [Nombre del Cliente]. Nuestro camión ZMK está a 15 minutos de tus instalaciones para recolectar tu lote de piezas. Para garantizar un recubrimiento electrostático perfecto, te recordamos verificar que las piezas estén listas: ⚠️ No deben tener restos de pintura líquida. ⚠️ Deben ser componentes 100% metálicos (retirar plásticos o gomas). ⚠️ Si aplicaron masilla, debe ser estrictamente de alta temperatura. Nuestro conductor validará estos puntos al cargar. Sigue el camión aquí: [Link del Mapa]',
    )
    expect(e2).toBe(
      '¡Buenas noticias, [Nombre del Cliente]! Tu lote de piezas con recubrimiento electrostático está a punto de llegar. El camión se encuentra a menos de 10 minutos. Por favor, asegúrate de tener el área de recepción y el personal de descargue listos para agilizar el proceso. Sigue la ruta en vivo: [Link del Mapa]',
    )
    expect(e3).toBe(
      'Hola [Nombre del Cliente]. Te informa el asistente logístico de ZMK DISEÑO. Nuestro vehículo ha reportado una falla mecánica imprevista en ruta. Tu carga está completamente segura, pero el tiempo de entrega (ETA) ha sido recalculado. Estimamos llegar a las [Nueva Hora]. Te enviaremos una nueva alerta cuando el vehículo retome el movimiento. Agradecemos tu comprensión.',
    )
    expect(e4).toBe(
      '¡Entrega completada, [Nombre del Cliente]! Nuestro conductor acaba de registrar la entrega exitosa de tu material. Puedes consultar y descargar tu Prueba de Entrega Digital (ePOD), incluyendo la firma de recepción y fotografías del estado de las piezas, en el siguiente enlace: [Link del ePOD]. ¡Gracias por confiar en la calidad de ZMK DISEÑO!',
    )
    expect(e5).toBe(
      'Hola [Nombre del Cliente]. Nuestro vehículo lleva 20 minutos esperando en tus instalaciones. Para no afectar los tiempos de entrega del resto de nuestra ruta industrial, el camión solo podrá esperar 10 minutos adicionales antes de continuar su trayecto. Por favor, confirma la disponibilidad de tu personal de muelle respondiendo a este mensaje.',
    )
  })

  it('reemplaza solo placeholders', () => {
    const filled = fillWhatsAppTemplate(
      'Hola [Nombre del Cliente]. ETA [Nueva Hora].',
      { clientName: 'Cliente A', newTime: '11:20 AM' },
    )
    expect(filled).toBe('Hola Cliente A. ETA 11:20 AM.')
  })
})
