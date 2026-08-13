import { useMemo, useState } from 'react'
import type { Expense, Period } from './types'
import { useExpenses } from './hooks/useExpenses'
import type { ExpenseDraft } from './hooks/useExpenses'
import { isWithin, periodRange, shiftPeriod } from './lib/date'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { PeriodTabs } from './components/PeriodTabs'
import { Summary } from './components/Summary'
import { CategoryChart } from './components/CategoryChart'
import { DataActions } from './components/DataActions'

export default function App() {
  const { expenses, addExpense, updateExpense, removeExpense, replaceAll } = useExpenses()
  const [period, setPeriod] = useState<Period>('daily')
  const [anchor, setAnchor] = useState(() => new Date())
  const [editing, setEditing] = useState<Expense | null>(null)

  const visible = useMemo(() => {
    const { from, to } = periodRange(anchor, period)
    return expenses
      .filter((expense) => isWithin(expense.date, from, to))
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  }, [expenses, anchor, period])

  function handleSubmit(draft: ExpenseDraft) {
    if (editing) {
      updateExpense(editing.id, draft)
      setEditing(null)
      return
    }
    addExpense(draft)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>
          <p className="text-sm text-neutral-500">Registro diario, semanal y mensual.</p>
        </div>
        <PeriodTabs value={period} onChange={setPeriod} />
      </header>

      <main className="grid gap-6 md:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <ExpenseForm
            editing={editing}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditing(null)}
          />
          <DataActions expenses={expenses} onImport={replaceAll} />
        </aside>

        <div className="space-y-6">
          <Summary
            expenses={visible}
            anchor={anchor}
            period={period}
            onShift={(direction) => setAnchor((current) => shiftPeriod(current, period, direction))}
            onToday={() => setAnchor(new Date())}
          />
          <CategoryChart expenses={visible} />
          <ExpenseList
            expenses={visible}
            onEdit={setEditing}
            onRemove={(id) => {
              if (editing?.id === id) setEditing(null)
              removeExpense(id)
            }}
          />
        </div>
      </main>
    </div>
  )
}
