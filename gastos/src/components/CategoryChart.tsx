import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Expense } from '../types'
import { formatAmount } from '../lib/format'

const COLORS = ['#171717', '#404040', '#525252', '#737373', '#a3a3a3', '#bfbfbf', '#d4d4d4', '#e5e5e5']

interface Props {
  expenses: Expense[]
}

export function CategoryChart({ expenses }: Props) {
  const data = byCategory(expenses)

  if (data.length === 0) {
    return (
      <div className="card text-center text-sm text-neutral-500">
        Aún no hay datos para graficar.
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="mb-3 text-sm font-semibold">Por categoría</h2>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="category" innerRadius={45} outerRadius={80}>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatAmount(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 space-y-1">
        {data.map((entry, index) => (
          <li key={entry.category} className="flex items-center gap-2 text-xs text-neutral-600">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="flex-1">{entry.category}</span>
            <span className="tabular-nums">{formatAmount(entry.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function byCategory(expenses: Expense[]): { category: string; total: number }[] {
  const totals = new Map<string, number>()
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}
