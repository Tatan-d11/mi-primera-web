import type { Expense } from '../types'
import { formatAmount } from '../lib/format'
import { formatDayLabel } from '../lib/date'

interface Props {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, onEdit, onRemove }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="card text-center text-sm text-neutral-500">
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
            <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {formatDayLabel(date)}
            </h3>
            <span className="text-xs text-neutral-500">
              {formatAmount(items.reduce((total, item) => total + item.amount, 0))}
            </span>
          </header>
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {items.map((expense) => (
              <li key={expense.id} className="group flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{expense.category}</p>
                  {expense.note && (
                    <p className="truncate text-xs text-neutral-500">{expense.note}</p>
                  )}
                </div>
                <span className="text-sm tabular-nums">{formatAmount(expense.amount)}</span>
                <div className="flex gap-2 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => onEdit(expense)}
                    aria-label={`Editar gasto de ${expense.category}`}
                    className="text-xs text-neutral-500 hover:text-neutral-900"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(expense.id)}
                    aria-label={`Eliminar gasto de ${expense.category}`}
                    className="text-xs text-neutral-500 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
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
