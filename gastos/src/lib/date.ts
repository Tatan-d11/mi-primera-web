import type { Period } from '../types'

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function today(): string {
  return toISODate(new Date())
}

/** Lunes de la semana a la que pertenece `date`. */
export function startOfWeek(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekday = (result.getDay() + 6) % 7
  result.setDate(result.getDate() - weekday)
  return result
}

export function endOfWeek(date: Date): Date {
  const result = startOfWeek(date)
  result.setDate(result.getDate() + 6)
  return result
}

export function shiftPeriod(anchor: Date, period: Period, direction: number): Date {
  const result = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())
  if (period === 'daily') result.setDate(result.getDate() + direction)
  if (period === 'weekly') result.setDate(result.getDate() + direction * 7)
  if (period === 'monthly') result.setMonth(result.getMonth() + direction, 1)
  return result
}

export function periodRange(anchor: Date, period: Period): { from: Date; to: Date } {
  if (period === 'daily') {
    const day = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())
    return { from: day, to: day }
  }
  if (period === 'weekly') {
    return { from: startOfWeek(anchor), to: endOfWeek(anchor) }
  }
  return {
    from: new Date(anchor.getFullYear(), anchor.getMonth(), 1),
    to: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0),
  }
}

export function isWithin(dateISO: string, from: Date, to: Date): boolean {
  const value = parseISODate(dateISO).getTime()
  return value >= from.getTime() && value <= to.getTime()
}

const dayFormatter = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' })
const shortFormatter = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })
const monthFormatter = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' })

export function formatPeriodLabel(anchor: Date, period: Period): string {
  if (period === 'daily') return capitalize(dayFormatter.format(anchor))
  if (period === 'weekly') {
    const { from, to } = periodRange(anchor, 'weekly')
    return `${shortFormatter.format(from)} - ${shortFormatter.format(to)}`
  }
  return capitalize(monthFormatter.format(anchor))
}

export function formatDayLabel(dateISO: string): string {
  return capitalize(dayFormatter.format(parseISODate(dateISO)))
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
