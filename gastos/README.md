# Gastos

Registro minimalista de gastos diarios, semanales y mensuales. Sin backend ni base de datos: todo se guarda en `localStorage` del navegador.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Recharts

## Uso

```bash
nvm use          # Node 22
npm install
npm run dev      # http://localhost:5173
```

Otros comandos: `npm run build`, `npm run preview`, `npm run lint`.

## Funcionalidad

- Alta, edición y borrado de gastos (monto, categoría, fecha, nota).
- Vistas diaria, semanal y mensual con navegación entre períodos.
- Total, número de registros y promedio diario del período.
- Gráfica de distribución por categoría.
- Exportar / importar JSON como respaldo, ya que los datos viven solo en el navegador.
