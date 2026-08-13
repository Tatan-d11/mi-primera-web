import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Category, Expense } from '../types'
import { formatAmount } from '../lib/format'
import { CATEGORY_COLORS } from '../lib/colors'

interface Props {
  expenses: Expense[]
}

export function CategoryChart({ expenses }: Props) {
  const data = byCategory(expenses)

  if (data.length === 0) {
    return (
      <div className="card text-center text-sm text-neutral-400">
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
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={45}
              outerRadius={80}
              stroke="#171717"
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatAmount(value)}
              contentStyle={{
                backgroundColor: '#171717',
                border: '1px solid #404040',
                borderRadius: 12,
                color: '#f5f5f5',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 space-y-1">
        {data.map((entry) => (
          <li key={entry.category} className="flex items-center gap-2 text-xs text-neutral-300">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
            />
            <span className="flex-1">{entry.category}</span>
            <span className="tabular-nums">{formatAmount(entry.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function byCategory(expenses: Expense[]): { category: Category; total: number }[] {
  const totals = new Map<Category, number>()
  for (const expense of expenses) {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}
