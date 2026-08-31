---
name: testing-gastos
description: How to run and end-to-end test the `gastos` expense tracker app (React 19 + Vite + Tailwind + Recharts, localStorage-only) in a browser.
---

# Testing the `gastos` app

## Running it
- Node 22 is required (`.nvmrc`); Node 20.18 breaks `oxlint`/`vite 8`.
  `source ~/.nvm/nvm.sh && nvm use 22 && npm install && npm run dev -- --port 5173`
- App URL: http://localhost:5173. No backend, no auth, no secrets needed.

## Devin Secrets Needed
None.

## State / preconditions
- All data lives in `localStorage` under `gastos:expenses:v1`. A previous session can
  leave stray expenses behind, which skews totals. Before testing, check the
  "Registros" counter is `0`; if not, delete leftover rows through the UI (preferred,
  visible in recordings) rather than clearing storage from devtools.

## UI notes (Spanish)
- Period tabs top-right: `Diario` / `Semanal` / `Mensual`. Week starts Monday.
  Pick test dates so "yesterday" is in the same ISO week, unless the Monday/Sunday
  boundary is exactly what you want to test.
- Summary card: `←` / `→` shift the period; clicking the centre label jumps back to today.
- Row action buttons (`Editar` / `Eliminar`) are `opacity-0` until hover — you must
  `mouse_move` over the row before clicking; a blind click will miss.
- Amount validation error text: `Ingresa un monto mayor que cero.` (empty, 0, negative, non-numeric).
- Import errors come from `parseExpenses`: `El archivo no contiene una lista de gastos.` /
  `Monto inválido en el archivo.` / `Fecha inválida en el archivo.`

## File pickers (Importar)
The native GTK "Open File" dialog opens. Fastest reliable path: press `ctrl+l` and type
the absolute path + Enter. Exported backups land in `~/Downloads/gastos-YYYY-MM-DD.json`;
verify contents with the shell rather than the UI.

## Things worth asserting
- The date chosen in the form must equal the day header the expense is grouped under
  (guards against UTC day-shift regressions; dates are parsed with `new Date(y, m-1, d)`).
- `Promedio diario` = total / days in period (1 / 7 / days-in-month), and `Registros`
  = number of visible expenses.
- Chart legend amounts must equal the per-category sums of the visible period.
