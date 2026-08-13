import type { Category, Expense } from '../types'
import { CATEGORIES } from '../types'

const STORAGE_KEY = 'gastos:expenses:v1'

export function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return parseExpenses(JSON.parse(raw))
  } catch {
    return []
  }
}

export function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch {
    // El almacenamiento puede estar lleno o deshabilitado; los datos siguen en memoria.
  }
}

/** Valida datos externos (import de JSON o localStorage manipulado). */
export function parseExpenses(input: unknown): Expense[] {
  if (!Array.isArray(input)) throw new Error('El archivo no contiene una lista de gastos.')
  return input.map(parseExpense)
}

function parseExpense(input: unknown): Expense {
  if (typeof input !== 'object' || input === null) throw new Error('Gasto inválido.')
  const record = input as Record<string, unknown>
  const amount = Number(record.amount)
  const date = String(record.date ?? '')
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Monto inválido en el archivo.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Fecha inválida en el archivo.')
  return {
    id: typeof record.id === 'string' && record.id ? record.id : createId(),
    amount,
    category: toCategory(record.category),
    note: typeof record.note === 'string' ? record.note : '',
    date,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
  }
}

function toCategory(value: unknown): Category {
  return CATEGORIES.includes(value as Category) ? (value as Category) : 'Otros'
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}
