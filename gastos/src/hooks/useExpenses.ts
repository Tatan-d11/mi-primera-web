import { useCallback, useEffect, useState } from 'react'
import type { Expense } from '../types'
import { createId, loadExpenses, saveExpenses } from '../lib/storage'

export type ExpenseDraft = Omit<Expense, 'id' | 'createdAt'>

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses())

  useEffect(() => {
    saveExpenses(expenses)
  }, [expenses])

  const addExpense = useCallback((draft: ExpenseDraft) => {
    setExpenses((current) => [
      { ...draft, id: createId(), createdAt: new Date().toISOString() },
      ...current,
    ])
  }, [])

  const updateExpense = useCallback((id: string, draft: ExpenseDraft) => {
    setExpenses((current) =>
      current.map((expense) => (expense.id === id ? { ...expense, ...draft } : expense)),
    )
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses((current) => current.filter((expense) => expense.id !== id))
  }, [])

  const replaceAll = useCallback((next: Expense[]) => {
    setExpenses(next)
  }, [])

  return { expenses, addExpense, updateExpense, removeExpense, replaceAll }
}
