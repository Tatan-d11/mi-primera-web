import { useEffect, useState } from 'react'
import type { Category, Expense } from '../types'
import { CATEGORIES } from '../types'
import type { ExpenseDraft } from '../hooks/useExpenses'
import { today } from '../lib/date'

interface Props {
  editing: Expense | null
  onSubmit: (draft: ExpenseDraft) => void
  onCancelEdit: () => void
}

export function ExpenseForm({ editing, onSubmit, onCancelEdit }: Props) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Comida')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(today())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editing) return
    setAmount(String(editing.amount))
    setCategory(editing.category)
    setNote(editing.note)
    setDate(editing.date)
    setError('')
  }, [editing])

  function reset() {
    setAmount('')
    setCategory('Comida')
    setNote('')
    setDate(today())
    setError('')
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const value = Number(amount.replace(',', '.'))
    if (!Number.isFinite(value) || value <= 0) {
      setError('Ingresa un monto mayor que cero.')
      return
    }
    if (!date) {
      setError('Selecciona una fecha.')
      return
    }
    onSubmit({ amount: Math.round(value * 100) / 100, category, note: note.trim(), date })
    reset()
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{editing ? 'Editar gasto' : 'Nuevo gasto'}</h2>
        {editing && (
          <button
            type="button"
            onClick={() => {
              reset()
              onCancelEdit()
            }}
            className="text-xs text-neutral-400 underline-offset-2 hover:underline"
          >
            Cancelar
          </button>
        )}
      </div>

      <div>
        <label className="label" htmlFor="amount">
          Monto
        </label>
        <input
          id="amount"
          className="input"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="category">
          Categoría
        </label>
        <select
          id="category"
          className="input"
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="date">
          Fecha
        </label>
        <input
          id="date"
          type="date"
          className="input"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="note">
          Nota
        </label>
        <input
          id="note"
          className="input"
          placeholder="Opcional"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white"
      >
        {editing ? 'Guardar cambios' : 'Agregar gasto'}
      </button>
    </form>
  )
}
