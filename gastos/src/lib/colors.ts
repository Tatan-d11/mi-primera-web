import type { Category } from '../types'

/** Un color fijo por categoría, compartido entre la lista y la gráfica. */
export const CATEGORY_COLORS: Record<Category, string> = {
  Comida: '#f97316',
  Transporte: '#38bdf8',
  Hogar: '#a78bfa',
  Salud: '#f43f5e',
  Ocio: '#facc15',
  Compras: '#34d399',
  Servicios: '#60a5fa',
  Otros: '#94a3b8',
}
