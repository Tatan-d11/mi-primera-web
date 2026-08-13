import { useRef, useState } from 'react'
import type { Expense } from '../types'
import { parseExpenses } from '../lib/storage'

interface Props {
  expenses: Expense[]
  onImport: (expenses: Expense[]) => void
}

export function DataActions({ expenses, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')

  function handleExport() {
    const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gastos-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const imported = parseExpenses(JSON.parse(await file.text()))
      onImport(imported)
      setMessage(`Se importaron ${imported.length} gastos.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo leer el archivo.')
    }
  }

  return (
    <div className="card space-y-3">
      <h2 className="text-sm font-semibold">Respaldo</h2>
      <p className="text-xs text-neutral-500">
        Los datos viven solo en este navegador. Exporta un JSON para no perderlos.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm transition hover:border-neutral-900"
        >
          Exportar
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm transition hover:border-neutral-900"
        >
          Importar
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        onChange={handleImport}
        className="hidden"
      />
      {message && <p className="text-xs text-neutral-500">{message}</p>}
    </div>
  )
}
