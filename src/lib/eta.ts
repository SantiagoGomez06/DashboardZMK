/** ETA simulado: minutos desde medianoche. No es un dato medido de ZMK. */
export function minutesToClock(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(normalized / 60)
  const m = Math.floor(normalized % 60)
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export function clockToMinutes(clock: string): number {
  const match = clock.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return 8 * 60
  let h = Number(match[1])
  const m = Number(match[2])
  const ampm = match[3].toUpperCase()
  if (ampm === 'AM') {
    if (h === 12) h = 0
  } else if (h !== 12) {
    h += 12
  }
  return h * 60 + m
}

export type EtaEvent =
  | 'congestion'
  | 'deviation'
  | 'stopped15'
  | 'mechanical'
  | 'absent20'
  | 'none'

export function delayMinutesForEvent(event: EtaEvent): number {
  switch (event) {
    case 'congestion':
      return 25
    case 'deviation':
      return 8
    case 'stopped15':
      return 15
    case 'mechanical':
      return 45
    case 'absent20':
      return 20
    default:
      return 0
  }
}

export function recalcEta(baseMinutes: number, events: readonly EtaEvent[]): number {
  return events.reduce((acc, e) => acc + delayMinutesForEvent(e), baseMinutes)
}
