# Madrid President Simulator 4.0 · AutoScout Pro

Proyecto fan no oficial inspirado en el Real Madrid para planificar la plantilla 2026/27 con José Mourinho.

## Novedades 4.0

- Base de datos ampliada con más jugadores fichables.
- AutoScout Pro: actualización automática de rumores desde RSS/noticias deportivas.
- Si un rumor menciona un jugador que no existe en la base, AutoScout puede crearlo como candidato fichable.
- Rumores con confianza, estado, fuente, último titular y enlaces.
- Fotos reales primero vía Wikimedia/Wikipedia y tarjeta local embebida como respaldo.
- Mantiene ventas, compras, presupuesto manual, Reality Score, análisis Mourinho, comparador y exportación.

## Subida a GitHub Pages

Reemplaza:

```text
index.html
styles.css
app.js
data.json
README.md
scripts/update-data.mjs
```

No hace falta tocar `.github` si ya tienes el workflow creado.

## AutoScout Pro

El workflow existente puede seguir ejecutando `node scripts/update-data.mjs`. El script no hace scraping masivo de Transfermarkt; usa RSS/noticias públicas y el catálogo interno.

Proyecto fan no oficial. No afiliado al Real Madrid, Transfermarkt, X ni ningún medio deportivo.
