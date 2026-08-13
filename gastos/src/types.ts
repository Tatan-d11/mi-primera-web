export type Category =
  | 'Comida'
  | 'Transporte'
  | 'Hogar'
  | 'Salud'
  | 'Ocio'
  | 'Compras'
  | 'Servicios'
  | 'Otros'

export const CATEGORIES: Category[] = [
  'Comida',
  'Transporte',
  'Hogar',
  'Salud',
  'Ocio',
  'Compras',
  'Servicios',
  'Otros',
]

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Expense {
  id: string
  /** Monto en la moneda local, siempre positivo. */
  amount: number
  category: Category
  note: string
  /** Fecha del gasto en formato YYYY-MM-DD. */
  date: string
  createdAt: string
}
