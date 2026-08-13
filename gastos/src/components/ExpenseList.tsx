import type { Expense } from '../types'
import { formatAmount } from '../lib/format'
import { formatDayLabel } from '../lib/date'
import { CATEGORY_COLORS } from '../lib/colors'

interface Props {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, onEdit, onRemove }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="card text-center text-sm text-neutral-400">
        No hay gastos en este período.
      </div>
    )
  }

  const groups = groupByDate(expenses)

  return (
    <div className="space-y-5">
      {groups.map(([date, items]) => (
        <section key={date} className="space-y-2">
          <header className="flex items-baseline justify-between px-1">
            <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              {formatDayLabel(date)}
            </h3>
            <span className="text-xs text-neutral-400">
              {formatAmount(items.reduce((total, item) => total + item.amount, 0))}
            </span>
          </header>
          <ul className="divide-y divide-neutral-800 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
            {items.map((expense) => (
              <li key={expense.id} className="flex items-center gap-3 px-4 py-3">
                <span
                  aria-hidden
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: CATEGORY_COLORS[expense.category] }}
                  >
                    {expense.category}
                  </p>
                  {expense.note && (
                    <p className="truncate text-xs text-neutral-400">{expense.note}</p>
                  )}
                </div>
                <span className="text-sm tabular-nums">{formatAmount(expense.amount)}</span>
                <button
                  type="button"
                  onClick={() => onEdit(expense)}
                  aria-label={`Editar gasto de ${expense.category}`}
                  className="rounded-lg border border-neutral-800 px-2 py-1 text-xs text-neutral-400 transition hover:border-neutral-600 hover:text-neutral-100"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(expense.id)}
                  aria-label={`Eliminar gasto de ${expense.category}`}
                  title="Eliminar"
                  className="rounded-lg border border-neutral-800 px-2 py-1 text-xs text-neutral-400 transition hover:border-red-500 hover:text-red-400"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function groupByDate(expenses: Expense[]): [string, Expense[]][] {
  const groups = new Map<string, Expense[]>()
  for (const expense of expenses) {
    const bucket = groups.get(expense.date)
    if (bucket) bucket.push(expense)
    else groups.set(expense.date, [expense])
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}
