const currencyFormatter = new Intl.NumberFormat('es', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

export function formatAmount(value: number): string {
  return `$${currencyFormatter.format(value)}`
}
