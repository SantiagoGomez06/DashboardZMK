import { describe, expect, it } from 'vitest'
import { clockToMinutes, delayMinutesForEvent, minutesToClock, recalcEta } from './eta'

describe('ETA simulado', () => {
  it('formatea y parsea reloj 12h', () => {
    expect(minutesToClock(10 * 60 + 45)).toBe('10:45 AM')
    expect(clockToMinutes('10:45 AM')).toBe(10 * 60 + 45)
    expect(minutesToClock(clockToMinutes('03:15 PM'))).toBe('03:15 PM')
  })

  it('suma demoras de eventos', () => {
    const base = 8 * 60
    const next = recalcEta(base, ['congestion', 'mechanical'])
    expect(next).toBe(base + delayMinutesForEvent('congestion') + delayMinutesForEvent('mechanical'))
    expect(minutesToClock(next)).toBe(minutesToClock(8 * 60 + 25 + 45))
  })
})
