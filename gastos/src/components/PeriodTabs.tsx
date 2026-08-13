import type { Period } from '../types'

const OPTIONS: { value: Period; label: string }[] = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
]

interface Props {
  value: Period
  onChange: (period: Period) => void
}

export function PeriodTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl border border-neutral-800 bg-neutral-900 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`rounded-lg px-4 py-1.5 text-sm transition ${
            value === option.value
              ? 'bg-neutral-100 text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
