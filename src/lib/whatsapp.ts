export type WhatsAppVars = {
  clientName: string
  newTime: string
  mapLink?: string
  epodLink?: string
}

export function fillWhatsAppTemplate(template: string, vars: WhatsAppVars): string {
  return template
    .replaceAll('[Nombre del Cliente]', vars.clientName)
    .replaceAll('[Nueva Hora]', vars.newTime)
    .replaceAll('[Link del Mapa Interactivo]', vars.mapLink ?? '[Link del Mapa Interactivo]')
    .replaceAll('[Link del Mapa]', vars.mapLink ?? '[Link del Mapa]')
    .replaceAll('[Link del ePOD]', vars.epodLink ?? '[Link del ePOD]')
}
