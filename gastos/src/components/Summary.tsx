import type { Expense, Period } from '../types'
import { formatAmount } from '../lib/format'
import { formatPeriodLabel, periodRange } from '../lib/date'

interface Props {
  expenses: Expense[]
  anchor: Date
  period: Period
  onShift: (direction: number) => void
  onToday: () => void
}

export function Summary({ expenses, anchor, period, onShift, onToday }: Props) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const { from, to } = periodRange(anchor, period)
  const days = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onShift(-1)}
          aria-label="Período anterior"
          className="rounded-lg px-2 py-1 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onToday}
          className="text-sm font-medium text-neutral-300 hover:text-neutral-100"
        >
          {formatPeriodLabel(anchor, period)}
        </button>
        <button
          type="button"
          onClick={() => onShift(1)}
          aria-label="Período siguiente"
          className="rounded-lg px-2 py-1 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
        >
          →
        </button>
      </div>
      <p className="mt-4 text-center text-4xl font-semibold tabular-nums">{formatAmount(total)}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs text-neutral-400">
        <div>
          <p className="text-sm font-medium text-neutral-100">{expenses.length}</p>
          <p>Registros</p>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-100">{formatAmount(total / days)}</p>
          <p>Promedio diario</p>
        </div>
      </div>
    </div>
  )
}
